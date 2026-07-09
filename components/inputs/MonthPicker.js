import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

function extractValue(value, months, years) {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const standardReturn = { month: null, year: null };
  if (!value) return standardReturn;
  const splittedMonth = value.split("/")[0];
  const splittedYear = value.split("/")[1];

  if (!splittedMonth || Number(splittedMonth) > 12 || Number(splittedMonth) < 1) {
    return standardReturn;
  }

  if (!splittedYear || Number(splittedYear) > 2500 || Number(splittedYear) < 2000)
    return standardReturn;
  // Passed validations

  return { month: splittedMonth, year: splittedYear };
}
function MonthYearPicker({
  width,
  editable = true,
  label,
  labelClassName = "font-sans font-bold  text-primary text-start",
  showLabel = true,
  value,
  handleChange,
}) {
  const inputIdentifier = label ? label.toLowerCase().replace(" ", "_") : "";
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(extractValue(value).month);
  const [selectedYear, setSelectedYear] = useState(extractValue(value).year);

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    const month = value.toString().padStart(2, "0");
    const year = selectedYear ? selectedYear : currentYear;
    const str = `${month}/${year}`;
    handleChange(str);
    setSelectMenuIsOpen(false);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    const month = selectedMonth
      ? selectedMonth.toString().padStart(2, "0")
      : currentMonth.toString().padStart(2, "0");
    const year = event.target.value;
    const str = `${month}/${year}`;
    handleChange(str);
  };

  // Generate lists of months and years, adjust the ranges as needed
  const months = [...Array(12).keys()].map((index) => ({
    value: (index + 1).toString(),
    label: (index + 1).toString().padStart(2, "0"),
  }));
  const years = [...Array(15).keys()].map((index) => ({
    value: (currentYear - 5 + index).toString(),
    label: (currentYear - 5 + index).toString(),
  }));
  return (
    <div className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}
      <div
        onClick={() => {
          if (editable && !selectMenuIsOpen) setSelectMenuIsOpen((prev) => !prev);
        }}
        className="bg-background border-border flex min-h-[41px] w-full cursor-pointer items-center justify-between rounded-md border p-3 text-sm shadow-xs"
      >
        <p className="grow text-primary">
          {selectedMonth ? selectedMonth.toString().trim().padStart(2, "0") : "MM"}/
          {selectedYear ? selectedYear : "YYYYY"}
        </p>
        {selectMenuIsOpen ? (
          <IoMdArrowDropup
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen(false);
            }}
          />
        ) : (
          <IoMdArrowDropdown
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen(true);
            }}
          />
        )}
      </div>
      {selectMenuIsOpen ? (
        <div className="bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 border-border absolute top-[75px] z-100 flex h-[150px] max-h-[150px] w-full flex-col self-center overflow-y-auto overscroll-y-auto rounded-md border p-2 py-1 shadow-xs">
          <select
            className="font-raleway w-full border-none pb-2 text-center font-bold outline-hidden"
            value={selectedYear ? selectedYear : currentYear}
            onChange={handleYearChange}
          >
            {years.map((year, index) => (
              <option key={index} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
          <div className="bg-primary/80 h-[5px] w-full"></div>
          <div className="grid w-full grow grid-cols-4 gap-2 border-t border-gray-400 p-6">
            {months.map((month, index) => (
              <div
                key={index}
                onClick={() => handleMonthChange(month.value)}
                className={`p-1 ${selectedMonth == month.value ? "bg-blue-200" : ""} border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded border hover:bg-blue-100`}
              >
                <p className="text-center font-bold">{month.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {/* <select value={selectedMonth} onChange={handleMonthChange}>
        <option value="">Month</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <select value={selectedYear} onChange={handleYearChange}>
        <option value="">Year</option>
        {years.map((year) => (
          <option key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </select> */}
    </div>
  );
}

export default MonthYearPicker;
