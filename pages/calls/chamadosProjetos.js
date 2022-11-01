import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import ModalCallProjetos from "../../components/ModalCallProjetos";
import Select from "react-select";
const statusStyles = {
  "AGUARDANDO CONCESSIONÁRIA": {
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  FINALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ChamadosProjetos({ credentials, setCredentials }) {
  const [chamadosAbertos, setChamadosAbertos] = useState([]);
  const [abertosFiltrados, setAbertosFiltrados] = useState([]);
  const [chamadosFechados, setChamadosFechados] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const [abertosFilters, setAbertosFilters] = useState({
    responsavelFilter: [],
    statusChamadoFilter: [],
    procurarFilter: "",
  });
  function getCalls() {
    axios.get("/api/calls/projetos/mainData").then((res) => {
      setChamadosAbertos(res.data.chamadosAbertos);
      setAbertosFiltrados(res.data.chamadosAbertos);
      setChamadosFechados(res.data.chamadosFechados);
    });
  }
  function handleOpenModal(call) {
    setModalIsOpen(true);
    setModalCall(call);
  }
  function filterCalls() {
    var newArr;
    if (abertosFilters.responsavelFilter.length > 0) {
      if (!newArr) newArr = chamadosAbertos;
      newArr = newArr.filter((call) =>
        abertosFilters.responsavelFilter.includes(call.responsavel)
      );
    }
    if (abertosFilters.statusChamadoFilter.length > 0) {
      if (!newArr) newArr = chamadosAbertos;
      newArr = newArr.filter((call) =>
        abertosFilters.statusChamadoFilter.includes(call.status)
      );
    }
    if (abertosFilters.procurarFilter.length > 0) {
      if (!newArr) newArr = chamadosAbertos;
      newArr = newArr.filter((call) =>
        call.projeto
          .toUpperCase()
          .includes(abertosFilters.procurarFilter.toUpperCase())
      );
    }
    if (!newArr) setAbertosFiltrados(chamadosAbertos);
    else {
      setAbertosFiltrados(newArr);
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Projetos")) {
        router.push("/");
      } else {
        getCalls();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Projetos")) {
          router.push("/");
        } else {
          getCalls();
        }
      }
    }
  }, []);
  console.log(abertosFilters);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex items-center justify-around w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex items-center justify-around gap-x-2">
          <p>CHAMADOS ABERTOS: ({chamadosAbertos.length})</p>
        </div>
        <div className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg">
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
      </div>
      <div className="w-full border max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <div className="flex w-full items-center justify-around">
            <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
              Chamados abertos ({abertosFiltrados.length})
            </h1>
            <div className="flex items-center gap-x-2">
              <input
                type="text"
                value={abertosFilters.procurarFilter}
                onChange={(e) =>
                  setAbertosFilters({
                    ...abertosFilters,
                    procurarFilter: e.target.value,
                  })
                }
                placeholder={"Digite o nome do projeto..."}
                className="outline-none h-[37px] text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md"
              />
              <Select
                isMulti
                placeholder="RESPONSÁVEL"
                onChange={(e) =>
                  setAbertosFilters({
                    ...abertosFilters,
                    responsavelFilter: e.map((x) => x.value),
                  })
                }
                options={[
                  {
                    value: "ALINE APARECIDA RODRIGUES CARVALHO",
                    label: "ALINE APARECIDA",
                  },
                  {
                    value: "ANDRIELLY GARCIA DOS SANTOS MARQUES",
                    label: "ANDRIELLY GARCIA",
                  },
                  {
                    value: "GLENDA ELIAS NASCIMENTO SANTOS",
                    label: "GLENDA ELIAS",
                  },
                  {
                    value: "POLLIANA CRISTINA DE REZENDE",
                    label: "POLLIANA CRISTINA",
                  },
                  {
                    value: "TULIO HENRIQUE SILVA MEDEIROS",
                    label: "TULIO HENRIQUE",
                  },
                ]}
              />
              <Select
                isMulti
                placeholder="STATUS DO CHAMADO"
                onChange={(e) =>
                  setAbertosFilters({
                    ...abertosFilters,
                    statusChamadoFilter: e.map((x) => x.value),
                  })
                }
                options={[
                  {
                    value: "AGUARDANDO CONCESSIONÁRIA",
                    label: "AGUARDANDO CONCESSIONÁRIA",
                  },
                  {
                    value: "EM ANDAMENTO",
                    label: "EM ANDAMENTO",
                  },
                  {
                    value: undefined,
                    label: "NÃO DEFINIDO",
                  },
                ]}
              />
              <button
                onClick={filterCalls}
                className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-1.5 items-center gap-x-2"
              >
                <p>Filtrar</p>
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {abertosFiltrados.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="grid grid-cols-5 justify-between items-center w-full">
                <h1 className="col-span-3 uppercase text-sm">
                  {call.projeto && call.projeto}
                </h1>
                {call.status && (
                  <p
                    className={`col-span-2 text-xs text-center font-bold border p-1 rounded-lg ${
                      call.status ? statusStyles[call.status].textColor : ""
                    } ${
                      call.status ? statusStyles[call.status].borderColor : ""
                    }`}
                  >
                    {call.status}
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">Responsável:</p>
                <p className="text-xs text-gray-500">{call.responsavel}</p>
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">
                  Tipo de chamado:
                </p>
                <p className="text-xs text-gray-500">{call.tipoDoChamado}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 gap-y-2 lg:gap-y-0">
          <h1 className="col-span-1 text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            CHAMADOS FINALIZADOS
          </h1>
        </div>
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {chamadosFechados.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="grid grid-cols-3 gap-x-2 items-center w-full">
                <h1 className="uppercase text-sm col-span-2">
                  {call.projeto && call.projeto}
                </h1>
                <p
                  className={`text-xs font-bold border p-1 col-span-1 rounded-lg ${
                    statusStyles[call.status].textColor
                  } ${statusStyles[call.status].borderColor}`}
                >
                  {call.status}
                </p>
              </div>
              <div className="grid grid-cols-2 mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">Responsável:</p>
                <p className="text-xs text-gray-500 text-center">
                  {call.responsavel}
                </p>
              </div>
              <div className="grid grid-cols-2 mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">
                  Tipo de chamado:
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {call.tipoDoChamado}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalIsOpen && (
        <ModalCallProjetos
          credentials={credentials}
          setModalIsOpen={setModalIsOpen}
          info={modalCall}
          getCalls={getCalls}
        />
      )}
    </div>
  );
}

export default ChamadosProjetos;
