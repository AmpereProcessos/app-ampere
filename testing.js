function twoSum(nums, target) {
  let mapNumbersToFind = new Map()
  for (let i = 0; i < nums.length; i++) {
    console.log(mapNumbersToFind)
    const numberToFind = target - nums[i]
    if (mapNumbersToFind.has(nums[i])) {
      return [mapNumbersToFind.get(nums[i]), i]
    }
    mapNumbersToFind.set(numberToFind, i)
  }
  return []
}
// console.log(twoSum([2, 11, 15, 7], 9))
function twoSum2(nums, target) {
  const holder = {}
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i]
    const numberToFind = target - current
    if (Object.keys(holder).includes(current.toString())) {
      return [holder[current.toString()], i]
    }
    holder[numberToFind] = i
  }
}

console.log(twoSum2([3, 3], 6))
