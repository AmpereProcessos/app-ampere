import React from "react";

function SelectInput({ label, value, options, handleChange, editable }) {
  return (
    <div className="flex flex-col w-[350px] items-center">
      <span className="uppercase font-bold font-raleway text-center text-sm">
        {label}
      </span>
      <select
        className="text-xs w-full text-center uppercase text-gray-600 outline-none"
        onChange={(e) => handleChange(e.target.value)}
        disabled={!editable}
        value={value}
      >
        {options &&
          options.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default SelectInput;
