import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import { IoIosSend } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import SelectFloatingInput from "../components/SelectFloatingInput";
import TextFloatingInput from "../components/TextFloatingInput";
function NotificationCreationBlock({ codProjeto, nomeDoProjeto }) {
  const { credentials, users } = useContext(AppContext);

  const [notifyMenuVisible, setNotifyMenuVisible] = useState(false);

  const [notInfo, setNotInfo] = useState({
    destinatario: null,
    remetente: credentials?.name,
    remetenteId: credentials?.id,
    mensagem: "",
    projetoReferencia: codProjeto,
    nomeDoProjeto: nomeDoProjeto,
  });
  const [destinatarioNome, setDestinatarioNome] = useState("NÃO DEFINIDO");
  const [msg, setMsg] = useState({ text: "", color: "" });
  function notify() {
    if (validateFields()) {
      axios
        .post("/api/notificacoes/1", notInfo)
        .then((res) => {
          setMsg({ text: "Notificação enviada!", color: "text-green-500" });
          setDestinatarioNome("NÃO DEFINIDO");
          setNotInfo({
            destinatario: null,
            remetente: credentials?.name,
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
    <>
      {notifyMenuVisible ? (
        <div className="flex flex-col p-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-center font-bold text-[#15599a]">
              PAINEL DE NOTIFICAÇÃO
            </h1>
            <div
              onClick={() => setNotifyMenuVisible(false)}
              className="text-red-500 text-[19px] hover:scale-125 ease-in duration-300 mb-1 cursor-pointer"
            >
              <VscChromeClose />
            </div>
          </div>

          <div className="flex items-center justify-around flex-wrap gap-x-12 px-4 mt-4">
            <SelectFloatingInput
              label="USUÁRIO"
              width={"fit"}
              editable={true}
              notDefinedOption={true}
              value={destinatarioNome ? destinatarioNome : `NÃO DEFINIDO`}
              options={users.map((user) => {
                return {
                  label: user.nome.toUpperCase(),
                  value: `${user._id}/${user.nome}`,
                };
              })}
              handleChange={(value) => {
                setDestinatarioNome(value);
                setNotInfo({
                  ...notInfo,
                  destinatario: value.split("/")[0],
                });
              }}
            />
            {/* <select
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
                <option
                  key={usuario._id}
                  value={`${usuario._id}/${usuario.nome}`}
                >
                  {usuario.nome.toUpperCase()}
                </option>
              ))}
              <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
            </select> */}
            <TextFloatingInput
              label={"MENSAGEM"}
              editable={true}
              width="100%"
              value={notInfo.mensagem}
              handleChange={(value) =>
                setNotInfo({ ...notInfo, mensagem: value })
              }
              className="grow outline-none border border-gray-200 text-xs text-center p-1 h-[36px]"
            />
            <button
              onClick={notify}
              className="bg-blue-200 hover:text-white hover:bg-blue-600  rounded-lg mt-2 hover:scale-110 ease-in duration-300 text-[25px]"
            >
              <div className="ease-in duration-300 -translate-x-1 p-2 rotate-45 hover:translate-x-0 hover:rotate-0 w-full h-hull">
                <IoIosSend />
              </div>
            </button>
          </div>
          {msg.text && (
            <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-2">
          <h1 className="text-[#15599a] font-bold">
            Deseja notificar algum usuário acerca de atualizações desse projeto
            ?{" "}
            <strong
              onClick={() => setNotifyMenuVisible(true)}
              className="text-[#fead61] cursor-pointer"
            >
              Clique aqui
            </strong>
          </h1>
        </div>
      )}
    </>
  );
}

export default NotificationCreationBlock;
