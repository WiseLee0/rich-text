// 返回数组中与 target 最接近的元素的下标
export function findClosestIndex(nums: number[], target: number) {
    if (nums.length === 0) {
        return -1; // 如果数组为空，返回 -1 表示无效下标
    }

    let closestIndex = 0;
    let closestDifference = Math.abs(nums[0] - target);

    for (let i = 1; i < nums.length; i++) {
        const currentDifference = Math.abs(nums[i] - target);
        if (currentDifference < closestDifference) {
            closestDifference = currentDifference;
            closestIndex = i;
        }
    }

    return closestIndex;
}


/**
 * 找出数组中连续相同元素的区间
 * @param arr 输入数组（元素类型可以是任意可比较的类型）
 * @returns 返回连续相同元素的区间数组，每个区间用 [startIndex, endIndex] 表示
 */
export function findConsecutiveRanges<T>(arr: T[]): number[][] {
    if (arr.length === 0) return [];

    const ranges: number[][] = [];
    let start = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[start]) {
            ranges.push([start, i - 1]);
            start = i;
        }
    }

    // 处理最后一个区间
    ranges.push([start, arr.length - 1]);

    return ranges;
}