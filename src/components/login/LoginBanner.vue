<template>
    <div class="banner">
      <div class="banner-main">
        <img class="banner-bg" src="@/assets/banner-bg.png" alt="宣传背景" />
        <div class="banner-content">
          <div class="banner-title">武汉工程科技学院</div>
          <div class="banner-desc">教学质量评估系统</div>
          <div class="banner-features">
            <div>师生体验升级</div>
            <div>功能便捷丰富</div>
            <div>积极及时反馈</div>
          </div>
          <div class="banner-cards">
            <div class="card">规范建设标准</div>
            <div class="card">师生体验升级</div>
            <div class="card">个性化设置应用</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .banner {
    flex: 1 1 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f8fd;
    min-width: 0;
    position: relative;
    overflow: hidden;
    margin-top: 32px;
  }
  .banner-main {
    position: relative;
    width: 100%;
    max-width: 100%;
    /* min-width: 100%;  */
    margin-right: 30px;
    margin-left: 30px;
    height: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;

  }
  .banner-bg {
    position: absolute;
    left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; opacity: 0.8; 
    border-radius:10px; /* 添加圆角效果 */
    overflow: hidden; 
  }
  .banner-content {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 32px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .banner-title {
    font-size: 2.2rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 8px;
  }
  .banner-desc {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 18px;
  }
  .banner-features {
    display: flex;
    gap: 18px;
    color: #085bb6;
    font-size: 1rem;
    margin-bottom: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .banner-cards {
    display: flex;
    gap: 24px;
    margin-top: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .card {
    background: #fff;
    border: 1.5px solid #e3e8f0;
    border-radius: 12px;
    padding: 18px 32px;
    font-size: 1.1rem;
    color: #085bb6;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  @media (max-width: 900px) {
    .banner {
      display: none;
    }
  }
  </style>
  