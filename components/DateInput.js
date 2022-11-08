import React from "react";

function DateInput({ label, value, handleChange, editable }) {
  return (
    <div className="flex flex-col w-[350px] items-center">
      <span className="uppercase font-bold font-raleway text-center text-sm">
        {label}
      </span>
      <input
        className="text-xs w-full text-center bg-transparent uppercase text-gray-600 outline-none"
        type="date"
        readOnly={!editable}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

export default DateInput;
