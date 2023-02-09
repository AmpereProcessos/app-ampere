import dayjs from "dayjs";
import React, { useState } from "react";

function SelectFoatingInput({
  value,
  handleChange,
  width,
  editable,
  label,
  options,
}) {
  const [selectActive, setSelectActive] = useState(false);
  return (
    <div
      className={`flex flex-col relative items-center z-0 ${
        width ? `w-[${width}]` : "w-[250px]"
      } mb-6 group`}
    >
      <select
        value={value}
        disabled={!editable}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setSelectActive(false)}
        className="flex py-2.5 text-center px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      >
        {options &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>

      <label
        for="floating_numberInput"
        className="peer-focus:font-medium absolute w-full text-sm  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}

export default SelectFoatingInput;
