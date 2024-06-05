import React from 'react'

function SaveButton({ text, icon, isLoading, handleClick }) {
  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="flex cursor-pointer items-center gap-x-2 rounded bg-[#15599a] p-2 text-sm font-bold text-white transition duration-300 ease-in-out disabled:bg-gray-300 disabled:text-white enabled:hover:scale-105 enabled:hover:bg-blue-500"
    >
      <p className="mr-2 text-sm">{text}</p>
      {icon}
    </button>
  )
}

export default SaveButton
