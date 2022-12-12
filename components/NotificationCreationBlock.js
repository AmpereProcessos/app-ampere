import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
function NotificationCreationBlock({ credentials, codProjeto }) {
  const [notInfo, setNotInfo] = useState({
    destinatario: null,
    remetente: credentials.nome,
    mensagem: "",
    projetoReferencia: codProjeto,
  });
  const [destinatarioNome, setDestinatarioNome] = useState("NÃO DEFINIDO");
  const [msg, setMsg] = useState({ text: "", color: "" });
  const { users } = useContext(AppContext);
  function notify() {
    if (validateFields()) {
      axios
        .post("/api/notificacoes/1", notInfo)
        .then((res) => {
          setMsg({ text: "Notificação enviada!", color: "text-green-500" });
          setDestinatarioNome("NÃO DEFINIDO");
          setNotInfo({
            destinatario: null,
            remetente: credentials.nome,
            mensagem: "",
            projetoReferencia: codProjeto,
          });
        })
        .catch((err) =>
          setMsg({
            text: "Um erro ocorreu, tente novamente.",
            color: "text-red-500",
          })
        );
    }
  }
  function validateFields() {
    if (
      notInfo.destinatario == null ||
      notInfo.destinatario == "NÃO DEFINIDO"
    ) {
      setMsg({
        text: "Por favor, preencha o destinatário.",
        color: "text-red-500",
      });
      return false;
    }
    if (notInfo.mensagem.trim().length < 3) {
      setMsg({
        text: "Por favor, digite uma mensagem válida.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-around flex-wrap gap-x-12 px-4">
        <select
          value={destinatarioNome}
          onChange={(e) => {
            console.log(e.target.value.split("/"));
            setDestinatarioNome(e.target.value);
            setNotInfo({
              ...notInfo,
              destinatario: e.target.value.split("/")[0],
            });
          }}
          className="outline-none border border-gray-200 font-bold h-[36px]"
        >
          {users.map((usuario) => (
            <option key={usuario._id} value={`${usuario._id}/${usuario.nome}`}>
              {usuario.nome.toUpperCase()}
            </option>
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
