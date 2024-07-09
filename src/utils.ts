import CanvasKitInit from 'canvaskit-wasm';
export const CANVAS_W = 800
export const CANVAS_H = 400
export const loadSkia = async (canvasEle: HTMLCanvasElement, path: string) => {
    canvasEle.width = CANVAS_W * devicePixelRatio
    canvasEle.height = CANVAS_H * devicePixelRatio
    const Skia = await CanvasKitInit({ locateFile: () => path })
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
