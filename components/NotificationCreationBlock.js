import axios from "axios";
import React from "react";
import { useState } from "react";

function NotificationCreationBlock({ credentials, codProjeto, usuarios }) {
  const [notInfo, setNotInfo] = useState({
    destinatario: null,
    remetente: credentials.nome,
    mensagem: "",
    projetoReferencia: codProjeto,
  });
  const [msg, setMsg] = useState({ text: "", color: "" });
  function notify() {
    axios
      .post("/api/notificacoes", notInfo)
      .then((res) =>
        setMsg({ text: "Notificação enviada!", color: "text-green-500" })
      )
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu, tente novamente.",
          color: "text-red-500",
        })
      );
  }
  console.log(notInfo);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-around flex-wrap gap-x-12 px-4">
        <select
          onChange={(e) =>
            setNotInfo({ ...notInfo, destinatario: e.target.value })
          }
          defaultValue={"NÃO DEFINIDO"}
          className="outline-none border border-gray-200 font-bold h-[36px]"
        >
          {usuarios.map((usuario) => (
            <option value={usuario._id}>{usuario.nome.toUpperCase()}</option>
          ))}
          <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
        </select>
        <input
          value={notInfo.mensagem}
          onChange={(e) => setNotInfo({ ...notInfo, mensagem: e.target.value })}
          className="grow outline-none border border-gray-200 text-xs text-center p-1 h-[36px]"
        />
        <button
          onClick={notify}
          className="text-sm bg-[#15599a] hover:bg-blue-500 text-white p-1 rounded font-bold h-[36px]"
        >
          Notificar usuário
        </button>
      </div>
      {msg.text && (
        <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
      )}
    </div>
  );
}

export default NotificationCreationBlock;
