import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalObras from "../../components/ModalObras";
import {
  cidadesAtendidas,
  equipesTecnicas,
  statusLiberacao,
} from "../../utils/constants";
import dayjs from "dayjs";
function Obras({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    obraStatusFilter: [],
    entregaStatusFilter: [],
    acFilter: [],
    acStatusFilter: [],
    epFilter: [],
    epStatusFilter: [],
    cidadeFilter: [],
    tipoDaTelhaFilter: "",
    obsPendente: false,
    osPendente: false,
    foraDeItba: false,
    numModulos: null,
    equipResp: [],
    liberacaoStatus: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/obras", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/obras").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
  }
  function handleUpdates(id) {
    axios
      .get(`/api/projects/fetchDoc/${id}`)
      .then((res) => setModalProject(res.data[0]));
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let filtered = filterProjects();
      console.log(filtered);
      let newArr = filtered.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function handleTipoDaTelhaFilter(value) {
    setFilters({ ...filters, tipoDaTelhaFilter: value });
    if (value != "" || " ") {
      let filtered = filterProjects();
      console.log(filtered);
      let newArr = filtered.filter(
        (call) =>
          call.visitaTecnica.tipoDaTelha &&
          call.visitaTecnica?.tipoDaTelha
            .toUpperCase()
            .includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function filterProjects() {
    var newArr;
    if (
      filters.obraStatusFilter.length > 0 &&
      filters.entregaStatusFilter.length > 0
    ) {
      newArr = projects.filter(
        (project) =>
          filters.entregaStatusFilter.includes(project.compra.statusEntrega) &&
          filters.obraStatusFilter.includes(project.obra.statusDaObra)
      );
    } else if (filters.entregaStatusFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.entregaStatusFilter.includes(project.compra.statusEntrega)
      );
    } else if (filters.obraStatusFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.obraStatusFilter.includes(project.obra.statusDaObra)
      );
    }
    if (filters.acFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.acFilter.includes(call.projeto.aumentoDeCarga)
      );
    }
    if (filters.acStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.acStatusFilter.includes(call.projeto.acStatus)
      );
    }
    if (filters.epFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.epFilter.includes(call.estruturaPersonalizada.aplicavel)
      );
    }
    if (filters.epStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.epStatusFilter.includes(call.estruturaPersonalizada.status)
      );
    }
    if (filters.liberacaoStatus.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.liberacaoStatus.includes(call.compra.statusLiberacao)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.equipResp.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.equipResp.includes(call.obra?.equipeResp)
      );
    }
    if (filters.numModulos > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) => Number(call.sistema.qtdeModulos) == Number(filters.numModulos)
      );
    }
    if (filters.obsPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (obj) =>
          obj.obra.observacoes == undefined || obj.obra.observacoes?.trim() < 10
      );
    }
    if (filters.osPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (obj) =>
          obj.ordensDeServico == undefined || obj.ordensDeServico?.length == 0
      );
    }
    if (filters.foraDeItba) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((obj) => obj.cidade != "ITUIUTABA");
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
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Obras") &&
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
          !credentials.accessibleRoutes.includes("Obras") &&
          !credentials.accessibleRoutes.includes("Marketing")
        ) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  function getBorderColorByParecer(date1, date2, statusObra) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (statusObra == "CASA EM CONSTRUÇÃO") {
      return "border-2 border-yellow-500";
    } else if (diffDays > 110) {
      return "border-2 border-red-600";
    } else if (diffDays > 100) {
      return "border-2 border-blue-500";
    } else if (diffDays > 90) {
      return "border-2 border-green-500";
    } else {
      return "border border-gray-200";
    }
  }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
            Projetos no estágio de obras
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
          {filteredProjects && (
            <p className="font-raleway font-bold text-[#fead61]">
              ({getListCumulativePeakPot()}kWp)
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-y-2 gap-x-2">
          <Select
            isMulti
            placeholder="ESTRUTURA PERSONALIZADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                epFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "SIM",
                label: "SIM",
              },
              {
                value: "NÃO",
                label: "NÃO",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS EST. PERSONALIZADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                epStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "PRONTA",
                label: "PRONTA",
              },
              {
                value: "PENDÊNCIA",
                label: "PENDÊNCIA",
              },
              {
                value: "N/A",
                label: "N/A",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="AUMENTO DE CARGA"
            onChange={(e) =>
              setFilters({
                ...filters,
                acFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "SIM",
                label: "SIM",
              },
              {
                value: "NÃO",
                label: "NÃO",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="A.C STATUS"
            onChange={(e) =>
              setFilters({
                ...filters,
                acStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "PENDÊNCIA",
                label: "PENDÊNCIA",
              },
              {
                value: "REALIZADO",
                label: "REALIZADO",
              },
              {
                value: "N/A",
                label: "N/A",
              },
              {
                value: "SOLICITADO COM G.D",
                label: "SOLICITADO COM G.D",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DA OBRA"
            onChange={(e) =>
              setFilters({
                ...filters,
                obraStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "EM ANDAMENTO",
                label: "EM ANDAMENTO",
              },
              {
                value: "PAUSADA",
                label: "PAUSADA",
              },
              {
                value: "AGENDADA",
                label: "AGENDADA",
              },
              {
                value: "AGUARDANDO AGENDAMENTO",
                label: "AGUARDANDO AGENDAMENTO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DA ENTREGA"
            onChange={(e) =>
              setFilters({
                ...filters,
                entregaStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              { value: "EM ROTA", label: "EM ROTA" },
              { value: "AGUARDANDO COMPRA", label: "AGUARDANDO COMPRA" },
              { value: "ENTREGUE", label: "ENTREGUE" },
              { value: undefined, label: "NÃO DEFINIDO" },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS PAG. KIT"
            onChange={(e) =>
              setFilters({
                ...filters,
                liberacaoStatus: e.map((x) => x.value),
              })
            }
            options={statusLiberacao.map((status) => {
              return { label: status.label, value: status.value };
            })}
          />
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
            placeholder="EQUIP.RESP"
            onChange={(e) =>
              setFilters({
                ...filters,
                equipResp: e.map((x) => x.value),
              })
            }
            options={equipesTecnicas.map((equipe) => equipe)}
          />
          <div
            onClick={() =>
              setFilters({ ...filters, obsPendente: !filters.obsPendente })
            }
            className={`${
              filters.obsPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            OBS DE OBRA PENDENTE
          </div>
          <div
            onClick={() =>
              setFilters({ ...filters, osPendente: !filters.osPendente })
            }
            className={`${
              filters.osPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            SEM OSs GERADAS
          </div>
          <div
            onClick={() =>
              setFilters({ ...filters, foraDeItba: !filters.foraDeItba })
            }
            className={`${
              filters.foraDeItba ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PROJETOS FORA DE ITBA
          </div>
          <input
            type={"text"}
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            className={
              "outline-none p-1.5 rounded border border-gray-200 placeholder:italic"
            }
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <input
            type={"text"}
            placeholder="Digite o tipo da telha"
            value={filters.tipoDaTelhaFilter}
            className={
              "outline-none p-1.5 rounded border border-gray-200 placeholder:italic"
            }
            onChange={(e) => handleTipoDaTelhaFilter(e.target.value)}
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
        </div>
        <button
          onClick={filterProjects}
          className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
        >
          <p>Filtrar</p>
          <AiOutlineSearch />
        </button>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              handleOpenModal(project._id);
            }}
            key={project._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer ${
              project.parecer.dataParecerDeAcesso != undefined &&
              project.vistoria.status != "REALIZADA"
                ? getBorderColorByParecer(
                    new Date(project.parecer.dataParecerDeAcesso),
                    new Date(),
                    project.obra.statusDaObra
                  )
                : "border border-gray-200"
            }  p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">STATUS</span>
                <p className="text-xs text-gray-600">
                  {project.obra.statusDaObra ? project.obra.statusDaObra : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">LAUDO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.obra.laudo ? project.obra.laudo : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">STATUS KIT</span>
                <p className="text-xs text-yellow-500">
                  {project.compra.statusEntrega
                    ? project.compra.statusEntrega
                    : "-"}
                </p>
              </div>
              <div className="hidden lg:block">
                <span className="text-xxs">PREVISÃO DE ENTREGA</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.compra.previsaoEntrega
                    ? new Date(
                        project.compra.previsaoEntrega
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">TÉCNICO RESPONSÁVEL</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.visitaTecnica.tecnico
                    ? project.visitaTecnica.tecnico
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-[#15599a]">
                  {project.cidade ? project.cidade : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">TELHA</span>
                <p className="text-xs text-[#15599a] uppercase">
                  {project.visitaTecnica.tipoDaTelha
                    ? project.visitaTecnica.tipoDaTelha
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">NºMÓDULOS</span>
                <p className="text-xs text-center text-[#15599a]">
                  {project.sistema?.qtdeModulos
                    ? project.sistema?.qtdeModulos
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">FIM DO PARECEM EM</span>
                <p className="text-xs text-[#15599a] text-center uppercase">
                  {project.parecer.dataParecerDeAcesso
                    ? 120 -
                        dayjs(new Date()).diff(
                          project.parecer.dataParecerDeAcesso,
                          "days"
                        ) >
                      0
                      ? `${
                          120 -
                          dayjs(new Date()).diff(
                            project.parecer.dataParecerDeAcesso,
                            "days"
                          )
                        } dias`
                      : "VENCIDO"
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">DESDE DO CONTRATO</span>
                <p className="text-xs text-[#15599a] uppercase text-center">
                  {project.contrato.dataAssinatura
                    ? `${dayjs(new Date()).diff(
                        project.contrato.dataAssinatura,
                        "days"
                      )} dias`
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">DESDE DE ENTREGA</span>
                <p className="text-xs text-center text-[#15599a] uppercase">
                  {project.compra.statusEntrega == "ENTREGUE"
                    ? project.compra.dataEntrega
                      ? `${dayjs(new Date()).diff(
                          project.compra.dataEntrega,
                          "days"
                        )} dias`
                      : `${dayjs(new Date()).diff(
                          project.compra.previsaoEntrega,
                          "days"
                        )} dias`
                    : "-"}
                </p>
              </div>
            </div>
            {project.pagamento.credor == "SOL FÁCIL" && (
              <div className="flex justify-center items-center">
                <h1 className="font-bold text-red-500 text-center">
                  POSSUI DESLIGAMENTO REMOTO
                </h1>
              </div>
            )}
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalObras
          credentials={credentials}
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("Obras") &&
            credentials.regional == undefined
              ? true
              : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Obras;
