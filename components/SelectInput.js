import React from "react";

function SelectInput({
  label,
  value,
  options,
  handleChange,
  editable,
  widthFit,
  labelColor,
}) {
  return (
    <div
      className={`flex flex-col w-full text-sm lg:text-base ${
        widthFit ? "w-fit" : "lg:w-[350px]"
      } items-center`}
    >
      <span
        className={`uppercase font-bold font-raleway text-center text-sm ${
          labelColor ? labelColor : ""
        }`}
      >
        {label}
      </span>
      <select
        className="text-xs w-full text-center bg-transparent uppercase text-gray-600 outline-none"
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
