import React, { useState } from "react";
import Image from "next/image";
import { VscChromeClose } from "react-icons/vsc";
import { storage } from "../utils/firebase";
import { BsCheckLg } from "react-icons/bs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "30%",
  height: "50%",
  borderRadius: "5px",
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
function ModalEdicaoUsuario({ closeModal, userInfo, getUsers }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [info, setInfo] = useState(userInfo);
  const [image, setImage] = useState();
  async function uploadImage() {
    var splitNome = info.nome.toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    var imageRef = ref(storage, `usuarios/avatar-${fixedNome}`);
    let res = await uploadBytes(imageRef, image);
    let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
    return url;
  }
  async function saveChanges() {
    if (image) {
      var url = await uploadImage();
    }
    axios
      .put(`/api/auth/user`, {
        id: userInfo._id,
        changes: { ...info, avatar_url: url ? url : info.avatar_url },
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas!", color: "text-green-500" });
        setTimeout(() => {
          setMsg({ text: "", color: "" });
        }, 2500);
        getUsers();
      })
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu na alteração de informações.",
          color: "text-red-500",
        })
      );
  }

  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-between pb-2 border-b border-gray-200">
            <h1 className="text-center font-bold text-[#15599a] self-start">
              ALTERAÇÃO DE INFORMAÇÕES
            </h1>
            <div className="self-end flex items-center justify-center h-full">
              <button className="flex items-center justify-center hover:scale-125 transition duration-300 ease-in-out">
                <VscChromeClose
                  onClick={() => {
                    closeModal();
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 py-4 px-3 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex items-center  justify-center h-[200px]">
              {info.avatar_url ? (
                <div className="mb-3 rounded-full relative w-[120px] h-[120px] cursor-pointer">
                  <Image
                    src={info.avatar_url}
                    // width={96}
                    // height={96}
                    fill={true}
                    layout={"fill"}
                    style={{
                      borderRadius: "100%",
                      objectFit: "cover",
                      position: "absolute",
                    }}
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    className="h-full w-full opacity-0"
                    type="file"
                  />
                </div>
              ) : (
                <div className="h-[120px] w-[120px] relative rounded-full flex justify-center items-center bg-gray-200 border border-gray-300">
                  {image?.name ? (
                    <div className="absolute flex items-center justify-center">
                      <BsCheckLg style={{ color: "green", fontSize: "25px" }} />
                    </div>
                  ) : (
                    <p className="text-xs absolute text-gray-700 text-center w-full font-bold">
                      ESCOLHA UMA IMAGEM
                    </p>
                  )}

                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg"
                  />
                </div>
              )}
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                value={info.nome}
                onChange={(e) => setInfo({ ...info, nome: e.target.value })}
                type="text"
                name="name"
                id="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                NOME
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                EMAIL
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                value={info.password}
                onChange={(e) => setInfo({ ...info, password: e.target.value })}
                type="text"
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                SENHA
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                value={info.cpf}
                onChange={(e) =>
                  setInfo({ ...info, cpf: formatCPF(e.target.value) })
                }
                type="text"
                name="cpf"
                id="cpf"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="cpf"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                CPF
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                value={info.rg}
                onChange={(e) => setInfo({ ...info, rg: e.target.value })}
                type="text"
                name="rg"
                id="rg"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="rg"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                RG
              </label>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-500 text-sm">
                DATA DE NASCIMENTO
              </label>
              <input
                value={
                  info.birthday
                    ? new Date(info.birthday).toISOString().slice(0, 10)
                    : 0
                }
                onChange={(e) =>
                  setInfo({
                    ...info,
                    birthday: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                type={"date"}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-500 text-sm">DATA DE ADMISSÃO</label>
              <input
                value={
                  info.admission
                    ? new Date(info.admission).toISOString().slice(0, 10)
                    : 0
                }
                onChange={(e) =>
                  setInfo({
                    ...info,
                    admission: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                type={"date"}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
            {msg.text ? (
              <p className={`text-center text-xs italic ${msg.color}`}>
                {msg.text}
              </p>
            ) : (
              <button
                onClick={saveChanges}
                type="button"
                className="mt-4 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              >
                SALVAR ALTERAÇÕES
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEdicaoUsuario;
