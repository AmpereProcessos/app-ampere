function romanToInt(s) {
  const romanValues = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  const splittedStr = s.split('')
  var sum = 0

  for (let i = 0; i < splittedStr.length; i++) {
    const current = splittedStr[i]
    const currentInteger = romanValues[current]

    const previous = splittedStr[i - 1]
    const previousInteger = previous ? romanValues[previous] : 0

    const next = splittedStr[i + 1]
    const nextInteger = romanValues[next] || 0

    if (!previous) {
      if (currentInteger >= nextInteger) sum += currentInteger
    } else {
      if (currentInteger >= nextInteger) {
        if (currentInteger > previousInteger) {
          const toSum = currentInteger - previousInteger
          sum += toSum
        } else {
          sum += currentInteger
        }
      }
    }
  }
  return sum
}

const result = romanToInt('III')

console.log(result)
