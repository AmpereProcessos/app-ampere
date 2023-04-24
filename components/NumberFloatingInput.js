import React from "react";

function NumberFloatingInput({
  label,
  value,
  editable,
  handleChange,
  width,
  marginBottom,
  toString = true,
}) {
  function fixValue(value) {
    if (toString) {
      return value.toString();
    } else return value;
  }
  return (
    <div
      className={`flex flex-col relative items-center z-0 ${
        width ? `w-full lg:w-[${width}]` : "w-full lg:w-[250px]"
      } ${marginBottom ? `mb-[${marginBottom}]` : "mb-6"}  group`}
    >
      <input
        value={value ? fixValue(value) : 0}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={!editable}
        type="number"
        name={label.toLowerCase()}
        id={label.toLowerCase()}
        step={0.01}
        className="flex py-2.5 px-0 w-full text-sm z-1 font-arial text-center text-gray-900 bg-[#fff] border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />

      <label
        htmlFor={label.toLowerCase()}
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-2 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}

export default NumberFloatingInput;
