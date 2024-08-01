export function deepClone<T extends any>(obj: T) {
    let objClone: any = Array.isArray(obj) ? [] : {};

    if (obj && typeof obj === "object") {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    } else {
        return obj;
    }
    return objClone as T;
}