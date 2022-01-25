/**
 * 滚动指定元素到可视区域
 * @param childSelector 子元素选择器
 * @param parentSelector 父元素选择器
 * @returns
 */
export const scrollElementIntoView = (childSelector: string, parentSelector: string) => {
	const parent: any = document.querySelector(parentSelector)
	const child: any = document.querySelector(childSelector)
	if (!child || !parent) {
		return
	}
	const windowHeight = document.body.clientHeight || document.documentElement.clientHeight
	const rectTop = child.getBoundingClientRect().top
	const parentRectTop = parent?.getBoundingClientRect().top

	// scrollIntoViewIfNeeded兼容处理，不支持则使用scrollIntoView
	if (child.scrollIntoViewIfNeeded) {
		child.scrollIntoViewIfNeeded({
			behavior: 'smooth',
			block: 'nearest',
		})
	} else if (child.scrollIntoView) {
		// 判断是否在可视区域内，如果在则不用滚动
		if (rectTop >= windowHeight || rectTop < parentRectTop) {
			child.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}
}

export const CURSOR_POSITION: {[key: string]: CursorPositionType} = {
	TOP: 'top',
	CENTER: 'center',
	BOTTOM: 'bottom',
}

/**
 * 鼠标在元素中垂直方向的位置
 * top 顶部 0～20%
 * center 中间 20%~80%
 * bottom 底部 80%~100%
 */
export type CursorPositionType = 'top' | 'center' | 'bottom'

export const getCursorPosition = (event: any): CursorPositionType => {
	const top = event.target.getBoundingClientRect().top
	const pageY = event.pageY - top
	const ypercent = (pageY / event.target.clientHeight) * 100
	if (ypercent < 20) {
		return CURSOR_POSITION.TOP
	}
	if (ypercent < 80) {
		return CURSOR_POSITION.CENTER
	}
	return CURSOR_POSITION.BOTTOM
}

