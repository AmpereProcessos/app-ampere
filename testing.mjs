import dayjs from "dayjs";

const currentDate = dayjs();
const currentMonth = currentDate.month();
const currentSemesterMonthStart = currentMonth < 6 ? 0 : 6;
const PERIOD_MAP = {
	"current-month": {
		firstDay: currentDate.startOf("month").subtract(3, "hours").toDate(),
		lastDay: currentDate.endOf("month").subtract(3, "hours").toDate(),
	},
	"current-semester": {
		firstDay: currentDate.set("month", currentSemesterMonthStart).startOf("month").toDate(),
		lastDay: currentDate
			.set("month", currentSemesterMonthStart + 5)
			.endOf("month")
			.subtract(3, "hours") // Fixing timezone issue
			.toDate(),
	},
	"current-year": {
		firstDay: currentDate.startOf("year").subtract(3, "hours").toDate(),
		lastDay: currentDate.endOf("year").subtract(3, "hours").toDate(),
	},
};

console.log(PERIOD_MAP);
