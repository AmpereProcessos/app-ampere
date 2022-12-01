import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PosVendaCard from "../../components/PosVendaCard";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
function Posvenda({ credentials, setCredentials }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    assinatura: {
      confeccionar: 0,
      paraAssinar: 0,
    },
  });
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    noContactFilter: false,
    cidadeFilter: [],
    vendedorFilter: [],
    contratoFilter: [],
    assinFaltando: false,
    jornadaEmAberto: false,
    numModulos: null,
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [cardMode, setCardMode] = useState(true);
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
  }
  function getProjects() {
    axios.get("/api/projects/posvenda").then((res) => {
      setStats({
        assinatura: res.data.assinatura,
      });
      setProjects(res.data.projetos);
      setFilteredProjects(res.data.projetos);
    });
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
  function filterByNoRecentContact(state) {
    setFilters({ ...filters, noContactFilter: state });
    if (state == true) {
      let newArr = projects.filter(
        (project) =>
          project.jornada?.dataUltimoContato == undefined ||
          getDateDiff(new Date(), new Date(project.jornada.dataUltimoContato)) >
            7
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function filterProjects() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.contratoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.contratoFilter.includes(call.contrato.status)
      );
    }
    if (filters.numModulos > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) => Number(call.sistema.qtdeModulos) == Number(filters.numModulos)
      );
    }
    if (filters.assinFaltando) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          (project.projeto.dataAssDocumentacao == undefined ||
            project.projeto.dataAssDocumentacao == null ||
            project.projeto.dataAssDocumentacao == "-") &&
          (project.compra.statusLiberacao == "PAGO" ||
            project.projeto.iniciar == "SIM") &&
          project.projeto.projetoConcluido != "SIM"
      );
    }
    if (filters.jornadaEmAberto) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call.jornada.jornadaConcluida == false ||
          call.jornada.jornadaConcluida == undefined ||
          call.jornada.jornadaConcluida == null
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      console.log(newArr);
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
      console.log(newArr);
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  function ordenate() {
    let arr = filteredProjects.filter(
      (project) =>
        project.jornada?.dataUltimoContato != null ||
        project.jornada?.dataUltimoContato != undefined
    );
    let nulls = filteredProjects.filter(
      (project) =>
        project.jornada?.dataUltimoContato == null ||
        project.jornada?.dataUltimoContato == undefined
    );
    arr = arr.sort(
      (a, b) =>
        new Date(a.jornada?.dataUltimoContato).getTime() -
        new Date(b.jornada?.dataUltimoContato).getTime()
    );
    setFilteredProjects([...arr, ...nulls]);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Marketing") &&
        !storedCredentials.accessibleRoutes.includes("Pós-Venda")
      ) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !credentials.accessibleRoutes.includes("Marketing") &&
          !credentials.accessibleRoutes.includes("Pós-Venda")
        ) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col gap-y-2 items-center justify-center border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos em jornada
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
        </div>
        <div className="flex items-center w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
          <div className="flex items-center justify-between px-12 w-full">
            <p className="font-bold text-[#15599a]">
              DOCUMENTAÇÕES A CONFECCIONAR: {stats.assinatura.confeccionar}
            </p>
            <p className="font-bold text-[#15599a]">
              DOCUMENTAÇÕES PARA ASSINAR: {stats.assinatura.paraAssinar}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <button
            onClick={() => setCardMode(!cardMode)}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            {cardMode ? "MODO CARD" : "MODO LISTA"}
          </button>
          <button
            onClick={() => filterByNoRecentContact(!filters.noContactFilter)}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            SEM CONTATO RECENTE
          </button>
          <button
            onClick={ordenate}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            ORDENAR
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <Select
            isMulti
            placeholder="CIDADE"
            onChange={(e) =>
              setFilters({
                ...filters,
                cidadeFilter: e.map((x) => x.value),
              })
            }
            options={cidadesAtendidas.map((cidade) => {
              return {
                label: cidade,
                value: cidade,
              };
            })}
          />
          <Select
            isMulti
            placeholder="VENDEDOR"
            onChange={(e) =>
              setFilters({
                ...filters,
                vendedorFilter: e.map((x) => x.value),
              })
            }
            options={vendedores.map((vendedor) => {
              return {
                label: vendedor.nome,
                value: vendedor.nome,
              };
            })}
          />
          <Select
            isMulti
            className="hidden lg:block"
            placeholder="STATUS CONTRATO"
            onChange={(e) =>
              setFilters({
                ...filters,
                contratoFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "AGUARDANDO SOLICITAÇÃO",
                label: "AGUARDANDO SOLICITAÇÃO",
              },
              {
                value: "NÃO ASSINADO",
                label: "NÃO ASSINADO",
              },
              {
                value: "ASSINADO",
                label: "ASSINADO",
              },
            ]}
          />
          <input
            type="number"
            placeholder="NºModulos"
            className={
              "outline-none p-1.5 text-center rounded border border-gray-200 placeholder:italic"
            }
            value={filters.numModulos}
            onChange={(e) =>
              setFilters({ ...filters, numModulos: Number(e.target.value) })
            }
          />
          <div
            onClick={() =>
              setFilters({
                ...filters,
                jornadaEmAberto: !filters.jornadaEmAberto,
              })
            }
            className={`${
              filters.jornadaEmAberto ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            JORNADA NÃO CONCLUIDA
          </div>
          <input
            className="outline-none p-1.5 w-[300px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <div
            onClick={() =>
              setFilters({ ...filters, assinFaltando: !filters.assinFaltando })
            }
            className={`${
              filters.assinFaltando ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            ASSINATURA PENDENTE
          </div>
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
                { label: "SAÍDA DE OBRA", value: "obra.saida" },
                { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                {
                  label: "DATA ASS.CONTRATO",
                  value: "contrato.dataAssinatura",
                },
                {
                  label: "DATA LIB.DOCUMENTAÇÃO",
                  value: "projeto.dataLiberacaoDocumentacao",
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
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project, index) => (
          <PosVendaCard
            getUpdates={getProjects}
            editor={
              credentials?.accessibleRoutes.includes("Pós-Venda") &&
              credentials.visualizacao == undefined
                ? true
                : false
            }
            key={project._id}
            project={project}
            cardMode={cardMode}
          />
        ))}
      </div>
    </div>
  );
}

export default Posvenda;
