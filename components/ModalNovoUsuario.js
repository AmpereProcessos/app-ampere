import axios from "axios";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { routes, vendedores } from "../utils/constants";
import RoutesCard from "./RoutesCard";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "40%",
  height: "87%",
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

function formatCPF(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  // return cnpjCpf.replace(
  //   /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
  //   "$1.$2.$3/$4-$5"
  // );
}

function ModalNovoUsuario({ closeModal }) {
  const [userInfo, setUserInfo] = useState({
    nome: "",
    email: "",
    password: "",
    accessibleRoutes: [],
  });
  const [message, setMessage] = useState({ text: "", color: "" });
  function resetStates() {
    setUserInfo({
      nome: "",
      email: "",
      password: "",
      accessibleRoutes: [],
    });
  }
  function validateInfo() {
    if (userInfo.nome.trim().length < 5) {
      setMessage({
        text: "Por favor, adicione um nome válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (userInfo.email.trim().length < 10) {
      setMessage({
        text: "Por favor, adicione um email válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (userInfo.password.trim().length < 5) {
      setMessage({
        text: "Por favor, adicione um senha válido.",
        color: "text-red-500",
      });
      return false;
    }
    setMessage({ text: "", color: "" });
    return true;
  }
  function addUser() {
    if (validateInfo()) {
      axios
        .post("/api/auth/user", userInfo)
        .then((res) => {
          setMessage({ text: "Usuário adicionado!", color: "text-green-500" });
          resetStates();
        })
        .catch((err) =>
          setMessage({
            text: "Erro ao comunicar com o bando de dados",
            color: "text-red-500",
          })
        );
    }
  }
  function addRoute(rota) {
    let arr = userInfo.accessibleRoutes;
    arr.push(rota);
    setUserInfo({ ...userInfo, accessibleRoutes: [...arr] });
  }
  function removeRoute(index) {
    let arr = userInfo.accessibleRoutes;
    arr.splice(index, 1);
    setUserInfo({ ...userInfo, accessibleRoutes: arr });
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div className="w-[90%] lg:w-[40%]" style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <h1 className="font-bold text-[#15599a]">NOVO USUÁRIO</h1>
            <button>
              <VscChromeClose
                onClick={() => {
                  setMessage({ text: "", color: "" });
                  closeModal();
                }}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col py-2 gap-2  overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">NOME DO USUÁRIO</h1>
              <input
                type={"text"}
                value={userInfo.nome}
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                placeholder="Digite aqui o nome do usuário..."
                onChange={(e) =>
                  setUserInfo({ ...userInfo, nome: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">EMAIL</h1>
              <input
                type={"text"}
                value={userInfo.email}
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                placeholder="Digite aqui o email do usuário..."
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">SENHA</h1>
              <input
                type={"text"}
                value={userInfo.password}
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                placeholder="Digite aqui a senha do usuário.."
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">CPF</h1>
              <input
                type={"text"}
                value={userInfo.cpf}
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                placeholder="Digite aqui o CPF do usuário.."
                onChange={(e) =>
                  setUserInfo({ ...userInfo, cpf: formatCPF(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">RG</h1>
              <input
                type={"text"}
                value={userInfo.rg}
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                placeholder="Digite aqui o RG do usuário.."
                onChange={(e) =>
                  setUserInfo({ ...userInfo, rg: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">DATA DE NASCIMENTO</h1>
              <input
                type={"date"}
                value={
                  userInfo.birthday
                    ? new Date(userInfo.birthday).toISOString().slice(0, 10)
                    : 0
                }
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    birthday: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">DATA DE ADMISSÃO</h1>
              <input
                type={"date"}
                value={
                  userInfo.admission
                    ? new Date(userInfo.admission).toISOString().slice(0, 10)
                    : 0
                }
                className="outline-none text-center text-xs text-gray-600 w-full p-2"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    admission: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">ROTAS DISPONÍVEIS</h1>
              <div className="min-h-[60px] grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2 w-full px-2">
                {userInfo.accessibleRoutes?.length > 0 ? (
                  userInfo.accessibleRoutes.map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => removeRoute(index)}
                      className="p-2 text-center cursor-pointer h-fit rounded border border-green-500 text-green-500 font-bold hover:text-red-500 hover:border-red-500 w-full"
                    >
                      {rota}
                    </button>
                  ))
                ) : (
                  <p className="col-span-4 text-center italic text-gray-600">
                    SEM ROTAS ADICIONADAS...
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">ADIÇÃO DE ROTAS</h1>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2 w-full px-2">
                {routes
                  .filter((x) => !userInfo.accessibleRoutes.includes(x))
                  .map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => addRoute(rota)}
                      className="p-2 text-xs lg:text-base uppercase rounded border border-green-500 text-green-500 font-bold hover:text-white hover:bg-green-500"
                    >
                      {rota}
                    </button>
                  ))}
              </div>
            </div>
            <div className="flex flex-col items-center w-full py-4 border border-gray-200">
              <h1 className="text-center font-bold">TIPO DE VISUALIZAÇÃO</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2 w-full px-2 mt-2">
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: undefined,
                      vendedor: undefined,
                      regional: undefined,
                    })
                  }
                  className={`${
                    userInfo.visualizacao ? "opacity-30" : ""
                  } text-center border border-[#15599a] text-[#15599a] font-bold p-2 rounded w-full`}
                >
                  GERAL
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: "VENDEDOR",
                      regional: undefined,
                    })
                  }
                  className={`${
                    userInfo.visualizacao == "VENDEDOR" ? "" : "opacity-30"
                  } text-center border border-[#15599a] text-[#15599a] font-bold p-2 rounded w-full`}
                >
                  VENDEDOR
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: "REGIONAL",
                      vendedor: undefined,
                    })
                  }
                  className={`${
                    userInfo.visualizacao == "REGIONAL" ? "" : "opacity-30"
                  } text-center border border-[#15599a] text-[#15599a] font-bold p-2 rounded w-full`}
                >
                  REGIONAL
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: "INSIDE",
                      regional: undefined,
                    })
                  }
                  className={`${
                    userInfo.visualizacao == "INSIDE" ? "" : "opacity-30"
                  } text-center border border-[#15599a] text-[#15599a] font-bold p-2 rounded w-full`}
                >
                  INSIDE
                </button>
              </div>
              {userInfo.visualizacao == "VENDEDOR" && (
                <div className="flex flex-col justify-center items-center w-full mt-2">
                  <h1 className="text-center font-bold">VENDEDOR</h1>
                  <select
                    value={
                      userInfo.vendedor ? userInfo.vendedor : "NÃO DEFINIDO"
                    }
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, vendedor: e.target.value })
                    }
                    className="p-2 outline-none text-gray-600"
                  >
                    {vendedores.map((vendedor) => (
                      <option key={vendedor.nome} value={vendedor.nome}>
                        {vendedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {userInfo.visualizacao == "INSIDE" && (
                <div className="flex flex-col justify-center items-center w-full mt-2">
                  <h1 className="text-center font-bold">INSIDER</h1>
                  <select
                    value={
                      userInfo.vendedor ? userInfo.vendedor : "NÃO DEFINIDO"
                    }
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, vendedor: e.target.value })
                    }
                    className="p-2 outline-none text-gray-600"
                  >
                    {vendedores
                      .filter(
                        (x) =>
                          x.qualificacao?.includes("INSIDE") ||
                          x.nome == "NÃO DEFINIDO"
                      )
                      .map((vendedor) => (
                        <option key={vendedor.nome} value={vendedor.nome}>
                          {vendedor.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {userInfo.visualizacao == "REGIONAL" && (
                <div className="flex flex-col justify-center items-center w-full mt-2">
                  <h1 className="text-center font-bold">REGIONAL</h1>
                  <select
                    value={
                      userInfo.regional ? userInfo.regional : "NÃO DEFINIDO"
                    }
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, regional: e.target.value })
                    }
                    className="p-2 outline-none text-gray-600"
                  >
                    <option value={"REGIONAL ITUIUTABA"}>
                      REGIONAL ITUIUTABA
                    </option>
                    <option value={"REGIONAL UBERLÂNDIA"}>
                      REGIONAL UBERLÂNDIA
                    </option>
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                  </select>
                </div>
              )}
            </div>
            {message.text && (
              <p className={`text-center italic my-2 ${message.color}`}>
                {message.text}
              </p>
            )}
            <button
              onClick={addUser}
              className="self-center text-center w-fit p-2 rounded border border-green-500 text-green-500 hover:text-white hover:bg-green-500 font-bold"
            >
              CRIAR USUÁRIO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalNovoUsuario;
