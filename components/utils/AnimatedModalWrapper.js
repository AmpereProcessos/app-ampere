import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}
const modal = {
  hidden: {
    y: '-45%',
    x: '-45%',
    scale: 0.5,
    opacity: 0.3,
  },
  visible: {
    y: '-50%',
    x: '-50%',
    scale: 1,
    opacity: 1,
  },
}
function AnimatedModalWrapper({ children, modalIsOpen, width, height }) {
  return (
    <div id="modal-wrapper" className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
      <div className="bg-background relative top-[50%] left-[50%] z-100 h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px]">
        {children}
      </div>
    </div>
  )
  // return (
  //   <>
  //     {modalIsOpen && (
  //       <AnimatePresence>
  //         <motion.div
  //           variants={backdrop}
  //           initial="hidden"
  //           animate="visible"
  //           style={OVERLAY_STYLES}
  //         >
  //           <motion.div
  //             variants={modal}
  //             initial="hidden"
  //             animate="visible"
  //             style={MODAL_STYLES}
  //             className={`${width ? `w-[90%] lg:w-[${width}]` : "w-[93%]"} ${
  //               height ? `h-[90%] lg:h-[${height}]` : "h-[98%]"
  //             }`}
  //           >
  //             {children}
  //           </motion.div>
  //         </motion.div>
  //       </AnimatePresence>
  //     )}
  //   </>
  // );
}

export default AnimatedModalWrapper
