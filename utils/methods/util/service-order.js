export function getObjectDifference(obj1, obj2, parentKey = '') {
  const diff = {}

  for (const key in obj2) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (Array.isArray(obj2[key])) {
        // Handle arrays
        if (!Array.isArray(obj1[key])) {
          diff[currentKey] = obj2[key]
        } else {
          diff[currentKey] = obj2[key]
        }
      } else {
        // Handle nested objects
        const nestedDiff = getObjectDifference(obj1[key], obj2[key], currentKey)
        Object.assign(diff, nestedDiff)
      }
    } else if (!obj1 || obj1[key] !== obj2[key]) {
      diff[currentKey] = obj2[key]
    }
  }

  return diff
}
