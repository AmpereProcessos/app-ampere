import dayjs from 'dayjs'

export function getFirstDayOfYearString({ year, resetHour = true }: { year?: number; resetHour?: boolean }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  var firstDay = currentDate.startOf('year')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
export function getFirstDayOfMonth({ year, month, resetHour = true }: { year?: number; month?: number; resetHour?: boolean }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.startOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
export function getLastDayOfMonth({ year, month, resetHour = true }: { year?: number; month?: number; resetHour?: boolean }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.endOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}

export function getArrOfYearsBetweenYears({ initialYear, endYear }: { initialYear: number; endYear: number }) {
  const arr = Array.from({ length: endYear - initialYear + 1 }, (_, index) => initialYear + index)
  return arr
}
