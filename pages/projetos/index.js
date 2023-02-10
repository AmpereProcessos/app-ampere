import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalProjetos from "../../components/ModalProjetos";
import {
  projetistas,
  cidadesAtendidas,
  vendedores,
  tiposDeServico,
} from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import TagTipoDeServico from "../../components/TagTipoDeServico";
function Projetos() {
  const router = useRouter();
  const { credentials, setCredentials } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [filters, setFilters] = useState({
    parecerFilter: [],
    vistoriaFilter: [],
    projetistaFilter: [],
    distribuicaoFilter: [],
    tipoDeServicoFilter: [],
    assinFaltando: false,
    desenhoFilter: false,
    parecerReprovado: false,
    vistoriaReprovada: false,
    obraStatusFilter: [],
    entregaStatusFilter: [],
    cidadeFilter: [],
    vendedorFilter: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/projetos", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/projetos").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
  }
  function handleUpdates(id) {
    var index = projects.findIndex((x) => x._id == id);
    var indexFiltered = filteredProjects.findIndex((x) => x._id == id);
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      var arr = [...projects];
      arr[index] = res.data[0];
      var arrFiltered = [...filteredProjects];
      arrFiltered[indexFiltered] = res.data[0];
      setModalProject(res.data[0]);
      setProjects(arr);
      setFilteredProjects(arrFiltered);
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
  function filterProjects() {
    var newArr;
    if (filters.parecerFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = projects.filter((project) =>
        filters.parecerFilter.includes(project.parecer.statusDoParecerDeAcesso)
      );
    }
    if (filters.vistoriaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vistoriaFilter.includes(call.vistoria?.status)
      );
    }
    if (filters.projetistaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.projetistaFilter.includes(call.projeto.projetista.nome)
      );
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.tipoDeServicoFilter.includes(call.tipoDeServico)
      );
    }
    if (filters.distribuicaoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.distribuicaoFilter.includes(call.dadosCemig.distCreditos)
      );
    }
    if (filters.obraStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.obraStatusFilter.includes(call.obra.statusDaObra)
      );
    }
    if (filters.entregaStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.entregaStatusFilter.includes(call.compra.statusEntrega)
        );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.cidadeFilter.includes(call.cidade)
        );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.vendedorFilter.includes(call.vendedor.nome)
        );
    }
    if (filters.desenhoFilter) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.projeto.desenhoTelhado != "OK");
    }
    if (filters.assinFaltando) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.projeto.dataAssDocumentacao == undefined ||
          project.projeto.dataAssDocumentacao == null ||
          project.projeto.dataAssDocumentacao == "-"
      );
    }
    if (filters.parecerReprovado) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.parecer.parecerReprovado == "SIM"
      );
    }
    if (filters.vistoriaReprovada) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.vistoria.vistoriaReprovada == "SIM"
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          project[dateFilter.field1][dateFilter.field2] <= dateFilter.before
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
  function getBorderColorByParecer(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 110) {
      return "border-2 border-red-600";
    } else if (diffDays > 105) {
      return "border-2 border-yellow-500";
    } else if (diffDays > 90) {
      return "border-2 border-blue-700";
    } else {
      return "border border-gray-200";
    }
  }
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Number(diffInDays).toFixed(0);
  }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  useEffect(() => {
    if (
      !credentials.accessibleRoutes.includes("Projetos") &&
      !credentials.accessibleRoutes.includes("Pós-Venda")
    ) {
      router.push("/");
    } else {
      getProjects(credentials);
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col justify-between items-center  gap-2 border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
            Projetos no estágio de engenharia
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
        <div className="flex gap-2 flex-wrap justify-center">
          <input
            className="outline-none p-1.5 w-[250px] h-[36px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
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
              { value: "NÃO DEFINIDO", label: "NÃO DEFINIDO" },
              { value: "CANCELADO", label: "CANCELADO" },
              { value: undefined, label: "VAZIO" },
            ]}
          />
          <Select
            isMulti
            placeholder="TIPO DE SERVIÇO"
            onChange={(e) =>
              setFilters({
                ...filters,
                tipoDeServicoFilter: e.map((x) => x.value),
              })
            }
            options={tiposDeServico.map((tipo) => {
              return { label: tipo.label, value: tipo.value };
            })}
          />
          <Select
            isMulti
            placeholder="STATUS DO PARECER"
            onChange={(e) =>
              setFilters({
                ...filters,
                parecerFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                label: "AGUARDANDO ASSINATURA",
                value: "AGUARDANDO ASSINATURA",
              },
              {
                label: "AGUARDANDO AUMENTO DE CARGA",
                value: "AGUARDANDO AUMENTO DE CARGA",
              },
              {
                label: "INICIAR PROJETO",
                value: "INICIAR PROJETO",
              },
              {
                label: "SOLICITAR TROCA DE TITULARIDADE",
                value: "SOLICITAR TROCA DE TITULARIDADE",
              },
              {
                label: "AGUARDANDO FATURAMENTO ART",
                value: "AGUARDANDO FATURAMENTO ART",
              },
              {
                label: "AGUARDANDO FORMULÁRIOS",
                value: "AGUARDANDO FORMULÁRIOS",
              },
              {
                label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
              },
              {
                label: "AGUARDANDO TROCA DE TITULARIDADE",
                value: "AGUARDANDO TROCA DE TITULARIDADE",
              },
              {
                label: "AUMENTO DE CARGA",
                value: "AUMENTO DE CARGA",
              },
              {
                label: "CANCELADO",
                value: "CANCELADO",
              },
              {
                label: "PARECER DE ACESSO APROVADO",
                value: "PARECER DE ACESSO APROVADO",
              },
              {
                label: "PENDENCIAS",
                value: "PENDENCIAS",
              },
              {
                label: "SOLICITAR ACESSO",
                value: "SOLICITAR ACESSO",
              },
              {
                label: "SOLICITAR AUMENTO DE CARGA",
                value: "SOLICITAR AUMENTO DE CARGA",
              },
              {
                label: "PARECER DE ACESSO COM OBRAS",
                value: "PARECER DE ACESSO COM OBRAS",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
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
                label: "AGENDADA",
                value: "AGENDADA",
              },
              {
                label: "AGUARDANDO AGENDAMENTO",
                value: "AGUARDANDO AGENDAMENTO",
              },
              {
                label: "CONCLUIDA",
                value: "CONCLUIDA",
              },
              {
                label: "EM ANDAMENTO",
                value: "EM ANDAMENTO",
              },
              {
                label: "OBRA CANCELADA",
                value: "OBRA CANCELADA",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DA VISTORIA"
            onChange={(e) =>
              setFilters({
                ...filters,
                vistoriaFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "REALIZADA", value: "REALIZADA" },
              {
                label: "AGUARDANDO OBRA DE REDE",
                value: "AGUARDANDO OBRA DE REDE",
              },
              {
                label: "AGUARDANDO CONCESSIONARIA",
                value: "AGUARDANDO CONCESSIONARIA",
              },
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
          />
          <Select
            isMulti
            placeholder="PROJETISTA"
            onChange={(e) =>
              setFilters({
                ...filters,
                projetistaFilter: e.map((x) => x.value),
              })
            }
            options={projetistas.map((projetista) => {
              return {
                label: projetista.label,
                value: projetista.nome,
              };
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
          <div
            onClick={() =>
              setFilters({ ...filters, desenhoFilter: !filters.desenhoFilter })
            }
            className={`${
              filters.desenhoFilter ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            DESENHO PENDENTE
          </div>
          <Select
            isMulti
            placeholder="DIST. CRÉDITOS"
            onChange={(e) =>
              setFilters({
                ...filters,
                distribuicaoFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "SIM", value: "SIM" },
              { label: "NÃO", value: "NÃO" },
            ]}
          />
          <div
            onClick={() =>
              setFilters({ ...filters, assinFaltando: !filters.assinFaltando })
            }
            className={`${
              filters.assinFaltando ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            FALTANDO ASSINATURA
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                parecerReprovado: !filters.parecerReprovado,
              })
            }
            className={`${
              filters.parecerReprovado ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PARECER REPROVADO
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                vistoriaReprovada: !filters.vistoriaReprovada,
              })
            }
            className={`${
              filters.vistoriaReprovada ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            VISTORIA REPROVADA
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
                { label: "DATA DE PAGAMENTO", value: "compra.dataPagamento" },
                {
                  label: "APROVAÇÃO DO PARECER",
                  value: "parecer.dataParecerDeAcesso",
                },
                {
                  label: "PEDIDO DA VISTORIA",
                  value: "vistoria.dataPedido",
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
            className="flex bg-[#fead61] h-[36px] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-2  items-center gap-x-2"
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
              handleOpenModal(project._id);
            }}
            key={project._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer ${
              project.parecer.dataParecerDeAcesso != undefined &&
              project.vistoria.status != "REALIZADA"
                ? getBorderColorByParecer(
                    new Date(project.parecer.dataParecerDeAcesso),
                    new Date()
                  )
                : "border border-gray-200"
            }  hover:bg-blue-100`}
          >
            <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-700">
                  {project.nomeDoContrato}
                </p>
                <p className="text-xs text-[#15599a]">#{project.qtde}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xxs">PARECER DE ACESSO</span>
                  <p className="text-xs text-gray-600">
                    {project.parecer.statusDoParecerDeAcesso
                      ? project.parecer.statusDoParecerDeAcesso
                      : "-"}
                  </p>
                </div>
                <div className="text-end">
                  <span className="text-xxs text-end">VISTORIA</span>
                  <p className="text-xs text-center text-gray-600">
                    {project.vistoria.status ? project.vistoria.status : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xxs">DIAGRAMA UNIFILAR</span>
                  <p
                    className={`${
                      project.projeto.diagramaUnifilar
                        ? "text-yellow-500"
                        : "text-red-400"
                    } text-xs uppercase`}
                  >
                    {project.projeto.diagramaUnifilar
                      ? project.projeto.diagramaUnifilar
                      : "PENDENTE"}
                  </p>
                </div>
                <div>
                  <span className="text-xxs text-center">
                    {project.compra.statusEntrega == "ENTREGUE"
                      ? "DATA DE ENTREGA"
                      : "PREV. DE ENTREGA"}
                  </span>
                  <p className={`text-gray-600 text-xs uppercase text-center`}>
                    {project.compra.statusEntrega == "ENTREGUE" &&
                    project.compra.dataEntrega
                      ? dayjs(project.compra.dataEntrega)
                          .add(4, "h")
                          .format("DD/MM/YYYY")
                      : project.compra.previsaoEntrega
                      ? dayjs(project.compra.previsaoEntrega)
                          .add(4, "h")
                          .format("DD/MM/YYYY")
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xxs">DESENHO DO TELHADO</span>
                  <p className="text-xs text-gray-600 text-center">
                    {project.projeto.desenhoTelhado
                      ? project.projeto.desenhoTelhado
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full flex flex-col">
                  <span className="text-xxs">DESDE ASS.CONTRATO</span>
                  <p className={`text-xs uppercase text-red-500 text-start`}>
                    {project.contrato.dataAssinatura
                      ? `${getDateDiff(
                          new Date(),
                          new Date(project.contrato.dataAssinatura)
                        )} DIAS`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href={"/projetos/visitaTecnica"}>
        <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Visitas técnicas</p>
        </a>
      </Link>
      {modalIsOpen && (
        <ModalProjetos
          credentials={credentials}
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("Projetos") &&
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

export default Projetos;
