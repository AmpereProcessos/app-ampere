import React from "react";

function TextFloatingInput({ label, value, handleChange, width, editable }) {
  return (
    <div
      className={`flex flex-col relative items-center z-0 ${
        width ? `w-full lg:w-[${width}]` : "w-full lg:w-[250px]"
      } mb-6 group`}
    >
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={!editable}
        type="text"
        name="floating_textInput"
        id="floating_textInput"
        className="block py-2.5 px-0 w-full font-mono text-center text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />
      <label
        htmlFor="floating_textInput"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}

export default TextFloatingInput;
