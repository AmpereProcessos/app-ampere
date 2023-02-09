import dayjs from "dayjs";
import React, { useState } from "react";

function DateFloatingInput({ value, handleChange, width, editable, label }) {
  const [type, setType] = useState("text");
  function handleDateFormating(type, value) {
    if (type == "date") return value;
    else {
      if (value) return dayjs(value).format("DD/MM/YYYY");
      else {
        return "";
      }
    }
  }
  return (
    <div
      className={`flex flex-col relative items-center z-0 ${
        width ? `w-[${width}]` : "w-[250px]"
      } mb-6 group`}
    >
      <input
        value={handleDateFormating(type, value)}
        onChange={(e) => {
          console.log(e.target.value);
          handleChange(
            e.target.value != ""
              ? dayjs(e.target.value).toISOString()
              : undefined
          );
        }}
        readOnly={!editable}
        type={type}
        onFocus={() => setType("date")}
        onBlur={() => setType("text")}
        name="floating_dateInput"
        id="floating_dateInput"
        className="flex py-2.5 text-center px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />

      <label
        htmlFor="floating_dateInput"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}

export default DateFloatingInput;
