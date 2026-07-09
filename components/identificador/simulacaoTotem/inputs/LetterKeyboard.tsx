import { useClickOutside } from "@/utils/hooks";
import React from "react";
import { VscChromeClose } from "react-icons/vsc";
type LetterVirtualKeyboardProps = {
  closeModal: () => void;
  handleClick: (x: string) => void;
  dropLastLetter: () => void;
  showEmailDomains: boolean;
};
const letters = {
  1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  2: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  3: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
  4: ["Z", "X", "C", "V", "B", "N", "M", "@", "."],
};
function LetterVirtualKeyboard({
  closeModal,
  handleClick,
  dropLastLetter,
  showEmailDomains = false,
}: LetterVirtualKeyboardProps) {
  return (
    <div
      className={`absolute left-[50%] ${
        showEmailDomains ? "top-[250px]" : "top-[230px]"
      } xxs:w-[340px] bg-background xs:w-[380px] z-1000 min-h-fit w-[310px] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] sm:w-[500px] lg:min-h-[350px] lg:w-[600px] lg:max-w-[600px]`}
    >
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-foreground text-sm">TECLADO VIRTUAL</p>
          <button
            onClick={closeModal}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: "red" }} />
          </button>
        </div>
        {Object.entries(letters).map(([key, lett]) => (
          <div key={key} className="flex w-full items-center justify-center gap-1 lg:gap-2">
            {lett.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                onClick={() => handleClick(letter)}
                className="xs:text-[0.9rem] border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-2 text-xs shadow-xs hover:bg-blue-100 lg:p-4 lg:text-sm"
              >
                <p>{letter}</p>
              </div>
            ))}
          </div>
        ))}
        {showEmailDomains ? (
          <div className="grid w-full grid-cols-3 gap-2">
            <div
              onClick={() => handleClick("HOTMAIL.COM")}
              className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-4 text-[0.7rem] shadow-xs hover:bg-blue-100 lg:text-sm"
            >
              <p>{"HOTMAIL.COM"}</p>
            </div>
            <div
              onClick={() => handleClick("GMAIL.COM")}
              className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-4 text-[0.7rem] shadow-xs hover:bg-blue-100 lg:text-sm"
            >
              <p>{"GMAIL.COM"}</p>
            </div>
            <div
              onClick={() => handleClick("OUTLOOK.COM")}
              className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-4 text-[0.7rem] shadow-xs hover:bg-blue-100 lg:text-sm"
            >
              <p>{"OUTLOOK.COM"}</p>
            </div>
          </div>
        ) : null}
        <div className="grid w-full grid-cols-3 gap-2">
          <div
            onClick={() => dropLastLetter()}
            className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-3 text-sm shadow-xs hover:bg-blue-100"
          >
            <p>APAGAR</p>
          </div>
          <div
            onClick={() => handleClick(" ")}
            className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-3 text-sm shadow-xs hover:bg-blue-100"
          >
            <p>ESPAÇO</p>
          </div>
          <div
            onClick={() => closeModal()}
            className="border-border dark:hover:bg-primary/10 flex cursor-pointer items-center justify-center rounded-md border p-3 text-sm shadow-xs hover:bg-blue-100"
          >
            <p>ENTER</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LetterVirtualKeyboard;
