import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
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
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ModalVisitaTecnica({ info, setModalIsOpen }) {
  const [dados, setDados] = useState(info);
  const [msg, setMessage] = useState({ text: "", color: "" });
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] pl-6  font-bold">
              {dados.nomeDoContrato}
            </h1>
            <div className="flex items-center gap-x-2">
              {msg.text && <p className={`italic ${msg.color}`}>{msg.text}</p>}
              <button className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm">
                <p>Salvar alterações</p>
                <FaSave />
              </button>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalVisitaTecnica;
