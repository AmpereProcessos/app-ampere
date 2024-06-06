import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
type LetterVirtualKeyboardProps = {
  closeModal: () => void
  handleClick: (x: string) => void
  dropLastLetter: () => void
  showEmailDomains: boolean
}
const letters = {
  1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
  4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '@', '.'],
}
function LetterVirtualKeyboard({ closeModal, handleClick, dropLastLetter, showEmailDomains = false }: LetterVirtualKeyboardProps) {
  return (
    <div
      className={`absolute left-[50%] ${
        showEmailDomains ? 'top-[250px]' : 'top-[230px]'
      }  z-[1000] min-h-fit w-[130%] max-w-[320px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] xs:max-w-[350px] lg:min-h-[350px] lg:w-[600px] lg:max-w-[600px]`}
    >
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-gray-500">TECLADO VIRTUAL</p>
          <button
            onClick={closeModal}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        </div>
        {Object.entries(letters).map(([key, lett]) => (
          <div key={key} className="flex w-full items-center justify-center gap-1 lg:gap-2">
            {lett.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                onClick={() => handleClick(letter)}
                className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 text-[0.6rem] shadow-sm hover:bg-blue-100 lg:p-4 lg:text-sm"
              >
                <p>{letter}</p>
              </div>
            ))}
          </div>
        ))}
        {/* <div className="w-full flex items-center gap-2 justify-center">
          <div
            onClick={() => handleClick("Q")}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>Q</p>
          </div>
          <div
            onClick={() => handleClick("Q")}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>Q</p>
          </div>
          <div
            onClick={() => handleClick("Q")}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>Q</p>
          </div>
          <div
            onClick={() => handleClick("Q")}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>Q</p>
          </div>
          <div
            onClick={() => handleClick("Q")}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>Q</p>
          </div>
        </div> */}
        {/* <div className="w-full grid grid-cols-3 gap-2">
          <div
            onClick={() => handleClick(7)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>7</p>
          </div>
          <div
            onClick={() => handleClick(8)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>8</p>
          </div>
          <div
            onClick={() => handleClick(9)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>9</p>
          </div>
          <div
            onClick={() => handleClick(4)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>4</p>
          </div>
          <div
            onClick={() => handleClick(5)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>5</p>
          </div>
          <div
            onClick={() => handleClick(6)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>6</p>
          </div>
          <div
            onClick={() => handleClick(1)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>1</p>
          </div>
          <div
            onClick={() => handleClick(2)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>2</p>
          </div>
          <div
            onClick={() => handleClick(3)}
            className="p-3 text-sm flex items-center justify-center border border-gray-200 shadow-sm rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <p>3</p>
          </div>
        </div> */}
        {showEmailDomains ? (
          <div className="grid w-full grid-cols-3 gap-2">
            <div
              onClick={() => handleClick('HOTMAIL.COM')}
              className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-4 text-[0.6rem] shadow-sm hover:bg-blue-100 lg:text-sm"
            >
              <p>{'HOTMAIL.COM'}</p>
            </div>
            <div
              onClick={() => handleClick('GMAIL.COM')}
              className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-4 text-[0.6rem] shadow-sm hover:bg-blue-100 lg:text-sm"
            >
              <p>{'GMAIL.COM'}</p>
            </div>
            <div
              onClick={() => handleClick('OUTLOOK.COM')}
              className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-4 text-[0.6rem] shadow-sm hover:bg-blue-100 lg:text-sm"
            >
              <p>{'OUTLOOK.COM'}</p>
            </div>
          </div>
        ) : null}
        <div className="grid w-full grid-cols-3 gap-2">
          <div
            onClick={() => dropLastLetter()}
            className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-3 text-sm shadow-sm hover:bg-blue-100"
          >
            <p>APAGAR</p>
          </div>
          <div
            onClick={() => handleClick(' ')}
            className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-3 text-sm shadow-sm hover:bg-blue-100"
          >
            <p>ESPAÇO</p>
          </div>
          <div
            onClick={() => closeModal()}
            className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-3 text-sm shadow-sm hover:bg-blue-100"
          >
            <p>ENTER</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LetterVirtualKeyboard
