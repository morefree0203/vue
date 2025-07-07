// 检查Web Crypto API支持
const isWebCryptoSupported = () => {
  return window.crypto && window.crypto.subtle
}

// 生成加密密钥
const generateKey = async () => {
  if (!isWebCryptoSupported()) {
    throw new Error('浏览器不支持Web Crypto API')
  }
  
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
  return key
}

// 加密数据
const encryptData = async (data, key) => {
  if (!isWebCryptoSupported()) {
    throw new Error('浏览器不支持Web Crypto API')
  }
  
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedData = encoder.encode(JSON.stringify(data))
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  )
  
  // 将IV和加密数据合并并转换为base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

// 解密数据
const decryptData = async (encryptedData, key) => {
  if (!isWebCryptoSupported()) {
    throw new Error('浏览器不支持Web Crypto API')
  }
  
  try {
    const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    )
    
    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(decrypted))
  } catch (error) {
    console.error('解密失败:', error)
    return null
  }
}

// 保存账号信息（加密）
const saveAccount = async (accountData) => {
  try {
    if (!isWebCryptoSupported()) {
      console.warn('您的浏览器不支持安全加密，将使用简单存储')
      // 降级方案：使用简单的base64编码（不推荐，但提供兼容性）
      const encodedData = btoa(JSON.stringify(accountData))
      localStorage.setItem('encodedAccount', encodedData)
      localStorage.setItem('rememberLogin', 'true')
      return
    }
    
    const key = await generateKey()
    const encryptedData = await encryptData(accountData, key)
    
    // 导出密钥并保存
    const exportedKey = await crypto.subtle.exportKey('raw', key)
    const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
    
    localStorage.setItem('encryptedAccount', encryptedData)
    localStorage.setItem('accountKey', keyString)
    localStorage.setItem('rememberLogin', 'true')
  } catch (error) {
    console.error('保存账号信息失败:', error)
    throw error // 抛出错误，让调用者处理
  }
}

// 加载保存的账号信息（解密）
const loadSavedAccount = async () => {
  try {
    if (!isWebCryptoSupported()) {
      // 降级方案：使用简单的base64解码
      const encodedData = localStorage.getItem('encodedAccount')
      if (encodedData) {
        const accountData = JSON.parse(atob(encodedData))
        return accountData // 返回数据，不直接修改外部变量
      }
      return null
    }
    
    const encryptedData = localStorage.getItem('encryptedAccount')
    const keyString = localStorage.getItem('accountKey')
    
    if (encryptedData && keyString) {
      // 导入密钥
      const keyBytes = new Uint8Array(atob(keyString).split('').map(char => char.charCodeAt(0)))
      const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
      
      // 解密数据
      const accountData = await decryptData(encryptedData, key)
      return accountData // 返回数据，不直接修改外部变量
    }
    return null
  } catch (error) {
    console.error('加载账号信息失败:', error)
    // 如果解密失败，清除保存的数据
    clearSavedAccount()
    return null
  }
}

// 清除保存的账号信息
const clearSavedAccount = () => {
  localStorage.removeItem('encryptedAccount')
  localStorage.removeItem('accountKey')
  localStorage.removeItem('encodedAccount') // 兼容降级方案
  localStorage.removeItem('rememberLogin')
}

// 正确的命名导出
export {
  isWebCryptoSupported,
  generateKey,
  encryptData,
  decryptData,
  saveAccount,
  loadSavedAccount,
  clearSavedAccount
}