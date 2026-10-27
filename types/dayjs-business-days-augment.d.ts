import "dayjs";

declare module "dayjs" {
  interface Dayjs {
    isBusinessDay(): boolean;
    businessDaysAdd(days: number): Dayjs;
    businessDaysSubtract(days: number): Dayjs;
    businessDiff(compared: Dayjs): number;
    nextBusinessDay(): Dayjs;
    prevBusinessDay(): Dayjs;
    businessDaysInMonth(): Dayjs[];
    businessWeeksInMonth(): Dayjs[][];
  }
}
