import React from "react";
import { BsCheck } from "react-icons/bs";

function CheckboxInput({
  labelTrue,
  labelFalse,
  editable = true,
  checked,
  labelClassName = "uppercase font-bold font-raleway text-center  text-sm",
  widthFit,
  title,
  handleChange,
}) {
  return (
    <div
      className={`flex w-full flex-col gap-2 text-sm lg:text-base ${widthFit ? "w-fit" : "lg:w-[350px]"} items-center`}
    >
      <span className={labelClassName}>{title}</span>
      <div className="flex w-full items-center justify-center gap-2">
        <div
          className={`flex h-[13px] w-[13px] cursor-pointer items-center justify-center rounded-full border-2 border-[#15599a] ${
            checked ? "bg-[#15599a]" : ""
          }`}
          onClick={() => {
            if (editable) handleChange(!checked);
          }}
        >
          {checked ? <BsCheck style={{ color: "#fead61" }} /> : null}
        </div>
        <p
          className="text-foreground cursor-pointer text-xs"
          onClick={() => {
            if (editable) handleChange(!checked);
          }}
        >
          {checked ? labelTrue : labelFalse}
        </p>
      </div>
    </div>
  );
}

export default CheckboxInput;
