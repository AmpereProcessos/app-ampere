import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

function LeadsLostBlock({ lostLeads }) {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
  return (
    <div className="flex flex-col w-full bg-[#fff] shadow-md rounded-md p-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <h1 className="text-gray-800 font-medium">PERDIDOS</h1>
        </div>
        {dropdownMenuVisible ? (
          <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
            <IoMdArrowDropupCircle
              style={{ fontSize: "25px" }}
              onClick={() => setDropdownMenuVisible(false)}
            />
          </div>
        ) : (
          <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
            <IoMdArrowDropdownCircle
              style={{ fontSize: "25px" }}
              onClick={() => setDropdownMenuVisible(true)}
            />
          </div>
        )}
      </div>
      {dropdownMenuVisible ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          {lostLeads.map((lead, index) => (
            <div
              key={index}
              className="bg-red-100 flex flex-col w-full rounded-md p-2"
            >
              <h1 className="text-gray-800 font-medium">{lead.nome}</h1>
              <p className="w-full text-center py-1 text-xs italic text-red-500 font-medium">
                {lead.motivoPerda}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default LeadsLostBlock;
