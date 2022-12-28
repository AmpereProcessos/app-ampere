import axios from "axios";
import React, { useContext, useState } from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { AppContext } from "../context/AppContext";
const MODAL_STYLES = {
  position: "fixed",
  top: "230px",
  right: "-120px",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "300px",
  height: "350px",
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
  const { notificacoes, getNotificacoes, credentials } = useContext(AppContext);
  const [not, setNot] = useState(notificacoes);
  function updateNotifications(id) {
    axios
      .put("/api/notificacoes/1", {
        id: id,
      })
      .then((res) => getNotificacoes(credentials._id));
  }
  function setAsRead(id, index) {
    let arr = [...not];
    arr[index].lido = true;
    setNot([...arr]);
    updateNotifications(id);
    getNotificacoes(credentials._id);
  }
  return (
    <div style={MODAL_STYLES}>
      <div className="w-full flex flex-col h-full border border-gray-200 py-2 px-1 shadow-xl">
        <h1 className="text-center uppercase text-[#15599a] font-bold text-sm border-b border-gray-200">
          Notificações
        </h1>
        <div className="flex flex-col h-full max-w-full overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {not.length > 0 ? (
            not.map((notificacao, index) => (
              <div
                key={notificacao._id}
                onClick={() => setAsRead(notificacao._id, index)}
                className={` ${
                  notificacao.lido
                    ? "cursor-pointer flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100 bg-green-100"
                    : "cursor-pointer flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100"
                }`}
              >
                <h1 className="text-sm italic font-bold text-gray-600">
                  <strong className="text-[#15599a]">
                    {notificacao.remetente}
                  </strong>{" "}
                  diz{" "}
                  {notificacao.projetoReferencia
                    ? `sobre o projeto ${notificacao.projetoReferencia}`
                    : ""}
                  :
                </h1>
                <p className="text-xs text-gray-500 font-raleway text-center">
                  {notificacao.mensagem}
                </p>
                <div className="flex items-center justify-end pr-4">
                  {notificacao.lido ? (
                    <BsCheckAll style={{ fontSize: "20px", color: "green" }} />
                  ) : (
                    <BsCheck style={{ fontSize: "20px", color: "gray" }} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex justify-center items-center">
              <p className="italic text-gray-500 text-sm">
                Sem notificações...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
