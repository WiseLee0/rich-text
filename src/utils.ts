import CanvasKitInit from 'canvaskit-wasm';
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
export const CANVAS_W = 800
export const CANVAS_H = 600
export const CANVAS_MARING = 20
export const loadSkia = async (canvasEle: HTMLCanvasElement) => {
    canvasEle.width = CANVAS_W * devicePixelRatio
    canvasEle.height = CANVAS_H * devicePixelRatio
    const Skia = await CanvasKitInit({
        locateFile: () => CanvasKitWasm
    })
    const surface = Skia.MakeWebGLCanvasSurface(canvasEle, Skia.ColorSpace.SRGB, {
        antialias: 1,
        preserveDrawingBuffer: 1,
        stencil: 1,
        majorVersion: 2
    })!;
    return [Skia, surface] as const
}

export function isPointInBoundingBox([px, py]: number[], [bx, by, bw, bh]: number[]) {
    return px >= bx && px <= (bx + bw) && py >= by && py <= (by + bh);
}
