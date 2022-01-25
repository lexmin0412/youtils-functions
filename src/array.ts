/**
 * 数组去重
 */
export const purifyArr = (arr: string[]) => {
	return Array.from(new Set(arr))
}

/**
 * 根据key寻找节点
 * @param data 数据源
 * @param key 目标节点key
 * @param isFindParent 是否寻找key所在的父节点
 * @returns
 */
export const findNodeByKey = (
	data: any[],
	key: string,
	isFindParent: boolean,
	keyName = 'key',
): any => {
	for (let index = 0;index < data.length;index++) {
		const item = data[index]
		if (!isFindParent) {
			if (item[keyName] === key) {
				return item
			} else if (isTrueArray(item.children)) {
				const node = findNodeByKey(item.children, key, false, keyName)
				if (node) {
					return node
				}
			}
		} else {
			// 寻找父元素
			if (isTrueArray(item.children)) {
				const hasItem = item.children.find((ele: any) => ele[keyName] === key)
				if (hasItem) {
					return item
				} else {
					const node = findNodeByKey(item.children, key, isFindParent, keyName)
					if (node) {
						return node
					}
				}
			}
		}
	}
}

export const sortDataById = (data: any, prefix = '1', parentNodes = []): SortedTreeNode[] => {
	const newData = _.cloneDeep(data)
	newData.forEach((element: any, index: number) => {
		element.sortId = `${prefix}.${index + 1}`
		element.parentNodes = parentNodes
		const newParentNodes: any = [...parentNodes]
		if (element.children && element.children.length) {
			newParentNodes.unshift(element)
			element.children = sortDataById(element.children, element.sortId, newParentNodes)
		}
	})
	return newData
}

/**
 * 递归寻找元素
 * @param data 数据源
 * @param key 目标节点key
 * @param writeFieds 需要覆盖的属性
 * @returns 返回包装后的对象
 */
export const findAndWrap = (data: any[], key: string | number = '', writeFieds?: any): any => {
	for (let index = 0;index < data.length;index++) {
		const item = data[index]
		if (item.key.toString() === key.toString()) {
			data[index] = {...item, ...writeFieds}
			return {
				parentData: data,
				data: item,
				index,
			}
		} else if (isTrueArray(item.children)) {
			const childrenItem: any = findAndWrap(item.children, key, writeFieds)
			if (childrenItem) {
				return childrenItem
			}
		}
	}
}

/**
 * 通过key找到所有直系亲属
 * @param data
 * @param key
 * @param arr
 */
export const findParents = (data: any, key: string, arr: any[] = []): any[] => {
	const currentParent = findNodeByKey(data, key, true)
	if (!currentParent) {
		return arr
	}
	arr.push(currentParent.key)
	return findParents(data, currentParent.key, arr)
}

/**
 * 是否是一个有长度的数组
 * @param array
 * @returns
 */
export const isTrueArray = (array: any): boolean => {
	return !!(array && array.length > 0)
}

/**
 * 递归获取树中的指定属性
 */
export const getAttrsFromArr = (arr: any[] = [], keyName: string, result: any[] = []): any[] => {
	arr.forEach((item) => {
		result.push(item[keyName])
		if (item.children) {
			const current = getAttrsFromArr(item.children, keyName)
			result.push(...current)
		}
	})
	return result
}

/**
 * 比较版本号
 * @param v1
 * @param v2
 * @returns
 */
export function compareVer(v1: string, v2: string) {
	const [hash1, hash2] = [v1.split('.'), v2.split('.')].map((nums) =>
		nums.reduce(
			(acc: any, cur: any, index) => acc + Number(cur) * Math.pow(1000, 4 - index),
			0,
		),
	)
	return hash1 < hash2
}

/**
 * 在数组中找到某个元素，如果有就删掉，没有就push
 */
export const checkOrNot = (arr: any[], ele: any, key?: string): string[] => {
	const checkKey = key ? ele[key] : ele

	const existedIndex = arr.findIndex((item: any) => item === checkKey)
	if (existedIndex > -1) {
		arr.splice(existedIndex, 1)
	} else {
		arr.push(ele.key)
	}
	return arr
}
