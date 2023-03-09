import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

function ArchiveLinkBlock({ obj, deleteFile }) {
  const [deleteMenu, setDeleteMenu] = useState(false);
  return (
    <div className="flex items-center justify-center gap-2">
      <a
        className="text-xs text-[#15599a] font-bold text-center"
        href={obj.link}
      >
        {obj.title} ({obj.format})
      </a>
      <div className="grid grid-cols-1 relative">
        {deleteMenu ? (
          <div className="flex flex-col items-center justify-center">
            <div
              onClick={() => setDeleteMenu(false)}
              className="w-fit text-red-500 scale-110 cursor-pointer text-[20px]"
            >
              <MdDelete />
            </div>
            <div className="w-fit rounded bg-[#fff] z-2 shadow-lg border border-gray-200 absolute -top-8">
              <button
                onClick={() => deleteFile(obj)}
                className="text-gray-700 font-bold text-xs hover:bg-red-200 p-2"
              >
                EXCLUIR
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div
              onClick={() => setDeleteMenu(true)}
              className="w-fit text-red-500 opacity-40 hover:opacity-100 hover:text-red-500 hover:scale-110 duration-300 ease-in cursor-pointer text-[20px]"
            >
              <MdDelete />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchiveLinkBlock;
