// src/utils/date.js

/**
 * 获取当前学年
 * 规则：9月-12月为当年-次年，1月-8月为上一年-当年
 */
export function getCurrentAcademicYear() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // getMonth()是0-11
    if (month >= 9) {
      return `${year}-${year + 1}`
    } else {
      return `${year - 1}-${year}`
    }
  }
  
  /**
   * 获取当前学期号
   * 规则：2-8月为2，9-1月为1
   */
export function getCurrentSemester() {
    const month = new Date().getMonth() + 1
    if (month >= 2 && month <= 8) {
      return '2'
    } else {
      return '1'
    }
  }