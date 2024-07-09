import * as fontkit from 'fontkit'
import type { Font } from 'fontkit';

class FontMgrStore {
    private fonts: (Font)[] = []
    FontMgrFromData(...buffers: ArrayBuffer[]) {
        for (let i = 0; i < buffers.length; i++) {
            const buffer = buffers[i];
            const font = fontkit.create(new Uint8Array(buffer) as any) as Font
            const hasFamily = this.getFont(font.familyName)
            if (hasFamily) continue
            this.fonts.push(font)
        }
    }
    getFont(familyName?: string) {
        if (!familyName) return;
        return this.fonts.find(item => item.familyName === familyName)
    }
}

const FontMgr = new FontMgrStore()
export default FontMgr;