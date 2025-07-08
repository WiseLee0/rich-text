import type { Font as _Font, FontCollection } from 'fontkit';
export type Font = _Font
export interface FontInterface {
    fonts: Font[]
    collections: FontCollection[]
}

export interface FontItem {
    familyName: string;
    subfamilyName: string;
    postscriptName: string;
    assetUrl: string;
    svg: string;
    label?: string;
}