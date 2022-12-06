import React from "react";

function NumberInput({ label, value, handleChange, editable, tag, unit }) {
  return (
    <div className="flex flex-col w-full text-xs lg:w-[350px] lg:text-base items-center">
      <span className="uppercase font-bold font-raleway text-center text-sm">
        {label}
      </span>
      <div className="flex items-center justify-center">
        {tag && (
          <p className="text-xs w-fit text-center uppercase text-gray-600 ">
            {tag}
          </p>
        )}
        <input
          className="text-xs w-fit text-center uppercase text-gray-600 outline-none"
          type="number"
          readOnly={!editable}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        {unit && (
          <p className="text-xs w-fittext-center text-gray-600 ">{unit}</p>
        )}
      </div>
    </div>
  );
}

export default NumberInput;
