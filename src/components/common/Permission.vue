<!-- <template>
  <div v-if="hasPermission">
    <slot></slot>
  </div>
  <div v-else-if="showMessage" class="permission-denied">
    <el-alert
      title="权限不足"
      description="您没有访问此功能的权限，请联系管理员。"
      type="warning"
      show-icon
      :closable="false"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  // 所需权限角色，可以是单个角色或角色数组
  roles: {
    type: [String, Array],
    required: true
  },
  // 是否显示权限不足提示
  showMessage: {
    type: Boolean,
    default: true
  }
})

const userStore = useUserStore()

// 检查用户是否有权限
const hasPermission = computed(() => {
  const userRole = userStore.userInfo?.role
  
  if (!userRole) {
    return false
  }
  
  // 检查角色权限
  if (Array.isArray(props.roles)) {
    return props.roles.includes(userRole)
  } else {
    return props.roles === userRole
  }
})
</script>

<style scoped>
.permission-denied {
  padding: 20px;
  text-align: center;
}
</style>  -->