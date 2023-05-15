import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

function DateFloatingInput({ value, handleChange, width, editable, label }) {
  return (
    <>
      {/* <div className={`flex flex-col lg:hidden w-full my-2`}>
        <label className="text-gray-500 text-xs">{label}</label>
        <input
          value={handleDateFormating("date", value)}
          onChange={(e) => {
            console.log(e.target.value);
            handleChange(
              e.target.value != ""
                ? dayjs(e.target.value).toISOString()
                : undefined
            );
          }}
          readOnly={!editable}
          type={"date"}
          className="text-xs w-full text-center  uppercase text-gray-900 border-0 border-b-2 border-gray-300 outline-none"
        />
      </div> */}
      <div
        className={`flex flex-col relative font-mono items-center z-0 ${
          width ? `w-full lg:w-[${width}]` : "w-full lg:w-[250px]"
        } mb-6 group`}
      >
        <input
          value={value}
          onChange={(e) => {
            handleChange(e.target.value != "" ? e.target.value : undefined);
          }}
          readOnly={!editable}
          type={"date"}
          name={label.toLowerCase()}
          id={label.toLowerCase()}
          className="flex py-[0.570rem] z-1 text-center px-0 w-full bg-[#fff] text-sm text-gray-900 border-0 border-b-2 border-gray-300  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
        />

        <label
          htmlFor={label.toLowerCase()}
          className="peer-focus:font-medium z-2 absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          {label}
        </label>
      </div>
    </>
  );
}

export default DateFloatingInput;
