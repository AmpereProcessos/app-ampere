import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import { HiPencilAlt } from "react-icons/hi";
import { TbLicenseOff } from "react-icons/tb";
import { BsGraphDown } from "react-icons/bs";
import { MdSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import BaixaPerformanceModal from "../../components/BaixaPerformanceModal";
function BaixaPerformance() {
  const { credentials } = useContext(AppContext);
  const router = useRouter();
  const [token, setToken] = useState("");

  const [badPerformers, setBadPerformers] = useState([]);
  const [monitoramentoBook, setMonitoramentoBook] = useState([]);
  const [filteredMonitoramentoBook, setFilteredMonitoramentoBook] = useState(
    []
  );

  const [filters, setFilters] = useState({
    searchFilter: "",
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
        let { data } = await axios.post(
          "https://api-v2.solarview.com.br/unitList?page=1",
          {
            pageSize: 942,
          },
          {
            headers: {
              "solarview-tokenUniversal": token,
            },
          }
        );
        var arr = [];
        data.data.map((user) => {
          var parsed = JSON.parse(user.consumerUnit30dPerformance);
          if (parsed != null && typeof parsed == "object") {
            let dados30d = JSON.parse(user.consumerUnit30dPerformance);
            let reg = dados30d[4];
            let nomeUsina = user.consumerUnitName;
            if (Number(reg) <= 80) {
              arr.push({ nomeUsina: nomeUsina, performance: Number(reg) });
            }
          }
        });
        setBadPerformers(arr);
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
  async function getMonitoramentoBook() {
    try {
      let { data } = await axios.get("/api/o&m/monitoramento");
      setMonitoramentoBook(data);
      setFilteredMonitoramentoBook(data);
    } catch (error) {
      alert(error.response.data);
    }
  }
  function getToBeAnalized(arrayOfBadPerformers) {
    let toAnalize = arrayOfBadPerformers.filter((item) => {
      let holder = monitoramentoBook.find(
        (cliente) =>
          cliente.nomeUsina == item.nome && cliente.status != "RESOLVIDO"
      );
      console.log(holder);
      return !holder;
    });
    console.log(toAnalize);
    setBadPerformers(toAnalize);
  }
  function handleOpenModal(item) {
    setModalItem(item);
    setModalIsOpen(true);
  }
  function handleSearchFilter(value) {
    setFilters({ ...filters, searchFilter: value });
    if (value != "" || " ") {
      let filtered = monitoramentoBook.filter((item) =>
        item.nomeUsina.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredMonitoramentoBook(filtered);
    } else {
      setFilteredMonitoramentoBook(monitoramentoBook);
    }
  }
  useEffect(() => {
    if (!credentials.accessibleRoutes.includes("O&M")) {
      router.push("/");
    } else {
      getMonitoramentoBook();
    }
  }, []);
  console.log(badPerformers);
  return (
    <div className="p-6 grow flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <h1 className="font-bold text-[#15599a] text-xl">
          IDENTIFICAÇÃO DE BAIXA PERFORMANCE{" "}
          {badPerformers.length > 0 && `(${badPerformers.length})`}
        </h1>
      </div>
      <div className="flex justify-center gap-2 items-center mt-2">
        <TextInput
          editable={true}
          label={"Token Solar View"}
          placeholder="Preencha aqui o token SolarView"
          value={token}
          handleChange={(value) => setToken(value)}
        />
        <button
          onClick={getBadPerformers}
          className="p-2 rounded bg-[#15599a] text-xs text-white font-bold hover:bg-[#fead61] hover:text-black transition duration-300 ease-in-out hover:scale-105"
        >
          BUSCAR
        </button>
      </div>
      <div className="flex flex-col items-center mt-4">
        {inProgress && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        <h1 className="text-center font-bold text-xl text-[#fead41]">
          {badPerformers.length > 0
            ? `USINAS A ANALISAR (${badPerformers.length})`
            : "SEM USINAS A ANALISAR..."}
        </h1>
        <div className="flex flex-wrap justify-between gap-2">
          {badPerformers.map((usina, index) => (
            <div
              key={index}
              className="flex items-center gap-2 justify-between w-[300px] h-[60px] rounded-md border border-gray-200 shadow-md"
            >
              <div className="flex items-center justify-center bg-red-400 text-white font-bold h-full w-[50px] text-xs rounded-tl-md rounded-bl-md">
                {usina.performance.toFixed(2).replace(".", ",")} %
              </div>
              <p className="text-gray-700 text-center text-xs">
                {usina.nomeUsina}
              </p>
              <button
                onClick={() => handleOpenModal(usina)}
                className="bg-[#fead61] flex items-center justify-center h-full text-[#15599a] hover:bg-[#15599a] w-[30px] hover:text-white rounded-tr-md rounded-br-md"
              >
                <HiPencilAlt />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col mt-6 w-full">
          <h1 className="text-center font-bold text-[#fead41] text-xl">
            ANÁLISES EM ABERTO ({monitoramentoBook.length})
          </h1>
          <div className="flex items-center justify-center gap-2 my-2">
            <input
              type={"text"}
              className={
                "outline-none h-[36px] w-[350px] border border-gray-200 text-center text-xs p-2 rounded-md"
              }
              placeholder={"DIGITE O NOME DA USINA..."}
              onChange={(e) => handleSearchFilter(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 w-full">
            <div className="bg-[#15599a] text-white text-center font-bold border-r border-white">
              STATUS
            </div>
            <div className="bg-[#15599a] text-white text-center font-bold border-r border-white">
              CÓDIGO DO CLIENTE
            </div>
            <div className="bg-[#15599a] text-white text-center font-bold col-span-2 border-r border-white">
              NOME DA USINA
            </div>
            <div className="bg-[#15599a] text-white text-center font-bold col-span-2">
              PROBLEMA
            </div>
          </div>
          {filteredMonitoramentoBook.map((item, index) => (
            <div
              key={index}
              onClick={() => handleOpenModal({ ...item, created: true })}
              className="grid bg-slate-50 hover:bg-blue-100 grid-cols-6 w-full border-b border-[#15599a] cursor-pointer"
            >
              <div className="text-center font-bold border-x border-[#15599a] p-1">
                <h1 className={`${statusStyles[item.status].textColor}`}>
                  {item.status}
                </h1>
              </div>
              <div className="text-gray-700 text-center font-bold border-r border-[#15599a] p-1">
                #{item.codProjeto}
              </div>
              <div className="text-gray-700 text-center font-bold col-span-2 border-r border-[#15599a] p-1">
                {item.nomeUsina}
              </div>
              <div className="flex items-center justify-center gap-4 col-span-2 border-r border-[#15599a] p-1">
                <p className="text-gray-700 text-center font-bold">
                  {item.problema}
                </p>
                {item.problema == "PROBLEMA COM CONEXÃO" && (
                  <MdSignalWifiStatusbarConnectedNoInternet4
                    style={{ color: "#FF9D00", fontSize: "20px" }}
                  />
                )}
                {item.problema == "PROBLEMA COM GERAÇÃO" && (
                  <BsGraphDown style={{ color: "#FF9D00", fontSize: "20px" }} />
                )}
                {item.problema == "PLANO EXPIRADO" && (
                  <TbLicenseOff
                    style={{ color: "#FF9D00", fontSize: "20px" }}
                  />
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
