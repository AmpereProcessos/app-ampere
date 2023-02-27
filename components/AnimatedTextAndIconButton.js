import React, { useState } from "react";
import { motion } from "framer-motion";
import { BsPlusLg } from "react-icons/bs";
function AnimatedTextAndIconButton({ pText, children, exec }) {
  const [openNewUserButton, setOpenNewUserButton] = useState(false);
  return (
    <motion.div
      layout
      // data-isOpen={isOpen}
      onClick={exec}
      onMouseEnter={() => setOpenNewUserButton(true)}
      onMouseLeave={() => setOpenNewUserButton(false)}
      className={`${
        openNewUserButton ? "w-[200px] py-6 rounded-full" : "p-6 rounded-full "
      } flex justify-center items-center gap-2 fixed cursor-pointer ml-12  bottom-10 left-150 border border-[#15599a] bg-[#15599a] text-white`}
    >
      {openNewUserButton ? <>{children}</> : <BsPlusLg />}
    </motion.div>
  );
}

export default AnimatedTextAndIconButton;
