import React from "react";
import { BsCheck } from "react-icons/bs";

function CheckboxInput({
  labelTrue,
  labelFalse,
  checked,
  labelColor,
  widthFit,
  title,
  handleChange,
}) {
  return (
    <div
      className={`flex flex-col w-full text-sm lg:text-base ${
        widthFit ? "w-fit" : "lg:w-[350px]"
      } items-center`}
    >
      <span
        className={`uppercase font-bold font-raleway text-center ${
          labelColor ? labelColor : ""
        } text-sm`}
      >
        {title}
      </span>
      <div className="flex w-full items-center justify-center gap-2">
        <div
          className={`flex h-[13px] w-[13px] cursor-pointer items-center justify-center rounded-full border-2 border-[#15599a] ${
            checked ? "bg-[#15599a]" : ""
          }`}
          onClick={() => handleChange(!checked)}
        >
          {checked ? <BsCheck style={{ color: "#fead61" }} /> : null}
        </div>
        <p
          className="cursor-pointer text-xs text-gray-600"
          onClick={() => handleChange(!checked)}
        >
          {checked ? labelTrue : labelFalse}
        </p>
      </div>
    </div>
  );
}

export default CheckboxInput;
