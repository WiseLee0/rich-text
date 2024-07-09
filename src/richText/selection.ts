class RichSelectionStore {
    anchor = [-1, -1] // 选区开始, [每行的下标，当前行字符的下标]
    focus = [-1, -1]  // 选区结束，[每行的下标，当前行字符的下标]
    setRange(anchor: number[], focus: number[]) {
        this.anchor = anchor
        this.focus = focus
    }
    setFocus(focus: number[]) {
        this.focus = focus
    }
    setAnchor(anchor: number[]) {
        this.anchor = anchor
    }
    get hasRange() {
        return this.focus[0] !== -1 && this.anchor[0] !== -1
    }
    get isCollapse() {
        return this.focus[0] === this.anchor[0] && this.focus[1] === this.anchor[1]
    }
    reset() {
        this.setRange([-1, -1], [-1, -1])
    }
    updateOffset(offset: number) {
        const anchorOffset = this.anchor[1] + offset
        const focusOffset = this.focus[1] + offset
        this.anchor = [this.anchor[0], anchorOffset]
        this.focus = [this.focus[0], focusOffset]
    }
}
const RichSelection = new RichSelectionStore()
export default RichSelection;