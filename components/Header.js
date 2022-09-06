import React from "react";
import GrUserSettings from "react-icons/gr";
import Link from "next/link";
function Header({ title, icon, color, url }) {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`w-full  flex items-center gap-x-4 justify-center h-[70px] border-b border-white`}
    >
      <Link href={url}>
        <div className="flex gap-x-2 cursor-pointer">
          {icon}
          <h1 className="text-xl uppercase text-white font-bold">{title}</h1>
        </div>
      </Link>
    </div>
  );
}

export default Header;
