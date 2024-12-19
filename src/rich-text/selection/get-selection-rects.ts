import { getLineFirstCharacterList, getLineIndentationLevelPixels, Rect, SelectionInterface } from "..";
import { getFontLineHeight } from "..";

export const getSelectionRects: SelectionInterface['getSelectionRects'] = (editor) => {
    if (!editor.isEditor || !editor.hasSelection()) return []
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baselines = editor.getBaselines() ?? []
    const fontLineHeight = getFontLineHeight(editor)
    if (!editor.textData.characters.length) {
        const style = editor.getStyle()
        const indentationLevel = editor.textData.lines?.[editor.textData.lines?.length - 1].indentationLevel ?? 0
        let startX = 0
        let startY = 0
        if (indentationLevel > 0) {
            startX += indentationLevel * style.fontSize * 1.5
        }
        if (style.paragraphIndent > 0) {
            startX += style.paragraphIndent
        }
        if (style.textAlignHorizontal === 'CENTER') {
            startX = (startX + editor.width) / 2
        }
        if (style.textAlignHorizontal === 'RIGHT') {
            startX = editor.width
        }
        if (editor.style.textAlignVertical === 'MIDDLE') {
            startY = (editor.height + editor.style.fontSize * 0.7) / 2 - editor.style.fontSize
        }
        if (editor.style.textAlignVertical === 'BOTTOM') {
            startY = editor.height - editor.style.fontSize * 0.3 - editor.style.fontSize
        }

        return [[startX, startY, 1, fontLineHeight]]
    }
    const lineFirstCharacterList = getLineFirstCharacterList(editor)

    const result: Rect[] = []

    if (anchor === baselines.length && anchorOffset === 0) {
        const lastBaseLine = baselines[baselines.length - 1]
        const indentationLevel = editor.textData.lines?.[editor.textData.lines?.length - 1].indentationLevel ?? 0
        let startX = 0
        const style = editor.getStyle()
        if (indentationLevel > 0) {
            startX += indentationLevel * style.fontSize * 1.5
        }
        if (style.paragraphIndent > 0) {
            startX += style.paragraphIndent
        }
        if (style.textAlignHorizontal === 'CENTER') {
            startX = (startX + editor.width) / 2
        }
        if (style.textAlignHorizontal === 'RIGHT') {
            startX = editor.width
        }
        const minY = lastBaseLine.position.y - lastBaseLine.lineAscent + lastBaseLine.lineHeight;
        result.push([startX, minY, 1, lastBaseLine.lineAscent])
        return result
    }

    if (focus === anchor) {
        const baseLine = baselines[anchor]
        const startX = baseLine.position.x
        const xArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => startX + item)
        if (!xArr?.length) return result;
        const width = xArr[focusOffset] - xArr[anchorOffset]
        if (anchorOffset === focusOffset) {
            const minY = baseLine.position.y - baseLine.lineAscent + 2
            result.push([xArr[anchorOffset], minY, width || 1, baseLine.lineAscent])
        } else {
            result.push([xArr[anchorOffset], baseLine.lineY, width || 1, Math.max(baseLine.lineHeight, baseLine.defaultLineHeight)])
        }
    }


    if (focus > anchor) {
        const anchorBaseLine = baselines[anchor]
        const anchorStartX = anchorBaseLine.position.x
        const anchorXArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => anchorStartX + item)
        if (!anchorXArr?.length) return result;

        result.push([anchorXArr[anchorOffset], anchorBaseLine.lineY, editor.width - anchorXArr[anchorOffset], Math.max(anchorBaseLine.lineHeight, anchorBaseLine.defaultLineHeight)])

        const focusBaseLine = baselines[focus]
        if (focusBaseLine) {
            const focusXArr = editor.getBaseLineCharacterOffset(focus)
            if (!focusXArr?.length) return result;
            let startX = getLineIndentationLevelPixels(editor, focusBaseLine.firstCharacter)
            if (lineFirstCharacterList.includes(focusBaseLine.firstCharacter)) {
                startX += editor.style.paragraphIndent
            }
            if (editor.style.textAlignHorizontal === 'CENTER' || editor.style.textAlignHorizontal === 'RIGHT') {
                startX = 0
            }
            result.push([startX, focusBaseLine.lineY, focusXArr[focusOffset] + focusBaseLine.position.x - startX, Math.max(focusBaseLine.lineHeight, focusBaseLine.defaultLineHeight)])
        }
    }

    if (focus - anchor >= 1) {
        for (let i = anchor + 1; i < focus; i++) {
            const baseline = baselines[i];
            let startX = getLineIndentationLevelPixels(editor, baseline.firstCharacter)
            if (lineFirstCharacterList.includes(baseline.firstCharacter)) {
                startX += editor.style.paragraphIndent
            }
            if (editor.style.textAlignHorizontal === 'CENTER' || editor.style.textAlignHorizontal === 'RIGHT') {
                startX = 0
            }
            if (baseline) {
                result.push([startX, baseline.lineY, editor.width - startX, baseline.lineHeight])
            }
        }
    }
    return result
}
