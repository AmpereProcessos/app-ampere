import React from "react";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "85%",
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
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ModalCallPPS({ open, setModalIsOpen }) {
  if (!open) return null;
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <h1>EM CONSTRUÇÃO</h1>
            <button onClick={() => setModalIsOpen(false)}>Fechar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCallPPS;
