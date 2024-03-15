const dayjs = require('dayjs')
const z = require('zod')
const fs = require('fs')
function getFirstDayOfYearString({ year, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  var firstDay = currentDate.startOf('year')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getFirstDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.startOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getLastDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.endOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}

const initialYear = 2020
const currentYear = 2024
const arr = Array.from({ length: currentYear - initialYear + 1 }, (_, index) => initialYear + index)
const max = Math.max.apply(null, arr)
console.log(max)

const Headers = [
  () => <h1>TESTE</h1>,
  () => console.log(2),
  () => console.log(3),
  () => console.log(4),
  () => console.log(5),
  () => console.log(6),
  () => console.log(7),
  () => console.log(8),
  () => console.log(9),
  () => console.log(10),
]

Headers[1]()
