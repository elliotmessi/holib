type AnyObject = Record<string, any>
export type TreeNode<T extends AnyObject = AnyObject> = T & {
  id: number
  parentId?: number
  children?: TreeNode<T>[]
}

export type ListNode<T extends AnyObject = AnyObject> = T & {
  id: number
  parentId?: number
}

export function list2Tree<T extends ListNode[]>(
  items: T,
  parentId?: number | null,
): TreeNode<T[number]>[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const children = list2Tree(items, item.id)
      return {
        ...item,
        ...(children.length ? { children } : null),
      }
    })
}

/**
 * 将树结构转换为列表结构
 * @param treeData
 */
export function tree2List<T extends TreeNode>(treeData: TreeNode<T>[]) {
  const loopFlat = (list?: TreeNode<T>[], parentId?: number) =>
    list?.flatMap<ListNode<T>>((item) => {
      const { children, ...rest } = item
      const newItem = { ...rest, parentId }
      return children.length ? [newItem, ...loopFlat(children, item.id)] : [newItem]
    }) || []

  return loopFlat(treeData)
}

/**
 * 过滤树，并保留原有的结构
 * @param treeData
 * @param predicate
 */
export function filterTree<T extends TreeNode>(
  treeData: TreeNode<T>[],
  predicate: (data: T) => boolean,
): TreeNode<T>[] {
  function filter(treeData: TreeNode<T>[]): TreeNode<T>[] {
    if (!treeData?.length) return treeData

    return treeData.filter((data) => {
      if (!predicate(data)) return false

      data.children = filter(data.children)
      return true
    })
  }

  return filter(treeData) || []
}

export function deleteEmptyChildren(arr?: TreeNode[]) {
  arr?.forEach((node) => {
    if (node.children?.length === 0) delete node.children
    else deleteEmptyChildren(node.children)
  })
}
