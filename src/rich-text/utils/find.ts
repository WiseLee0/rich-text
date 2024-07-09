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