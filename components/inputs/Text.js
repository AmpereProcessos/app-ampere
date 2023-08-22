import React from "react";

function TextInput({
  width,
  label,
  labelClassName = "font-sans font-bold  text-[#353432]",
  showLabel = true,
  value,
  placeholder,
  editable = true,
  handleChange,
}) {
  const inputIdentifier = label ? label.toLowerCase().replace(" ", "_") : "";
  return (
    <div
      className={`flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}
    >
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        id={inputIdentifier}
        readOnly={!editable}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  );
}

export default TextInput;
