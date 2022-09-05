import React from "react";
import GrUserSettings from "react-icons/gr";
function Header({ title, icon, color }) {
  return (
    <div
      className={`w-full bg-[${color}] flex items-center gap-x-4 justify-center h-[70px] border-b border-white`}
    >
      {icon}
      <h1 className="text-xl uppercase text-white font-bold">{title}</h1>
    </div>
  );
}

export default Header;
