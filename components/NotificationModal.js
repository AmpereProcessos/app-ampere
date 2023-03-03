import axios from "axios";
import React, { useContext, useState } from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
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
  const [info, setInfo] = useState({
    destinatario: null,
    remetente: credentials?.name,
    remetenteId: credentials?.id,
    mensagem: "",
    projetoReferencia: null,
    nomeDoProjeto: null,
  });
  const [notifyMsg, setNotifyMsg] = useState({ text: "", color: "" });
  function notify() {
    if (info.mensagem?.trim().length > 0) {
      axios
        .post("/api/notificacoes/1", info)
        .then((res) => {
          setNotifyMsg({ text: "Mensagem enviada!", color: "text-green-500" });
          setTimeout(() => {
            setInfo({
              destinatario: null,
              remetente: credentials?.name,
              remetenteId: credentials?.id,
              mensagem: "",
              projetoReferencia: null,
              nomeDoProjeto: null,
            });
          }, 2800);
        })
        .catch((err) =>
          setNotifyMsg({
            text: "Houve um erro no envio.",
            color: "text-red-500",
          })
        );
    } else {
      setNotifyMsg({
        text: "Por favor, preencha uma mensagem válida.",
        color: "text-red-500",
      });
    }
  }
  function updateNotifications(id) {
    axios
      .put("/api/notificacoes/1", {
        id: id,
      })
      .then((res) => getNotificacoes(credentials?.id));
  }
  function setAsRead(id, index) {
    let arr = [...not];
    arr[index].lido = true;
    setNot([...arr]);
    updateNotifications(id);
    getNotificacoes(credentials?.id);
  }
  console.log(info);
  return (
    <div style={MODAL_STYLES}>
      <div className="w-full flex flex-col h-full border border-gray-200 py-2 px-1 shadow-xl">
        <h1 className="text-center uppercase text-[#15599a] font-bold text-sm border-b border-gray-200">
          Notificações
        </h1>
        {info.destinatario && (
          <div className="flex flex-col items-center my-2 w-full">
            <h1 className="text-xs text-[#15599a] text-center italic">
              Informações para resposta sobre o projeto:{" "}
              <strong>{info.projetoReferencia}</strong>
            </h1>
            <div className="flex flex-col w-full">
              <input
                type={"text"}
                className="outline-none text-center text-xs text-gray-600 w-full"
                placeholder="Digite aqui a mensagem a ser enviada..."
                value={info.mensagem}
                onChange={(e) => setInfo({ ...info, mensagem: e.target.value })}
              />
            </div>
            {notifyMsg && (
              <p className={`text-center text-xs my-1 ${notifyMsg.color}`}>
                {notifyMsg.text}
              </p>
            )}
            <button
              onClick={notify}
              className="bg-blue-200 hover:text-white hover:bg-blue-600 p-1 rounded-lg mt-2"
            >
              <IoIosSend style={{ fontSize: "15px" }} />
            </button>
          </div>
        )}
        <div className="flex flex-col h-full max-w-full overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {not.length > 0 ? (
            not.map((notificacao, index) => (
              <div
                key={notificacao._id}
                className={` ${
                  notificacao.lido
                    ? "flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100 bg-green-100"
                    : "flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100"
                }`}
              >
                <h1 className="text-sm italic font-bold text-gray-600">
                  <strong className="text-[#15599a]">
                    {notificacao.remetente}
                  </strong>{" "}
                  diz{" "}
                  {notificacao.projetoReferencia
                    ? `sobre o projeto ${notificacao.projetoReferencia}`
                    : ""}{" "}
                  {notificacao.nomeDoProjeto
                    ? `(${notificacao.nomeDoProjeto})`
                    : false}
                  :
                </h1>
                <p className="text-xs text-gray-500 font-raleway text-center">
                  {notificacao.mensagem}
                </p>
                <div className="flex items-center justify-end pr-4 gap-2">
                  {notificacao.remetenteId && (
                    <button
                      onClick={() =>
                        setInfo({
                          destinatario: notificacao.remetenteId,
                          remetente: credentials?.name,
                          remetenteId: credentials?.id,
                          projetoReferencia: notificacao.projetoReferencia,
                          nomeDoProjeto: notificacao.nomeDoProjeto,
                        })
                      }
                      className="outline-none transition duration-300 ease-in-out hover:scale-125"
                    >
                      <MdEmail style={{ fontSize: "20px", color: "#15599a" }} />{" "}
                    </button>
                  )}

                  {notificacao.lido ? (
                    <BsCheckAll style={{ fontSize: "20px", color: "green" }} />
                  ) : (
                    <button
                      onClick={() => setAsRead(notificacao._id, index)}
                      className="outline-none transition duration-300 ease-in-out hover:scale-150"
                    >
                      <BsCheck
                        style={{
                          fontSize: "20px",
                          color: "gray",
                          cursor: "pointer",
                        }}
                      />
                    </button>
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
