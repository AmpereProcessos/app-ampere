import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

function DateFloatingInput({ value, handleChange, width, editable, label }) {
	return (
		<>
			{/* <div className={`flex flex-col lg:hidden w-full my-2`}>
        <label className="text-primary/60 text-xs">{label}</label>
        <input
          value={handleDateFormating("date", value)}
          onChange={(e) => {
            console.log(e.target.value);
            handleChange(
              e.target.value != ""
                ? dayjs(e.target.value).toISOString()
                : undefined
            );
          }}
          readOnly={!editable}
          type={"date"}
          className="text-xs w-full text-center  uppercase text-gray-900 border-0 border-b-2 border-primary/20 outline-hidden"
        />
      </div> */}
			<div className={`relative z-0 flex flex-col items-center font-mono ${width ? `w-full lg:w-[${width}]` : "w-full lg:w-[250px]"} group mb-6`}>
				<input
					value={value}
					onChange={(e) => {
						handleChange(e.target.value != "" ? e.target.value : undefined);
					}}
					readOnly={!editable}
					type={"date"}
					name={label.toLowerCase()}
					id={label.toLowerCase()}
					className="bg-background peer border-primary/20 z-1 flex w-full border-0 border-b-2 px-0 py-[0.570rem] text-center text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden"
					placeholder=" "
				/>

				<label
					htmlFor={label.toLowerCase()}
					className="text-primary/60 absolute top-3 z-2 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
				>
					{label}
				</label>
			</div>
		</>
	);
}

export default DateFloatingInput;
