import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsCalendarCheckFill, BsCalendarFill, BsCode, BsHouse } from "react-icons/bs";
import {
  FaCity,
  FaHandHoldingUsd,
  FaMobileAlt,
  FaMoneyBillWave,
  FaSave,
  FaSolarPanel,
  FaUser,
} from "react-icons/fa";
import { HiIdentification, HiOutlineIdentification } from "react-icons/hi";
import { MdCategory, MdLocationPin, MdOutlineEmail, MdWork } from "react-icons/md";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import { VscChromeClose } from "react-icons/vsc";
import { useSession } from "../components/providers/SessionProvider";
import { formatDecimalPlaces, respChamadosPPS } from "../utils/constants";
import { useKey } from "../utils/hooks";
import { getErrorMessage } from "../utils/methods/handlers";
import { deletePPSCall, saveCallChanges } from "../utils/methods/mutation/ppsCalls";
import { usePPSCall } from "../utils/methods/query/ppsCalls";
import PPSModalCallInfo from "./PPSModalCallInfo";
import CallFile from "./identificador/chamados/pps/CallFile";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import Avatar from "./utils/Avatar";
import { LoadingButton } from "./utils/Buttons/LoadingButton";
import SaveButton from "./utils/Buttons/SaveButton";
import LoadingPage from "./utils/LoadingPage";
import ResponsiveDialogDrawerViewOnly from "./utils/ResponsiveDialogDrawerViewOnly";
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
const statusStyles = {
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  "AGUARDANDO VENDEDOR": {
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
  },
  REALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
};
export const responsibles = [
  {
    id: null,
    nome: "Adriano Arantes",
    apelido: "ADRIANO",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-adriano.jpg?alt=media&token=a30ec3dd-8a2e-4a24-b330-1f4e9b9f0db6",
  },
  {
    id: null,
    nome: "Arthur Alexander",
    apelido: "ARTHUR",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-arthurziin.jpg?alt=media&token=150fd914-04d5-4c0a-bf33-7daccdf81916",
  },
  {
    id: "6318db05929e9f8731d8d9bb",
    nome: "Lucas Fernandes",
    ativo: true,
    apelido: "LUCAS",
    avatar_url:
      "https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4",
  },
  {
    id: "632372d90d695bd5256518bb",
    nome: "Nathan Peres",
    apelido: "NATHAN",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-nathan_peres?alt=media&token=7f672eea-0b33-4e49-b747-f2de2ee110ad",
  },
  {
    id: "631f832a5ba9ffa2a4cb8369",
    nome: "Matheus Oliveira",
    apelido: "MATHEUS",
    ativo: true,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2FavatarMatheus.jpg?alt=media&token=adb60500-22e6-4c1d-908f-72e3279fc641",
  },
  {
    id: "63a5fb69e6a905a237de81eb",
    nome: "Leandro Viali",
    apelido: "LEANDRO",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-leandro_viali?alt=media&token=dffd6966-b6d4-460d-9baa-d467d933a8a7",
  },
  {
    id: "65524e514ca81ebd783bbba1",
    nome: "Gabriella Baltazar",
    apelido: "GABRIELLA",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-gabriella_baltazar?alt=media&token=28392bcb-1f54-4dc7-9f31-98f189362231",
  },
  {
    id: "659e8961df037400d84571ac",
    nome: "Luis Eduardo",
    apelido: "LUIS EDUARDO",
    ativo: false,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-luis_eduardo?alt=media&token=57cbbdbe-709c-4778-b5e4-4d823bd41621",
  },
  {
    id: "63754046d2073932d9180821",
    nome: "Rafael Feo",
    apelido: "RAFAEL FEO",
    ativo: true,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-rafael_feo?alt=media&token=edec02ff-c2df-455d-ad30-8358710dda93",
  },
  {
    id: "6537c52474d5eecc1b67f1ee",
    nome: "Felipe Tadeu",
    apelido: "FELIPE",
    ativo: true,
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Fcrm%2Favatar-felipe_tadeu?alt=media&token=a1f97754-8a51-43fc-b9c9-72e35d80180e",
  },
];
function ModalCallPPS({ callId, modalIsOpen, closeModal }) {
  useKey("Escape", () => closeModal());
  const queryClient = useQueryClient();
  const router = useRouter();
  const { session } = useSession({});
  const editor = !!session?.user.permissoes.comercial.visualizar;

  const {
    data: call,
    isLoading: callLoading,
    isFetched: callFetched,
  } = usePPSCall(callId, !!callId);
  const [infoHolder, setInfoHolder] = useState(call);
  const [changes, setChanges] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const { mutate: handleDeleteCall, isPending: deleteCallIsPending } = useMutation({
    mutationKey: ["delete-pps-call", callId],
    mutationFn: async () => await deletePPSCall({ id: call._id }),
    onSuccess: async (response) => {
      toast.success(response);
      await queryClient.invalidateQueries({ queryKey: ["open-pps-calls"] });
      await queryClient.invalidateQueries({ queryKey: ["closed-pps-calls"] });
      await queryClient.invalidateQueries({ queryKey: ["pps-calls", call._id] });
      setDeleteConfirmationOpen(false);
      closeModal();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  function renderResponsibles(current) {
    const filtered = responsibles.filter((resp) => resp.ativo || resp.apelido == current);
    return filtered.map((resp, index) => (
      <div
        key={index}
        onClick={() => handleChange("responsavel", resp)}
        className={`${infoHolder.responsavel?.apelido == resp.apelido ? "" : "opacity-40"} flex w-fit cursor-pointer items-center gap-2 rounded-md border border-blue-700 p-2`}
      >
        <Avatar url={resp.avatar_url} fallback={"R"} height={25} width={25} />
        <p className="text-foreground text-xs font-medium">{resp.apelido}</p>
      </div>
    ));
  }

  function handleChange(key, value) {
    // Function to update nested keys
    const updateNestedKey = (obj, keys, newValue) => {
      const keysArray = keys.split(".");
      const lastKey = keysArray.pop();
      const nestedObj = keysArray.reduce((acc, k) => acc[k], obj);
      nestedObj[lastKey] = newValue;
    };

    setChanges((prevChanges) => ({ ...prevChanges, [key]: value }));

    // Update the infoHolder with the new changes
    setInfoHolder((prevInfo) => {
      const updatedInfo = { ...prevInfo };
      updateNestedKey(updatedInfo, key, value);
      return updatedInfo;
    });
  }
  async function handleSaveChanges() {
    const loadingToastId = toast.loading("Carregando...");
    try {
      const response = await saveCallChanges({ id: call._id, changes: changes });
      toast.dismiss(loadingToastId);
      toast.success(response);
      await queryClient.invalidateQueries({ queryKey: ["open-pps-calls"] });
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.dismiss(loadingToastId);
      toast.error(msg);
    }
  }
  async function handleCloseCall() {
    const loadingToastId = toast.loading("Carregando...");
    try {
      await queryClient.cancelQueries({ queryKey: ["open-pps-calls"] });
      await queryClient.cancelQueries({ queryKey: ["closed-pps-calls"] });
      const currentDate = new Date().toISOString();
      setInfoHolder((prev) => ({ ...prev, status: "REALIZADO", dataEfetivacao: currentDate }));
      const changes = {
        status: "REALIZADO",
        dataEfetivacao: currentDate,
      };
      const response = await saveCallChanges({ id: call._id, changes: changes });
      toast.dismiss(loadingToastId);
      toast.success(response);
      await queryClient.invalidateQueries({ queryKey: ["open-pps-calls"] });
      await queryClient.invalidateQueries({ queryKey: ["closed-pps-calls"] });
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.dismiss(loadingToastId);
      toast.error(msg);
    }
  }
  async function handleReOpenCall() {
    const loadingToastId = toast.loading("Carregando...");
    try {
      await queryClient.cancelQueries({ queryKey: ["open-pps-calls"] });
      await queryClient.cancelQueries({ queryKey: ["closed-pps-calls"] });
      setInfoHolder((prev) => ({ ...prev, status: "PENDENTE", dataEfetivacao: null }));
      const changes = {
        status: "PENDENTE",
        dataEfetivacao: null,
      };
      const response = await saveCallChanges({ id: call._id, changes: changes });
      toast.dismiss(loadingToastId);
      toast.success(response);
      await queryClient.invalidateQueries({ queryKey: ["open-pps-calls"] });
      await queryClient.invalidateQueries({ queryKey: ["closed-pps-calls"] });
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.dismiss(loadingToastId);
      toast.error(msg);
    }
  }
  function getChargesTotals(arr) {
    let sumTotalPot = 0;
    let sumTotalDailyConsumption = 0;
    for (let i = 0; i < arr.length; i++) {
      sumTotalPot = sumTotalPot + arr[i].qtde * arr[i].potencia;
      sumTotalDailyConsumption =
        sumTotalDailyConsumption + arr[i].qtde * arr[i].potencia * arr[i].horasFuncionamento;
    }
    return {
      totalPot: sumTotalPot / 1000,
      totalDailyConsumption: sumTotalDailyConsumption,
    };
  }
  useEffect(() => {
    setInfoHolder(call);
  }, [call]);

  useEffect(() => {
    if (!modalIsOpen) setDeleteConfirmationOpen(false);
  }, [modalIsOpen]);
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen} width={"60%"} height={"87%"}>
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b px-2 pb-2 text-lg">
            <div className="flex flex-col">
              <h1 className="pl-6 font-bold text-[#15599a]">{call?.tipoSolicitacao || "..."}</h1>
              <p className="text-foreground text-center text-xs">#{call?._id || "..."}</p>
            </div>
            <button>
              <VscChromeClose
                onClick={() => {
                  closeModal();
                }}
                style={{ color: "red" }}
              />
            </button>
          </div>
          {callFetched && infoHolder ? (
            <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex flex-col gap-2 overflow-y-auto px-2 lg:px-0">
              <div className="mt-4 flex w-full items-center justify-center">
                <div className="flex grow justify-center gap-x-2">
                  {infoHolder.status === "REALIZADO" ? (
                    <div
                      className={`w-fit cursor-pointer rounded-lg border border-green-500 p-3 text-center text-xs font-bold text-green-500`}
                    >
                      REALIZADO
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => handleChange("status", "PENDENTE")}
                        className={`${infoHolder.status != "PENDENTE" && "opacity-30"} w-fit cursor-pointer rounded-lg border border-red-500 p-3 text-center text-xs font-bold text-red-500`}
                      >
                        PENDENTE
                      </div>
                      <div
                        onClick={() => handleChange("status", "EM ANDAMENTO")}
                        className={`${
                          infoHolder.status != "EM ANDAMENTO" && "opacity-30"
                        } w-fit cursor-pointer rounded-lg border border-blue-500 p-3 text-center text-xs font-bold text-blue-500`}
                      >
                        EM ANDAMENTO
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar fallback={"U"} height={25} width={25} url={call.requerente.avatar_url} />
                  <p className="text-foreground text-xs font-medium">
                    {call.requerente?.apelido || "Requerente não identificado"}
                  </p>
                </div>
                <div className="text-foreground flex items-center gap-2">
                  <BsCalendarFill />
                  <p className="text-xs font-medium">
                    {dayjs(call.dataInsercao).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
              {call.dataEfetivacao ? (
                <div className="mt-4 flex w-full items-center justify-center gap-2 text-green-500">
                  <BsCalendarCheckFill />
                  <p className="text-xs font-medium">
                    {dayjs(call.dataEfetivacao).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              ) : null}

              <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">
                PROJETO
              </h1>
              {call.projeto ? (
                <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                  <div className="flex items-center gap-2">
                    <BsCode size={"20px"} color="rgb(31,41,55)" />
                    {call.projeto.id ? (
                      <Link
                        href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${call.projeto.id}`}
                      >
                        <div className="font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-cyan-300">
                          #{call.projeto.codigo || "N/A"}
                        </div>
                      </Link>
                    ) : (
                      <p className="font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-blue-300">
                        #{call.projeto.codigo || "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser size={"20px"} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">{call.projeto.nome || "N/A"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-foreground w-full py-2 text-center text-sm italic">
                  Sem informações do projeto...
                </p>
              )}
              <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">
                CLIENTE
              </h1>
              {call.cliente ? (
                <div className="flex w-full flex-col gap-2 py-2">
                  <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                    <div className="text-foreground flex items-center gap-2">
                      <FaUser size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.nome || "N/A"}
                      </p>
                    </div>
                    {/* <div className="flex gap-2 items-center">
                      <MdCategory size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.tipo || 'N/A'}</p>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <HiIdentification size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.cpfCnpj || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                    <div className="flex items-center gap-2">
                      <FaMobileAlt size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.telefone || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdOutlineEmail size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                    <div className="flex items-center gap-2">
                      <FaCity size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.uf || "N/A"} / {call.cliente.cidade || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdLocationPin size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.endereco
                          ? `${call.cliente.endereco} - ${call.cliente.numeroOuIdentificador}, ${call.cliente.bairro} - ${call.cliente.cep}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.renda || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdWork size={"20px"} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">
                        {call.cliente.profissao || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-foreground w-full py-2 text-center text-sm italic">
                  Sem informações do cliente...
                </p>
              )}
              <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">
                PREMISSAS
              </h1>
              {call.premissas ? (
                <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                  <div className="flex items-center gap-2">
                    <FaSolarPanel size={"20px"} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">
                      {call.premissas.geracao ? `${call.premissas.geracao} kWh` : "N;A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbTopologyFullHierarchy size={"20px"} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">
                      {call.premissas.topologia || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsHouse size={"20px"} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">
                      {call.premissas.tipoEstrutura || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHandHoldingUsd size={"20px"} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">
                      {call.premissas.valorFinanciamento || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-foreground w-full py-2 text-center text-sm italic">
                  Sem premissas fornecidas...
                </p>
              )}
              {call.premissas?.cargas ? (
                <div className="text-foreground flex w-full flex-col">
                  <p className="text-center text-xs font-bold">EQUIPAMENTOS</p>
                  <div className="grid grid-cols-5 lg:grid-cols-6">
                    <h1 className="bg-primary/80 text-xxs border-r border-white p-1 text-center font-bold text-white lg:text-xs">
                      NOME
                    </h1>
                    <h1 className="bg-primary/80 text-xxs hidden border-r border-white p-1 text-center font-bold text-white lg:flex lg:text-xs">
                      POTÊNCIA NOMINAL
                    </h1>
                    <h1 className="bg-primary/80 text-xxs border-r border-white p-1 text-center font-bold text-white lg:text-xs">
                      QTDE
                    </h1>
                    <h1 className="bg-primary/80 text-xxs border-r border-white p-1 text-center font-bold text-white lg:text-xs">
                      POTÊNCIA TOTAL
                    </h1>
                    <h1 className="bg-primary/80 text-xxs border-r border-white p-1 text-center font-bold text-white lg:text-xs">
                      HORAS DE USO
                    </h1>
                    <h1 className="bg-primary/80 text-xxs p-1 text-center font-bold text-white lg:text-xs">
                      Wh DIÁRIO
                    </h1>
                  </div>
                  {call.premissas.cargas.map((charge, index) => (
                    <div
                      key={index}
                      className="border-border grid grid-cols-5 border border-t-0 lg:grid-cols-6"
                    >
                      <h1 className="text-xxs text-foreground border-border border-r p-2 text-center font-bold">
                        {charge.descricao}
                      </h1>
                      <h1 className="text-xxs text-foreground border-border hidden border-r p-2 text-center font-bold lg:flex">
                        {charge.qtde}
                      </h1>
                      <h1 className="text-xxs text-foreground border-border border-r p-2 text-center font-bold">
                        {charge.potencia}
                      </h1>
                      <h1 className="text-xxs text-foreground border-border border-r p-2 text-center font-bold">
                        {charge.qtde * charge.potencia}
                      </h1>
                      <h1 className="text-xxs text-foreground border-border border-r p-2 text-center font-bold">
                        {charge.horasFuncionamento}
                      </h1>
                      <h1 className="text-xxs text-foreground p-2 text-center font-bold">
                        {charge.qtde * charge.potencia * charge.horasFuncionamento}
                      </h1>
                    </div>
                  ))}
                  <div className="border-border grid grid-cols-5 items-center border border-t-0 lg:grid-cols-6">
                    <p className="bg-primary/80 col-span-4 flex h-full items-center justify-center border-r border-white p-1 text-center text-xs font-bold text-white lg:col-span-5">
                      CONSUMO DIÁRIO TOTAL
                    </p>
                    <p className="text-foreground col-span-1 p-2 text-center text-xs font-bold">
                      {formatDecimalPlaces(
                        getChargesTotals(call.premissas.cargas).totalDailyConsumption,
                        0,
                        0,
                      )}{" "}
                      kWh
                    </p>
                  </div>
                  <div className="border-border grid grid-cols-5 items-center border border-t-0 lg:grid-cols-6">
                    <p className="bg-primary/80 col-span-4 flex h-full items-center justify-center border-r border-white p-1 text-center text-xs font-bold text-white lg:col-span-5">
                      POTÊNCIA TOTAL
                    </p>
                    <p className="text-foreground col-span-1 p-2 text-center text-xs font-bold">
                      {formatDecimalPlaces(getChargesTotals(call.premissas.cargas).totalPot, 2, 2)}{" "}
                      kWp
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="flex w-full flex-col">
                <h1 className="bg-primary/80 mt-4 w-full rounded-tl-md rounded-tr-md p-2 text-center font-bold text-white">
                  OBSERVAÇÕES
                </h1>
                <span className="font-raleway bg-primary/20 grow rounded-b p-4 text-center text-sm italic">
                  {call.observacoes ? (
                    <ul className="list-none text-center text-xs font-bold">
                      {call.observacoes.split("/ ").map((string, index) => (
                        <li key={index}>{string}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-foreground text-center italic">SEM OBSERVAÇÕES...</p>
                  )}
                </span>
              </div>

              <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">
                RESPONSÁVEL
              </h1>
              <div className="flex w-full flex-wrap justify-around gap-2">
                {renderResponsibles(call.responsavel?.apelido)}
              </div>
              <div className="flex w-full flex-col">
                <h1 className="bg-primary/80 mt-4 w-full rounded-tl-md rounded-tr-md p-2 text-center font-bold text-white">
                  ANOTAÇÕES
                </h1>
                <textarea
                  value={infoHolder.anotacoes}
                  readOnly={!editor}
                  onChange={(e) => handleChange("anotacoes", e.target.value)}
                  placeholder="Digite aqui as anotações do chamado"
                  className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 bg-primary/20 h-fit min-h-[150px] grow resize-none p-3 text-center text-sm outline-hidden placeholder:italic"
                />
              </div>
              <h1 className="bg-primary/80 mt-4 w-full rounded-tl-md rounded-tr-md p-2 text-center font-bold text-white">
                ARQUIVOS
              </h1>
              <div className="flex w-full flex-col items-center gap-2">
                {call.links && call.links.length > 0 ? (
                  call.links.map((link, index) => (
                    <div key={index} className="w-full lg:w-[70%]">
                      <CallFile info={link} />
                    </div>
                  ))
                ) : (
                  <p className="text-foreground py-2 text-sm italic">Sem arquivos anexados...</p>
                )}
              </div>
              {editor ? (
                infoHolder.dataEfetivacao ? (
                  <div className="text-center">
                    <button
                      onClick={() => handleReOpenCall()} // TODO
                      className="font-raleway mt-4 rounded-lg bg-yellow-400 p-3 font-bold hover:bg-[#f18701] hover:text-white"
                    >
                      REABRIR CHAMADO
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => handleCloseCall()} // TODO
                      className="font-raleway mt-4 rounded-lg bg-green-400 p-3 font-bold hover:bg-[#06d6a0] hover:text-white"
                    >
                      FINALIZAR CHAMADO
                    </button>
                  </div>
                )
              ) : (
                false
              )}
              {editor ? (
                <div className="mt-2 flex items-center justify-center">
                  <SaveButton
                    text={"SALVAR"}
                    icon={<FaSave />}
                    handleClick={() => handleSaveChanges()}
                  />{" "}
                  {/*TODO*/}
                </div>
              ) : null}
              {editor && call?._id ? (
                <div className="mt-6 flex w-full flex-col items-center gap-3 border-t border-red-200 pt-4">
                  <p className="max-w-[420px] text-center text-xs font-medium text-red-500">
                    Zona destrutiva. Exclua o chamado apenas quando tiver certeza de que ele não
                    deve mais existir no controle.
                  </p>
                  <button
                    onClick={() => setDeleteConfirmationOpen(true)}
                    className="font-raleway w-fit rounded-lg border border-red-500 px-4 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    EXCLUIR CHAMADO
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <LoadingPage />
          )}
        </div>
      </AnimatedModalWrapper>
      {deleteConfirmationOpen ? (
        <ResponsiveDialogDrawerViewOnly
          menuTitle="EXCLUIR CHAMADO DE PPS"
          menuDescription="Tem certeza que deseja excluir este chamado? Essa ação não pode ser desfeita."
          menuCancelButtonText="CANCELAR"
          closeMenu={() => setDeleteConfirmationOpen(false)}
          stateIsLoading={false}
          stateError={null}
          dialogVariant="sm"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-secondary text-primary w-fit rounded-lg px-3 py-1 text-sm font-semibold tracking-tight">
              #{call?._id || "---"}
            </div>
            <p className="self-center rounded-lg bg-red-200 px-3 py-2 text-center text-sm text-red-600">
              Ao confirmar, o chamado sera removido permanentemente da lista de PPS.
            </p>
            <LoadingButton
              variant="destructive"
              loading={deleteCallIsPending}
              onClick={() => handleDeleteCall()}
              className="self-center"
            >
              DESEJO EXCLUIR
            </LoadingButton>
          </div>
        </ResponsiveDialogDrawerViewOnly>
      ) : null}
    </>
  );
}

export default ModalCallPPS;
