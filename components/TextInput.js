import React, { useState } from "react";
function TextInput({ value, label, handleChange, editable, normalCase }) {
  return (
    <div className="flex flex-col w-[350px] items-center">
      <span className="uppercase font-bold font-raleway text-center text-sm">
        {label}
      </span>
      <input
        className={`text-xs w-full text-center ${
          normalCase ? "" : "uppercase"
        }  text-gray-600 outline-none`}
        value={value}
        readOnly={!editable}
        placeholder={"Informação a preencher..."}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
      />
    </div>
  );
}

export default TextInput;
