function isNumber(value) {
  const isNaNCheck = isNaN(value)
  if (isNaNCheck) return false
  return true
}

console.log(isNumber('N/A'))
console.log(isNumber(null))
console.log(isNumber(undefined))
console.log(isNumber(0))
console.log(Number(null))
