import CanvasKitInit from 'canvaskit-wasm';
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
export const CANVAS_W = 800
export const CANVAS_H = window.innerHeight - 20
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

export function rgbaToHex(r: number, g: number, b: number, a: number) {
    // 将范围从 0-1 转换为 0-255
    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);
    const alpha = Math.round(a * 255);

    // 将每个值转换为两位的十六进制字符串
    const toHex = (value: number) => value.toString(16).padStart(2, '0');

    // 拼接成最终的十六进制颜色字符串
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(alpha)}`;
}

export function hexToRgba(hex: string): { r: number, g: number, b: number, a: number } | null {
    // 移除开头的 "#" 字符
    hex = hex.replace(/^#/, '');

    // 根据字符串的长度判断是否带有透明度
    if (hex.length === 6) {
        // 如果只有 RGB 值，则默认透明度为 1
        hex += 'ff';
    } else if (hex.length !== 8) {
        // 如果长度不符合要求，返回 null
        return null;
    }

    // 提取 RGBA 分量
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 24) & 255;
    const g = (bigint >> 16) & 255;
    const b = (bigint >> 8) & 255;
    const a = bigint & 255;

    // 将 RGBA 值从 0-255 范围转换到 0-1 范围
    return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
        a: a / 255,
    };
}
