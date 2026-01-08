import { getPermissions, getProfile } from '@/services/account'
import { useRequest } from '@umijs/max'
import { message } from 'antd'

export default () => {
  // 获取用户信息
  const {
    run: getProfileRequest,
    data: userInfo,
    loading,
  } = useRequest(getProfile, {
    manual: true,
    onSuccess: (profileData) => {
      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify(profileData))
    },
    onError: (error) => {
      message.error(`获取用户信息失败: ${error.message}`)
    },
  })

  const { run: getPermissionsRequest, data: permissions } = useRequest(getPermissions, {
    manual: true,
    onSuccess: (permissionsData) => {
      // 存储权限列表
      localStorage.setItem('permissions', JSON.stringify(permissionsData))
    },
    onError: (error) => {
      message.error(`获取权限列表失败: ${error.message}`)
    },
  })

  const initProfile = async () => {
    const results = await Promise.all([getProfileRequest(), getPermissionsRequest()])
    const [profileData, permissionsData] = results
    // 构建完整的用户信息
    const userInfo = {
      ...profileData,
      permissions: permissionsData,
    }
    // 存储用户信息到本地
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  return {
    getProfileRequest,
    userInfo,
    loading,
    initProfile,
  }
}
