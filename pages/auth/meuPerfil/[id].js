import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { storage } from "../../../utils/firebase";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import connectToDatabase from "../../../utils/usersDb";
import { ObjectId } from "mongodb";
import LoadingPage from "../../../components/utils/LoadingPage";

function MeuPerfil({ error, info }) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [not, setNot] = useState();
  const [notifyInfo, setNotifyInfo] = useState({
    destinatario: null,
    remetente: session?.user?.name,
    remetenteId: session?.user?.id,
    mensagem: "",
    projetoReferencia: null,
    nomeDoProjeto: null,
  });
  const [notifyMsg, setNotifyMsg] = useState({ text: "", color: "" });

  const [infoHolder, setInfo] = useState(info);
  const [newImage, setNewImage] = useState();
  const [msg, setMsg] = useState({ text: "", color: "" });

  // Regarding Image
  async function uploadImage() {
    var splitNome = info.nome.toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    var imageRef = ref(storage, `usuarios/avatar-${fixedNome}`);
    let res = await uploadBytes(imageRef, newImage);
    let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
    return url;
  }
  async function saveChanges() {
    if (newImage) {
      var url = await uploadImage();
    }
    axios
      .put(`/api/auth/user`, {
        id: info._id,
        changes: { ...info, avatar_url: url ? url : info.avatar_url },
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas!", color: "text-green-500" });
        setTimeout(() => {
          setMsg({ text: "", color: "" });
        }, 2500);
      })
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu na alteração de informações.",
          color: "text-red-500",
        })
      );
  }
  // Regarding Notifications
  function getNotificacoes(id) {
    axios.get(`/api/notificacoes/${id}`).then((res) => setNot(res.data));
  }
  function notify() {
    if (notifyInfo.mensagem?.trim().length > 0) {
      axios
        .post("/api/notificacoes/1", notifyInfo)
        .then((res) => {
          setNotifyMsg({
            text: "Mensagem enviada!",
            color: "text-green-500",
          });
          setTimeout(() => {
            setNotifyInfo({
              destinatario: null,
              remetente: session?.user?.name,
              remetenteId: session?.user?.id,
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
      .then((res) => getNotificacoes(session?.user?.id));
  }
  function setAsRead(id, index) {
    let arr = [...not];
    arr[index].lido = true;
    setNot([...arr]);
    updateNotifications(id);
    getNotificacoes(session?.user?.id);
  }

  useEffect(() => {
    // create the preview
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setInfo({ avatar_url: objectUrl });

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newImage]);
  useEffect(() => {
    if (!error) {
      getNotificacoes(info._id);
    }
  }, [session]);

  if (error) {
    return (
      <div className="flex flex-col grow items-center justify-center">
        <p className="uppercase text-4xl text-gray-700">{error}</p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col bg-[#fff] grow items-center">
        <div className="w-full bg-gray-800 flex items-center justify-between h-[80px] p-2">
          <div className="w-[100px] flex items-center justify-center text-white">
            <RiArrowGoBackFill
              onClick={() => router.push("/")}
              style={{ fontSize: "30px" }}
            />
          </div>
          <h1 className="text-center font-bold text-white">MEU PERFIL</h1>
          <div className="w-[100px]"></div>
        </div>
        <div className="grid grid-rows-10 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-y-4 lg:gap-2 p-6  w-full xl:w-[70%]">
          <div className="row-span-1 lg:col-span-2 p-4 flex items-center justify-center w-full min-h-[350px] border border-gray-300 shadow-lg rounded-md">
            <div className="flex flex-col items-center">
              <div className="mb-3 rounded-full relative w-[150px] h-[150px]">
                {!newImage && info.avatar_url ? (
                  <>
                    <Image
                      src={infoHolder.avatar_url}
                      // width={96}
                      // height={96}
                      fill={true}
                      layout={"fill"}
                      style={{ borderRadius: "100%" }}
                    />
                    <div className="flex items-center justify-center rounded-full w-[150px] h-[150px] absolute opacity-0 hover:opacity-60 bg-gray-400">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute text-white font-bold translate-x-[-10%] translate-y-[-10%]">
                        Editar
                      </p>
                    </div>
                  </>
                ) : newImage ? (
                  <>
                    <Image
                      src={infoHolder.avatar_url}
                      // width={96}
                      // height={96}
                      fill={true}
                      layout={"fill"}
                      style={{ borderRadius: "100%" }}
                    />
                    <div className="flex items-center justify-center rounded-full w-[150px] h-[150px] absolute opacity-0 hover:opacity-60 bg-gray-400">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute text-white font-bold translate-x-[-10%] translate-y-[-10%]">
                        Editar
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="relative flex items-center justify-center rounded-full w-[150px] h-[150px] bg-gray-600">
                    <FaUser style={{ color: "white", fontSize: "35px" }} />
                    <div className="flex items-center justify-center rounded-full w-[150px] h-[150px] absolute opacity-0 hover:opacity-60 bg-gray-400">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute text-white font-bold translate-x-[-10%] translate-y-[-10%]">
                        Editar
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="text-gray-700 font-bold text-2xl">{info.nome}</h1>
              <h1 className="text-gray-500 font-bold text-sm">{info.role}</h1>
              {msg.text ? (
                <p className={`text-center italic ${msg.color} text-xs`}>
                  {msg.text}
                </p>
              ) : null}
              {newImage ? (
                <button
                  onClick={saveChanges}
                  className="mt-4 rounded-lg p-2 font-bold text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Salvar
                </button>
              ) : null}
            </div>
          </div>
          <div className="row-span-9 lg:col-span-8 p-4 flex flex-col min-h-[350px] border border-gray-300 shadow-lg rounded-md">
            <h1 className="text-xl text-center font-bold text-[#15599a] border-b border-[#15599a] pb-2">
              INFORMAÇÕES DO USUÁRIO
            </h1>
            <div className="flex flex-col grow gap-4 pt-2">
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  NOME:
                </p>
                <p className="lg:col-span-7 text-center lg:text-start text-gray-500">
                  {info.nome}
                </p>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  EMAIL:
                </p>
                <p className="lg:col-span-7 text-center lg:text-start text-gray-500">
                  {info.email}
                </p>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  AVATAR DISPONÍVEL EM:
                </p>
                <a
                  href={info.avatar_url}
                  className="lg:col-span-7 text-center lg:text-start text-gray-500 hover:text-blue-300 cursor-pointer break-words"
                >
                  {info.avatar_url ? info.avatar_url : "-"}
                </a>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  DATA DE NASCIMENTO:
                </p>
                <p className="lg:col-span-7 text-center lg:text-start text-gray-500">
                  {info.birthday
                    ? dayjs(info.birthday).add(4, "hours").format("DD/MM/YYYY")
                    : "-"}
                </p>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  RG
                </p>
                <p className="lg:col-span-7 text-center lg:text-start text-gray-500">
                  {info.rg ? info.rg : "AINDA NÃO DEFINIDO"}
                </p>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-2 py-2 items-center w-full border-b border-gray-200">
                <p className="col-span-1 lg:col-span-3 font-bold text-gray-700 text-sm lg:text-md text-center lg:text-start">
                  CPF
                </p>
                <p className="lg:col-span-7 text-center lg:text-start text-gray-500">
                  {info.cpf ? info.cpf : "AINDA NÃO DEFINIDO"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-10 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 gap-y-4 lg:gap-2 p-6  w-full xl:w-[70%]">
          <div className="row-span-1 lg:col-span-2 p-4 flex flex-col items-center w-full max-h-[850px] min-h-[350px] border border-gray-300 shadow-lg rounded-md">
            <h1 className="text-gray-700 font-bold text-xl pb-2 border-b border-gray-300">
              ROTAS ACESSÍVEIS
            </h1>
            <div className="flex flex-col gap-2 grow w-full my-2 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {info.accessibleRoutes.map((route, index) => (
                <p
                  key={index}
                  className="uppercase p-2 font-bold text-center rounded-lg w-full border-2 border-[#fead61] text-[#fead61]"
                >
                  {route}
                </p>
              ))}
            </div>
          </div>
          <div className="row-span-9 lg:col-span-8 p-4 flex flex-col max-h-[850px] min-h-[350px] border border-gray-300 shadow-lg rounded-md">
            <h1 className="text-xl text-center font-bold text-[#15599a] border-b border-[#15599a] pb-2">
              NOTIFICAÇÕES
            </h1>
            {notifyInfo.destinatario && (
              <div className="flex flex-col items-center my-2 w-full">
                <h1 className="text-xs text-[#15599a] text-center italic">
                  Informações para resposta sobre o projeto:{" "}
                  <strong>{notifyInfo.projetoReferencia}</strong>
                </h1>
                <div className="flex flex-col w-full">
                  <input
                    type={"text"}
                    className="outline-none text-center text-xs text-gray-600 w-full"
                    placeholder="Digite aqui a mensagem a ser enviada..."
                    value={notifyInfo.mensagem}
                    onChange={(e) =>
                      setNotifyInfo({ ...notifyInfo, mensagem: e.target.value })
                    }
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
            <div className="flex flex-col grow max-w-full overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {not ? (
                not.length > 0 ? (
                  not.map((notificacao, index) => (
                    <div
                      key={notificacao._id}
                      className={` ${
                        notificacao.lido
                          ? "flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100 bg-green-100"
                          : "flex flex-col p-1 max-w-full border-b border-gray-200 hover:bg-blue-100"
                      }`}
                    >
                      <h1 className="text-sm text-center italic font-bold text-gray-600">
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
                              setNotifyInfo({
                                destinatario: notificacao.remetenteId,
                                remetente: session?.user?.name,
                                remetenteId: session?.user?.id,
                                projetoReferencia:
                                  notificacao.projetoReferencia,
                                nomeDoProjeto: notificacao.nomeDoProjeto,
                              })
                            }
                            className="outline-none transition duration-300 ease-in-out hover:scale-125"
                          >
                            <MdEmail
                              style={{ fontSize: "20px", color: "#15599a" }}
                            />{" "}
                          </button>
                        )}

                        {notificacao.lido ? (
                          <BsCheckAll
                            style={{ fontSize: "20px", color: "green" }}
                          />
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
                )
              ) : (
                <LoadingPage />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  var myregexp = /^[0-9a-fA-F]{24}$/;
  const id = query.id;
  try {
    if (!myregexp.test(id)) throw { msg: "ID inválido." };
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("users");
    let user = await collection.findOne({
      _id: new ObjectId(id),
    });
    let info = JSON.parse(JSON.stringify(user));
    // Pass data to the page via props
    return { props: { info } };
  } catch (error) {
    let msg = error.msg
      ? error.msg
      : "Erro não identificável. Por favor, tente novamente mais tarde";
    return { props: { error: msg } };
  }
}
export default MeuPerfil;
