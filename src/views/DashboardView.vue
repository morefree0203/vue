<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>欢迎使用教学质量评估系统</h2>
          <p>本系统致力于提升教学质量，促进师生共同发展。</p>
        </div>
        <div class="welcome-image">
          <el-icon size="80" color="#b3c6e0"><School /></el-icon>
        </div>
      </div>
    </el-card>

    <!-- 系统简介 -->
    <el-card class="intro-card" style="margin-top: 20px;">
      <div class="intro-content">
        <h3>系统简介</h3>
        <p>
          教学质量评估系统为学校师生和管理人员提供了课程管理、教学评价、组织管理、统计分析、系统管理等多种功能模块，支持多角色协同工作，助力学校教学质量提升。
        </p>
        <ul>
          <li>课程管理：课程信息、选课、教师分配等</li>
          <li>教学评价：学生、教师、督导等多维度评价</li>
          <li>组织管理：学院、系、专业、班级管理</li>
          <li>统计分析：多维度数据统计与分析</li>
          <li>系统管理：用户、权限、系统设置等</li>
        </ul>
      </div>
    </el-card>

    <!-- 操作指引 -->
    <el-card class="help-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>操作指引</span>
        </div>
      </template>
      <div class="help-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="help-item">
              <el-icon size="32" color="#409EFF"><QuestionFilled /></el-icon>
              <h4>如何开始？</h4>
              <p>请通过左侧菜单进入各功能模块，根据您的角色进行相应操作。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="help-item">
              <el-icon size="32" color="#67C23A"><Document /></el-icon>
              <h4>常用功能</h4>
              <p>如课程管理、教学评价、组织管理等，均可在左侧菜单找到入口。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="help-item">
              <el-icon size="32" color="#F56C6C"><Service /></el-icon>
              <h4>遇到问题？</h4>
              <p>如遇系统问题，请联系相关老师或管理员。</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { School, QuestionFilled, Document, Service } from '@element-plus/icons-vue'
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.welcome-card {
  background: #fff;
  color: #303133;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border-radius: 10px;
}
.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.welcome-text h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
  color: #222;
}
.welcome-text p {
  margin: 0;
  font-size: 16px;
  color: #666;
  opacity: 1;
}
.intro-card {
  margin-top: 20px;
  border-radius: 10px;
}
.intro-content {
  padding: 20px 10px 0px 10px;
}

.intro-content h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 20px;
  font-weight: bold;
}

.intro-content p {
  margin: 0 0 16px 0;
  color: #606266;
  font-size: 15px;
  line-height: 1.8;
}

.intro-content ul {
  margin: 0;
  padding-left: 24px;
  color: #606266;
  font-size: 15px;
  line-height: 2;
}

.intro-content li {
  margin-bottom: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.help-card {
  border-radius: 10px;
}
.help-content {
  padding: 10px 0;
}
.help-item {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
}
.help-item .el-icon {
  margin-bottom: 10px;
}
.help-item h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
  font-weight: bold;
}
.help-item p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}
</style> 