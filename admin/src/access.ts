export default (initialState: { name?: string; userId?: string; token?: string; permissions?: string[] }) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access

  // 判断是否可以访问需要认证的路由
  const canAccess = !!(initialState && initialState.token)
  console.log("canAccess:", canAccess, initialState)

  // 判断是否有特定权限
  const hasPermission = (permission: string) => {
    return initialState?.permissions?.includes(permission) || false
  }

  // 示例：判断是否可以访问 admin 相关功能
  const canSeeAdmin = hasPermission("admin:access")

  return {
    canAccess,
    canSeeAdmin,
    hasPermission,
  }
}
