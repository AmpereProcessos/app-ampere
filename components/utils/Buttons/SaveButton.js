import React from 'react'

function SaveButton({ text, icon, isLoading, handleClick }) {
  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-2 text-white font-bold rounded text-sm transition duration-300 ease-in-out hover:scale-105 cursor-pointer disabled:bg-gray-300 disabled:text-white"
    >
      <p className="mr-2 text-sm">{text}</p>
      {icon}
    </button>
  )
}

export default SaveButton
