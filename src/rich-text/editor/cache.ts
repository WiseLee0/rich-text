import { EditorInterface, StyleInterface } from "..";

export const clearCache: EditorInterface["clearCache"] = (editor) => {
    if (editor.__need_cache === "all") {
        editor.__need_cache = "none";
        return;
    } else if (editor.__need_cache === "metrices") {
        editor.derivedTextData = {};
        editor.__need_cache = "none";
        return;
    }
    editor.derivedTextData = {};
    editor.__metrices = undefined;
};

export const clearGetStyleCache: EditorInterface["clearGetStyleCache"] = (
    editor
) => {
    editor.__select_styles = {};
};

export const checkStyleCache: EditorInterface["checkStyleCache"] = (
    editor,
    style
) => {
    for (const _key of Object.keys(style)) {
        const key = _key as keyof StyleInterface;
        if (key === "fillPaints") {
            editor.__need_cache = "all";
        } else if (key === "textDecoration") {
            editor.__need_cache = "all";
        } else if (key === "textAlignVertical") {
            editor.__need_cache = "metrices";
        } else if (key === "textAlignHorizontal") {
            editor.__need_cache = "metrices";
        } else if (key === "leadingTrim") {
            editor.__need_cache = "metrices";
        } else if (key === "lineHeight") {
            editor.__need_cache = "metrices";
        }
    }
    return true;
};
