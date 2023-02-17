import React from "react";
import { AnimatePresence, motion } from "framer-motion";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "93%",
  height: "98%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.85)",
  zIndex: 1000,
};
const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const modal = {
  hidden: {
    y: "-45%",
    x: "-45%",
    scale: 0.5,
    opacity: 0.3,
  },
  visible: {
    y: "-50%",
    x: "-50%",
    scale: 1,
    opacity: 1,
  },
};
function AnimatedModalWrapper({ children, modalIsOpen }) {
  return (
    <>
      {modalIsOpen && (
        <AnimatePresence>
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            style={OVERLAY_STYLES}
          >
            <motion.div
              variants={modal}
              initial="hidden"
              animate="visible"
              style={MODAL_STYLES}
            >
              {children}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

export default AnimatedModalWrapper;
