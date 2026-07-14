import React from "react";

function SelectInput({ label, value, options, handleChange, editable, widthFit, labelColor }) {
  return (
    <div
      className={`flex w-full flex-col text-sm lg:text-base ${widthFit ? "w-full" : "lg:w-[350px]"} items-center`}
    >
      <span
        className={`font-raleway text-center text-sm font-bold uppercase ${labelColor ? labelColor : ""}`}
      >
        {label}
      </span>
      <select
        className="text-foreground w-full bg-transparent text-center text-xs uppercase outline-hidden"
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
