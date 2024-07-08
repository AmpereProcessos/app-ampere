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

export function formatDateQuery(date: string, type: 'start' | 'end') {
  if (type == 'start') return dayjs(date).startOf('day').subtract(3, 'hour').toISOString()
  if (type == 'end') return dayjs(date).endOf('day').subtract(3, 'hour').toISOString()
  return dayjs(date).startOf('day').subtract(3, 'hour').toISOString()
}

export function getHoursDiff({ start, finish }: { start: string | Date; finish: string | Date }) {
  const hourDiff = dayjs(finish).diff(dayjs(start), 'hour')
  return hourDiff
}

export function getDifferenceBetweenTimes(timeOne: string, timeTwo: string) {
  // Parse time strings into hours and minutes
  var time1Parts = timeOne.split(':')
  var time2Parts = timeTwo.split(':')

  var time1Hours = parseInt(time1Parts[0])
  var time1Minutes = parseInt(time1Parts[1])

  var time2Hours = parseInt(time2Parts[0])
  var time2Minutes = parseInt(time2Parts[1])

  // Calculate total minutes for each time
  var totalMinutesTime1 = time1Hours * 60 + time1Minutes
  var totalMinutesTime2 = time2Hours * 60 + time2Minutes

  // Find the absolute difference in minutes between the two times
  var differenceInMinutes = Math.abs(totalMinutesTime1 - totalMinutesTime2)

  // Convert the difference back into hours and minutes format
  var differenceHoursTotal = differenceInMinutes / 60
  var differenceHours = Math.floor(differenceInMinutes / 60)
  var differenceMinutes = differenceInMinutes % 60
  return { hoursTotal: differenceHoursTotal, minutesTotal: differenceInMinutes, hoursFixed: differenceHours, minutesFixed: differenceMinutes }
}

export function getDifferenceBetweenDates({ start, end }: { start?: string | Date | null; end?: string | Date | null }) {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const diff = startDate.diff(endDate, 'days')
  return Math.abs(diff)
}
type GetPeriodDateParamsByReferenceDateParams = {
  reference: string | Date
  type?: 'month' | 'year'
  resetStart?: boolean
  resetEnd?: boolean
}
export function getPeriodDateParamsByReferenceDate({ reference, type = 'month', resetStart, resetEnd }: GetPeriodDateParamsByReferenceDateParams) {
  if (type == 'month') {
    var start = dayjs(reference).startOf('month')
    var end = dayjs(reference).endOf('month')
    if (!!resetStart) start = start.subtract(3, 'hour')
    if (!!resetEnd) end = end.startOf('day').subtract(3, 'hour')
    return { start: start.toDate(), end: end.toDate() }
  }
  if (type == 'year') {
    var start = dayjs(reference).startOf('year')
    var end = dayjs(reference).endOf('year')
    if (!!resetStart) start = start.subtract(3, 'hour')
    if (!!resetEnd) end = end.startOf('day').subtract(3, 'hour')
    return { start: start.toDate(), end: end.toDate() }
  }

  // Default for month
  var start = dayjs(reference).startOf('month')
  var end = dayjs(reference).endOf('month')
  if (!!resetStart) start = start.subtract(3, 'hour')
  if (!!resetEnd) end = end.startOf('day').subtract(3, 'hour')
  return { start: start.toDate(), end: end.toDate() }
}
