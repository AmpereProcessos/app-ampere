import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import TextInput from "../../components/TextInput";

import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { BsGraphDown } from "react-icons/bs";
import { HiPencilAlt } from "react-icons/hi";
import { MdSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import { TbLicenseOff } from "react-icons/tb";
import BaixaPerformanceModal from "../../components/BaixaPerformanceModal";
import SelectInput from "../../components/SelectInput";
import { useSession } from "../../components/providers/SessionProvider";
import LoadingPage from "../../components/utils/LoadingPage";

function getProblemsNotBooked(badPerformers, monitoramentoBook) {
  const nomeUsinaSet = new Set(monitoramentoBook.map((item) => item.nomeUsina));

  const filteredArr = badPerformers.filter((item) => !nomeUsinaSet.has(item.nomeUsina));
  return filteredArr;
}
function BaixaPerformance() {
  const router = useRouter();
  const { session, status } = useSession();

  const isAuthorized = session?.user.permissoes.suporte.visualizar;
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  if (!isAuthorized) return <UnauthorizedPage />;

  const [token, setToken] = useState("");
  const [authorization, setAuthorization] = useState("");

  const [badPerformers, setBadPerformers] = useState([]);
  const [monitoramentoBook, setMonitoramentoBook] = useState([]);
  const [filteredMonitoramentoBook, setFilteredMonitoramentoBook] = useState([]);

  const [filters, setFilters] = useState({
    searchFilter: "",
    status: "TODOS",
  });
  const [inProgress, setInProgress] = useState(false);
  const statusStyles = {
    PENDENTE: {
      textColor: "text-red-400",
      borderColor: "border-red-400",
    },
    "EM ANDAMENTO": {
      textColor: "text-blue-300",
      borderColor: "border-blue-300",
    },
    EXECUTADO: {
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500",
    },
    RESOLVIDO: {
      textColor: "text-green-400",
      borderColor: "border-green-400",
    },
  };
  const [modalItem, setModalItem] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  async function getBadPerformers() {
    if (token.trim().length > 15) {
      setInProgress(true);
      try {
        const { data } = await axios.post(
          "https://api-v2.solarview.com.br/unitList?page=1",
          {
            pageSize: 942,
          },
          {
            headers: {
              "solarview-tokenUniversal": token,
            },
          },
        );
        const arr = [];
        data.data.map((user) => {
          const parsed = JSON.parse(user.consumerUnit30dPerformance);
          if (parsed !== null && typeof parsed === "object") {
            const dados30d = JSON.parse(user.consumerUnit30dPerformance);
            const reg = dados30d[4];
            const nomeUsina = user.consumerUnitName;
            if (Number(reg) <= 80) {
              arr.push({ nomeUsina: nomeUsina, performance: Number(reg) });
            }
          }
        });
        const filteredArr = getProblemsNotBooked(arr, monitoramentoBook);
        setBadPerformers(filteredArr);
        setInProgress(false);
      } catch (error) {
        alert("Erro na requisição.");
        setInProgress(false);
      }
    } else {
      setInProgress(false);
      alert("Por favor, preencha um token válido.");
    }
  }
  async function getDeyeBadPerfomers() {
    if (authorization.trim().length > 700) {
      setInProgress(true);
      try {
        const { data } = await axios.get(
          `/api/o&m/deyeBadPerformers?authorization=${authorization}`,
        );
        const arr = data.data;
        let formattedArr = arr.map((item) => {
          const station = item.station;
          return {
            nomeUsina: station.name,
            performance: station.generationCapacity ? station.generationCapacity * 100 : 0,
          };
        });
        formattedArr = formattedArr.filter((item) => item.performance && item.performance < 55);
        console.log(formattedArr);
        setBadPerformers(formattedArr);
        setInProgress(false);
      } catch (error) {
        console.log("ERRO", error);
        setInProgress(false);
        alert("Erro na requisição.");
      }
    } else {
      setInProgress(false);
      alert("Por favor, preencha uma autorização válida.");
    }
  }
  async function getMonitoramentoBook() {
    try {
      const { data } = await axios.get("/api/o&m/monitoramento");
      setMonitoramentoBook(data);
      setFilteredMonitoramentoBook(data);
    } catch (error) {
      alert(error.response.data);
    }
  }

  function handleOpenModal(item) {
    setModalItem(item);
    setModalIsOpen(true);
  }
  function handleSearchFilter(value) {
    setFilters((prev) => ({ ...prev, searchFilter: value }));
    if (value != "" || " ") {
      const filtered = monitoramentoBook.filter((item) =>
        item.nomeUsina.toUpperCase().includes(value.toUpperCase()),
      );
      setFilteredMonitoramentoBook(filtered);
      return filtered;
    } else {
      setFilteredMonitoramentoBook(monitoramentoBook);
      return monitoramentoBook;
    }
  }
  function handleFilterByStatus(value) {
    var filtered = handleSearchFilter(filters.searchFilter);
    if (value != "TODOS") {
      setFilters((prev) => ({ ...prev, status: value }));
      filtered = filtered.filter((x) => x.status == value);
      setFilteredMonitoramentoBook(filtered);
    } else {
      setFilteredMonitoramentoBook(filtered);
    }
  }

  return (
    <div className="flex grow flex-col p-6">
      <div className="border-border border-b p-2">
        <h1 className="text-xl font-bold text-[#15599a]">
          IDENTIFICAÇÃO DE BAIXA PERFORMANCE{" "}
          {badPerformers.length > 0 && `(${badPerformers.length})`}
        </h1>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="mt-2 flex items-center justify-center gap-2">
          <TextInput
            editable={true}
            label={"Token Solar View"}
            placeholder="Preencha aqui o token SolarView"
            value={token}
            handleChange={(value) => setToken(value)}
          />
          <button
            onClick={getBadPerformers}
            className="rounded bg-[#15599a] p-2 text-xs font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#fead61] hover:text-black"
          >
            BUSCAR
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <TextInput
            editable={true}
            label={"Authorization Deye"}
            placeholder="Preencha aqui a authorization da Deye"
            value={authorization}
            handleChange={(value) => setAuthorization(value)}
          />
          <button
            onClick={getDeyeBadPerfomers}
            className="rounded bg-[#15599a] p-2 text-xs font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#fead61] hover:text-black"
          >
            BUSCAR
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        {inProgress && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="dark:text-foreground mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <h1 className="text-center text-xl font-bold text-[#fead41]">
          {badPerformers.length > 0
            ? `USINAS A ANALISAR (${badPerformers.length})`
            : "SEM USINAS A ANALISAR..."}
        </h1>
        <div className="flex flex-wrap justify-between gap-2">
          {badPerformers.map((usina, index) => (
            <div
              key={index}
              className="border-border flex h-[60px] w-[300px] items-center justify-between gap-2 rounded-md border shadow-md"
            >
              <div className="flex h-full w-[50px] items-center justify-center rounded-tl-md rounded-bl-md bg-red-400 text-xs font-bold text-white">
                {usina.performance.toFixed(2).replace(".", ",")} %
              </div>
              <p className="text-foreground text-center text-xs">{usina.nomeUsina}</p>
              <button
                onClick={() => handleOpenModal(usina)}
                className="flex h-full w-[30px] items-center justify-center rounded-tr-md rounded-br-md bg-[#fead61] text-[#15599a] hover:bg-[#15599a] hover:text-white"
              >
                <HiPencilAlt />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex w-full flex-col">
          <h1 className="text-center text-xl font-bold text-[#fead41]">
            ANÁLISES EM ABERTO ({monitoramentoBook.length})
          </h1>
          <div className="my-2 flex items-center justify-center gap-2">
            <SelectInput
              label={"STATUS"}
              value={filters.status}
              editable={true}
              handleChange={(value) => handleFilterByStatus(value)}
              options={[
                { label: "PENDENTE", value: "PENDENTE" },
                { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
                { label: "EXECUTADO", value: "EXECUTADO" },
                { label: "TODOS", value: "TODOS" },
              ]}
            />
            <input
              type={"text"}
              className={
                "border-border h-[36px] w-[350px] rounded-md border p-2 text-center text-xs outline-hidden"
              }
              placeholder={"DIGITE O NOME DA USINA..."}
              onChange={(e) => handleSearchFilter(e.target.value)}
            />
          </div>
          <div className="grid w-full grid-cols-6">
            <div className="border-r border-white bg-[#15599a] text-center font-bold text-white">
              STATUS
            </div>
            <div className="border-r border-white bg-[#15599a] text-center font-bold text-white">
              CÓDIGO DO CLIENTE
            </div>
            <div className="col-span-2 border-r border-white bg-[#15599a] text-center font-bold text-white">
              NOME DA USINA
            </div>
            <div className="col-span-2 bg-[#15599a] text-center font-bold text-white">PROBLEMA</div>
          </div>
          {filteredMonitoramentoBook.map((item, index) => (
            <div
              key={index}
              onClick={() => handleOpenModal({ ...item, created: true })}
              className="dark:hover:bg-primary/10 grid w-full cursor-pointer grid-cols-6 border-b border-[#15599a] bg-slate-50 hover:bg-blue-100"
            >
              <div className="border-x border-[#15599a] p-1 text-center font-bold">
                <h1 className={`${statusStyles[item.status].textColor}`}>{item.status}</h1>
              </div>
              <div className="text-foreground border-r border-[#15599a] p-1 text-center font-bold">
                #{item.codProjeto}
              </div>
              <div className="text-foreground col-span-2 border-r border-[#15599a] p-1 text-center font-bold">
                {item.nomeUsina}
              </div>
              <div className="col-span-2 flex items-center justify-center gap-4 border-r border-[#15599a] p-1">
                <p className="text-foreground text-center font-bold">{item.problema}</p>
                {item.problema == "PROBLEMA COM CONEXÃO" && (
                  <MdSignalWifiStatusbarConnectedNoInternet4
                    style={{ color: "#FF9D00", fontSize: "20px" }}
                  />
                )}
                {item.problema == "PROBLEMA COM GERAÇÃO" && (
                  <BsGraphDown style={{ color: "#FF9D00", fontSize: "20px" }} />
                )}
                {item.problema == "PLANO EXPIRADO" && (
                  <TbLicenseOff style={{ color: "#FF9D00", fontSize: "20px" }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalIsOpen && (
        <BaixaPerformanceModal
          info={modalItem}
          setModalIsOpen={setModalIsOpen}
          handleUpdates={getMonitoramentoBook}
        />
      )}
    </div>
  );
}

export default BaixaPerformance;
