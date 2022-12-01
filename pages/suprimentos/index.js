import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { statusLiberacao } from "../../utils/constants";
import ModalSuprimentos from "../../components/ModalSuprimentos";
import dayjs from "dayjs";
import dayjsBusinessDays from "dayjs-business-days";
function Suprimentos({ credentials, setCredentials, users }) {
  const router = useRouter();
  dayjs.extend(dayjsBusinessDays);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: [],
    deliveryStatus: [],
    liberacaoStatus: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/suprimentos", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/suprimentos").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
  }
  function handleUpdates(id) {
    getProjects(credentials);
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let filtered = filterProjects();
      let newArr = filtered.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function getBorderColor(diff) {
    console.log(diff);
    /*var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));*/
    if (diff > 5) {
      return "border-2 border-red-600";
    } else if (diff >= 4) {
      return "border-2 border-yellow-500";
    } else if (diff > 2) {
      return "border-2 border-blue-700";
    } else {
      return "border border-gray-200";
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Suprimentos") &&
        !storedCredentials.accessibleRoutes.includes("Marketing")
      ) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !credentials.accessibleRoutes.includes("Suprimentos") &&
          !credentials.accessibleRoutes.includes("Marketing")
        ) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  function filterProjects() {
    var newArr;
    if (filters.deliveryStatus.length > 0 && filters.paymentStatus.length > 0) {
      newArr = projects.filter(
        (project) =>
          filters.paymentStatus.includes(project.pagamento.status) &&
          filters.deliveryStatus.includes(project.compra.statusEntrega)
      );
    } else if (filters.paymentStatus.length > 0) {
      newArr = projects.filter((project) =>
        filters.paymentStatus.includes(project.pagamento.status)
      );
    } else if (filters.deliveryStatus.length > 0) {
      newArr = projects.filter((project) =>
        filters.deliveryStatus.includes(project.compra.statusEntrega)
      );
    }
    if (filters.liberacaoStatus.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.liberacaoStatus.includes(project.compra.statusLiberacao)
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let pot = filteredProjects[i].sistema.potPico
        ? filteredProjects[i].sistema.potPico
        : null;
      if (isNaN(pot)) {
        totalSum = totalSum;
      } else {
        totalSum = totalSum + pot;
      }
    }
    return totalSum.toFixed(2);
  }
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Number(diffInDays).toFixed(0);
  }
  /*console.log(
    dayjs("2022-11-25T22:00:00.000Z").businessDiff(
      dayjs("2022-11-21T03:00:00.000Z")
    )
  );*/
  return (
    <div className="p-6 grow">
      <div className="flex flex-col justify-between border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-raleway">
            Projetos no estágio de suprimentos
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
          {filteredProjects && (
            <p className="font-raleway font-bold text-[#fead61] mr-2">
              ({getListCumulativePeakPot()}kWp)
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <input
            className="outline-none p-1.5 w-[250px] h-[36px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <Select
            isMulti
            placeholder="STATUS DE LIBERAÇÃO"
            onChange={(e) =>
              setFilters({ ...filters, liberacaoStatus: e.map((x) => x.value) })
            }
            options={statusLiberacao.map((status) => {
              return { label: status.label, value: status.value };
            })}
          />
          <Select
            isMulti
            placeholder="STATUS ENTREGA"
            onChange={(e) =>
              setFilters({ ...filters, deliveryStatus: e.map((x) => x.value) })
            }
            options={[
              { value: "EM ROTA", label: "EM ROTA" },
              { value: "AGUARDANDO COMPRA", label: "AGUARDANDO COMPRA" },
              { value: "CANCELADO", label: "CANCELADO" },
              { value: undefined, label: "NÃO DEFINIDO" },
            ]}
          />
          <div className="hidden lg:flex gap-x-2">
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Depois de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.after &&
                  new Date(dateFilter.after).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    after: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Antes de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.before &&
                  new Date(dateFilter.before).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    before: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <Select
              isMulti={false}
              placeholder={"CAMPO DE FILTRO"}
              options={[
                { label: "DATA PAGAMENTO", value: "compra.dataPagamento" },
                {
                  label: "DATA MÁX P/ PAGAMENTO",
                  value: "compra.dataMaxPagamento",
                },
                {
                  label: "PREVISÃO DE ENTREGA",
                  value: "compra.previsaoEntrega",
                },
                { label: "NÃO DEFINIDO", value: null },
              ]}
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  field1: e.value != null ? e.value.split(".")[0] : null,
                  field2: e.value != null ? e.value.split(".")[1] : null,
                })
              }
            />
          </div>
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white h-[36px] hover:bg-[#15599a] font-bold rounded px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer ${
              project.compra.dataPedido == undefined
                ? getBorderColor(
                    dayjs(new Date()).businessDiff(
                      dayjs(project.compra.dataLiberacao)
                    )
                  )
                : "border border-gray-200"
            } p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <div className="flex flex-col items-start">
                <span className="text-xxs">INFORMAÇÕES</span>
                <p className="text-xxs font-bold text-gray-600 uppercase">
                  {project.compra.informacoes
                    ? project.compra.informacoes
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xxs">LIBERACÃO DE CRÉDITO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.compra.statusLiberacao
                    ? project.compra.statusLiberacao
                    : "-"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center mt-1">
              <div className="flex flex-col items-start">
                <span className="text-xxs">FORNECEDOR</span>
                <p className="text-xs text-yellow-500">
                  {project.compra.fornecedor ? project.compra.fornecedor : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xxs">PREVISÃO ENTREGA</span>
                {console.log(
                  project.qtde,
                  dayjs(project.compra.previsaoEntrega).diff(new Date(), "day")
                )}
                {dayjs(new Date()).isBefore(
                  dayjs(dayjs(project.compra.previsaoEntrega).add(22, "hour"))
                ) ? (
                  <p
                    className={`text-xs ${
                      dayjs(project.compra.previsaoEntrega).diff(
                        new Date(),
                        "day"
                      ) < 7
                        ? "text-red-500 font-bold"
                        : "text-green-500 font-bold"
                    } text-center`}
                  >
                    {project.compra.previsaoEntrega
                      ? dayjs(
                          new Date(project.compra.previsaoEntrega)
                        ).isValid()
                        ? dayjs(
                            dayjs(project.compra.previsaoEntrega).add(4, "hour")
                          ).format("DD/MM/YYYY")
                        : "-"
                      : "-"}
                  </p>
                ) : (
                  <p className="text-red-500 font-bold text-sm">PREV.VENCIDA</p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xxs">STATUS ENTREGA</span>
                <p className="text-xs text-gray-600">
                  {project.compra.statusEntrega
                    ? project.compra.statusEntrega
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center pt-1">
              <span className="text-xxs">FATURAMENTO</span>
              <p className="text-xs text-center text-gray-600 uppercase">
                {project.faturamento?.previsaoFaturamento
                  ? project.faturamento?.previsaoFaturamento
                  : "-"}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div>
                <span className="text-xxs">DESDE LIBERAÇÃO ATÉ PEDIDO</span>
                <p
                  className={`text-xs uppercase ${
                    project.compra.dataPedido ? "text-gray-600" : "text-red-500"
                  } text-center`}
                >
                  {project.compra.dataPedido
                    ? `${dayjs(
                        dayjs(project.compra.dataPedido).add(22, "hour")
                      ).businessDiff(dayjs(project.compra.dataLiberacao))} DIAS`
                    : `${dayjs(new Date()).businessDiff(
                        dayjs(project.compra.dataLiberacao)
                      )} DIAS`}
                </p>
              </div>
            </div>
            {project.compra.dataPagamento == undefined &&
            project.compra.dataMaxPagamento != null &&
            dayjs(new Date(project.compra.dataMaxPagamento)).isValid() ? (
              dayjs(project.compra.dataMaxPagamento).isAfter(dayjs()) ? (
                <p
                  className={`text-center text-sm ${
                    dayjs(project.compra.dataMaxPagamento).diff(
                      new Date(),
                      "days"
                    ) < 2
                      ? "text-red-500"
                      : "text-gray-600"
                  } italic`}
                >
                  DATA PAGAMENTO LIMITE EM:{" "}
                  {dayjs(project.compra.dataMaxPagamento).diff(
                    new Date(),
                    "day"
                  )}{" "}
                  DIA(S)
                </p>
              ) : (
                <p className="text-center text-sm text-red-500 italic font-bold">
                  PAGAMENTO ATRASADO
                </p>
              )
            ) : (
              false
            )}
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalSuprimentos
          users={users}
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("Suprimentos") &&
            credentials.regional == undefined
              ? true
              : false
          }
          ppsEditor={
            credentials.accessibleRoutes.includes("PPS") ? true : false
          }
          credentials={credentials}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Suprimentos;
