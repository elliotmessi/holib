import { Menu } from "@/services/account"
import { MenuDataItem } from "@ant-design/pro-components"

// 将动态菜单转换为 IBestAFSRoute 类型
export interface IBestAFSRoute {
  id?: string
  name?: string
  path: string
  component?: string
  redirect?: string
  access?: string
  layout?: boolean
  children?: IBestAFSRoute[]
  meta?: any
  weight?: number

  icon?: string
  // 更多功能查看
  // https://beta-pro.ant.design/docs/advanced-menu
  // ---
  target?: string
  // 不展示顶栏
  headerRender?: boolean
  // 不展示页脚
  footerRender?: boolean
  // 不展示菜单
  menuRender?: boolean
  // 不展示菜单顶栏
  menuHeaderRender?: boolean
  // 隐藏子菜单
  hideChildrenInMenu?: boolean
  // 隐藏自己和子菜单
  hideInMenu?: boolean
  // 在面包屑中隐藏
  hideInBreadcrumb?: boolean
  // 子项往上提，仍旧展示,
  flatMenu?: boolean
}

// 将单个菜单转换为 IBestAFSRoute 类型，递归处理子菜单
// 过滤掉没有path的菜单
const convertMenuToRoute = (menu: Menu): IBestAFSRoute | null => {
  // 过滤掉没有path的菜单
  if (!menu.path) {
    return null
  }

  // 递归处理子菜单，并过滤掉没有path的子菜单
  const children = menu.children?.map(convertMenuToRoute).filter((child): child is IBestAFSRoute => child !== null)

  return {
    id: menu.id.toString(),
    name: menu.name,
    path: menu.path,
    component: menu.component || undefined,
    weight: menu.orderNo || 0,
    access: menu.permission,
    icon: menu.icon,
    hideInMenu: menu.show !== 1,
    target: menu.isExt ? "_blank" : "_self",
    // 如果是外部链接且没有组件，设置为 iframe
    // 如果是目录类型（type=0）且没有组件，可能是重定向或父菜单
    redirect: menu.type === 0 && !menu.component ? menu.path : undefined,
    meta: {
      title: menu.name,
      icon: menu.icon,
      keepAlive: menu.keepAlive === 1,
    },
    // 只保留有子菜单的情况
    children: children?.length ? children : undefined,
  }
}

// 合并菜单：动态菜单覆盖静态菜单，相同路径的菜单，动态菜单优先级更高
const mergeMenus = (staticMenus: IBestAFSRoute[], dynamicMenus: Menu[]): IBestAFSRoute[] => {
  // 直接将动态菜单转换为 IBestAFSRoute 数组，保留原有树形结构，并过滤掉没有path的菜单
  const dynamicRoutes = dynamicMenus.map(convertMenuToRoute).filter((route): route is IBestAFSRoute => route !== null)
  const mergedMenus: IBestAFSRoute[] = [...staticMenus]

  // 递归合并菜单
  const mergeRecursive = (parent: IBestAFSRoute[], children: IBestAFSRoute[]) => {
    children.forEach(child => {
      const existingIndex = parent.findIndex(item => item.path === child.path)
      if (existingIndex >= 0) {
        // 相同路径的菜单，动态菜单覆盖静态菜单
        const mergedChild = {
          ...parent[existingIndex],
          ...child,
        }
        // 递归合并子菜单
        if (child.children && parent[existingIndex].children) {
          mergedChild.children = mergeRecursive(parent[existingIndex].children || [], child.children || [])
        } else if (child.children) {
          mergedChild.children = child.children
        }
        parent[existingIndex] = mergedChild
      } else {
        // 新菜单，直接添加
        parent.push(child)
      }
    })
    return parent
  }

  return mergeRecursive(mergedMenus, dynamicRoutes)
}

// 根据权重排序菜单，递归排序子菜单
const sortMenusByWeight = (menus: IBestAFSRoute[]): IBestAFSRoute[] => {
  return menus
    .sort((a, b) => {
      const weightA = a.weight || 0
      const weightB = b.weight || 0
      return weightA - weightB
    })
    .map(menu => {
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: sortMenusByWeight(menu.children),
        }
      }
      return menu
    })
}

export { convertMenuToRoute, mergeMenus, sortMenusByWeight }
