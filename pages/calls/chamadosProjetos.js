import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import ModalCallProjetos from "../../components/ModalCallProjetos";
import Select from "react-select";
import { projetistas, projetosSolicitations } from "../../utils/constants";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [stats, setStats] = useState({
    assinatura: {
      confeccionar: 0,
      paraAssinar: 0,
    },
    parecer: {
      solicitar: 0,
      aguardando: 0,
    },
    comissionamento: {
      total: 0,
      parcial: 0,
    },
    distribuicoes: 0,
    vistoria: {
      pendente: 0,
      aguardando: 0,
    },
  });
  const [chamadosAbertos, setChamadosAbertos] = useState([]);
  const [abertosFiltrados, setAbertosFiltrados] = useState([]);
  const [chamadosFechados, setChamadosFechados] = useState([]);
  const [fechadosFiltrados, setFechadosFiltrados] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const [abertosFilters, setAbertosFilters] = useState({
    responsavelFilter: [],
    statusChamadoFilter: [],
    tipoSolicitacaoFilter: [],
    procurarFilter: "",
  });
  const [fechadosFilter, setFechadosFilter] = useState({
    procurarFilter: "",
    tipoSolicitacaoFilter: [],
    responsavelFilter: [],
  });
  function getCalls() {
    axios.get("/api/calls/projetos/mainData").then((res) => {
      console.log(res.data);
      setStats({
        assinatura: res.data.assinatura,
        parecer: res.data.parecer,
        comissionamento: res.data.comissionamento,
        distribuicoes: res.data.chamadosAbertos.filter(
          (x) => x.tipoDoChamado == "DISTRIBUIÇÃO DE CRÉDITO"
        ).length,
        vistoria: res.data.vistoria,
      });
      setChamadosAbertos(res.data.chamadosAbertos);
      setAbertosFiltrados(res.data.chamadosAbertos);
      setChamadosFechados(res.data.chamadosFechados);
      setFechadosFiltrados(res.data.chamadosFechados);
    });
  }
  function handleOpenModal(call) {
    setModalIsOpen(true);
    setModalCall(call);
  }
  function filterChamadosAbertos() {
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
    if (abertosFilters.tipoSolicitacaoFilter.length > 0) {
      if (!newArr) newArr = chamadosAbertos;
      newArr = newArr.filter((call) =>
        abertosFilters.tipoSolicitacaoFilter.includes(call.tipoDoChamado)
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
  function filterChamadosFechados() {
    var newArr;
    if (fechadosFilter.responsavelFilter.length > 0) {
      if (!newArr) newArr = chamadosFechados;
      newArr = newArr.filter((call) =>
        fechadosFilter.responsavelFilter.includes(call.responsavel)
      );
    }
    if (fechadosFilter.tipoSolicitacaoFilter.length > 0) {
      if (!newArr) newArr = chamadosFechados;
      newArr = newArr.filter((call) =>
        fechadosFilter.tipoSolicitacaoFilter.includes(call.tipoDoChamado)
      );
    }
    if (fechadosFilter.procurarFilter.length > 0) {
      if (!newArr) newArr = chamadosFechados;
      newArr = newArr.filter((call) =>
        call.projeto
          .toUpperCase()
          .includes(fechadosFilter.procurarFilter.toUpperCase())
      );
    }
    if (!newArr) setFechadosFiltrados(chamadosFechados);
    else {
      setFechadosFiltrados(newArr);
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
  console.log(stats);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex items-center justify-around w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex items-center justify-around gap-x-2">
          <p>CHAMADOS DE PROJETOS</p>
        </div>
        <div
          onClick={getCalls}
          className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
        >
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
      </div>
      <div className="grid grid-rows-5 grid-cols-1  lg:grid-cols-5 lg:grid-rows-1 gap-3">
        <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">ASSINATURAS</h1>
          </div>
          <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
            CONFECCIONAR: {stats.assinatura && stats.assinatura.confeccionar}
          </p>
          <p className="text-center text-gray-600">
            PARA ASSINAR:{" "}
            <strong className="text-red-500">
              {stats.assinatura && stats.assinatura.paraAssinar}
            </strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">PARECER</h1>
          </div>
          <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
            SOLICITAR: {stats.parecer && stats.parecer.solicitar}
          </p>
          <p className="text-center text-gray-600">
            AGUARDANDO CONC.:{" "}
            <strong className="text-red-500">
              {stats.parecer && stats.parecer.aguardando}
            </strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">COMISSIONAMENTO</h1>
          </div>
          <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
            PROJETOS: {stats.comissionamento && stats.comissionamento.parcial}
          </p>
          <p className="text-center text-gray-600">
            TOTAL:{" "}
            <strong className="text-red-500">
              {stats.comissionamento && stats.comissionamento.total}
            </strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">CHAMADOS</h1>
          </div>
          <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
            DISTRIBUIÇÕES: {stats.distribuicoes && stats.distribuicoes}
          </p>
          <p className="text-center text-gray-600">
            TOTAL:{" "}
            <strong className="text-red-500">
              {chamadosAbertos && chamadosAbertos.length}
            </strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">VISTORIAS</h1>
          </div>
          <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
            PENDENTES: {stats.vistoria.pendente && stats.vistoria.pendente}
          </p>
          <p className="text-center text-gray-600">
            AGUARDANDO CONCESSIONÁRIA:{" "}
            <strong className="text-red-500">
              {stats.vistoria.aguardando && stats.vistoria.aguardando}
            </strong>
          </p>
        </div>
      </div>
      <div className="w-full border max-h-[750px] lg:max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <div className="flex flex-wrap w-full items-center justify-around">
            <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
              Chamados abertos ({abertosFiltrados.length})
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
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
                options={projetistas.map((projetista) => {
                  return { label: projetista.label, value: projetista.nome };
                })}
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
              <Select
                isMulti
                placeholder="TIPO DO CHAMADO"
                onChange={(e) =>
                  setAbertosFilters({
                    ...abertosFilters,
                    tipoSolicitacaoFilter: e.map((x) => x.value),
                  })
                }
                options={projetosSolicitations.map((solicitacao) => {
                  return {
                    label: solicitacao,
                    value: solicitacao,
                  };
                })}
              />
              <button
                onClick={filterChamadosAbertos}
                className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-1.5 items-center gap-x-2"
              >
                <p>Filtrar</p>
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="flex max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
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
      <div className="w-full border max-h-[750px] lg:max-h-[450px] border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col lg:flex-row w-full items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            CHAMADOS FECHADOS ({fechadosFiltrados.length})
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <input
              type="text"
              value={fechadosFilter.procurarFilter}
              onChange={(e) =>
                setFechadosFilter({
                  ...fechadosFilter,
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
                setFechadosFilter({
                  ...fechadosFilter,
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
              placeholder="TIPO DO CHAMADO"
              onChange={(e) =>
                setFechadosFilter({
                  ...fechadosFilter,
                  tipoSolicitacaoFilter: e.map((x) => x.value),
                })
              }
              options={projetosSolicitations.map((solicitacao) => {
                return {
                  label: solicitacao,
                  value: solicitacao,
                };
              })}
            />
            <button
              onClick={filterChamadosFechados}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-1.5 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        <div className="flex max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {fechadosFiltrados.map((call) => (
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
      <Link href="/publico/chamadosProjetos">
        <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Novo chamado</p>
        </div>
      </Link>
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
