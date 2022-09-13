import React, { useState } from "react";
import { AiFillEdit, AiOutlineCheck } from "react-icons/ai";
function TextInput({ value }) {
  const [valueHolder, setValueHolder] = useState(value);
  const [showEditButton, setshowEditButton] = useState(false);
  const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  useState(() => {
    if (valueHolder != value) {
      setShowConfirmationButtons(true);
    }
  }, [valueHolder]);
  return (
    <div
      onMouseLeave={() => setshowEditButton(false)}
      onMouseOver={() => setshowEditButton(true)}
      className="flex items-center"
    >
      <input
        className="pl-4 text-xs w-[200px] text-gray-600 outline-none"
        value={valueHolder}
        readOnly={readOnly}
        onChange={(e) => setValueHolder(e.target.value)}
        type="text"
      />
      {showConfirmationButtons == true ? (
        <AiOutlineCheck style={{ color: "black" }} />
      ) : (
        <AiFillEdit
          onClick={() => setReadOnly(false)}
          className={showEditButton ? "block cursor-pointer" : "hidden"}
        />
      )}
    </div>
  );
}

export default TextInput;
