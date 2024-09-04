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
console.log(twoSum([2, 11, 15, 7], 9))
