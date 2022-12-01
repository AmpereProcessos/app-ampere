import React from "react";
const MODAL_STYLES = {
  position: "fixed",
  top: "200px",
  left: "92.6%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "200px",
  height: "300px",
  borderRadius: "10px",
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
function NotificationModal() {
  return (
    <div style={MODAL_STYLES}>
      <div className="w-full flex flex-col h-full border border-gray-200 p-2">
        <h1 className="text-center uppercase text-[#15599a] font-bold text-sm">
          Notificações
        </h1>
      </div>
    </div>
  );
}

export default NotificationModal;
