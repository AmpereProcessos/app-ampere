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
  const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    backgroundColor: '#fff',
    // width: width ? width : "93%",
    // height: height ? height : "98%",
    borderRadius: '10px',
    padding: '10px',
    zIndex: 1000,
  }
  const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.85)',
    zIndex: 1000,
  }
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="relative left-[50%] top-[50%] z-[100] h-[70%] w-[75%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]">
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
