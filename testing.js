const dayjs = require('dayjs')

const itemStatusLogStartDate = new Date('2024-11-15T10:00:00')
const diffInDays = dayjs().diff(dayjs(itemStatusLogStartDate), 'day')
console.log(diffInDays)
