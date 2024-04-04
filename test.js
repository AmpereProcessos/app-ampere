const dayjs = require('dayjs')

const days = dayjs(new Date()).diff('2024-01-04T00:00:00.000Z', 'day')
console.log(days)
