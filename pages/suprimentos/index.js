import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { statusLiberacao } from "../../utils/constants";
import ModalSuprimentos from "../../components/ModalSuprimentos";
function Suprimentos({ credentials, setCredentials }) {
  const router = useRouter();
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
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let newArr = projects.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function getBorderColor(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 7) {
      return "border-2 border-red-600";
    } else if (diffDays >= 5) {
      return "border-2 border-yellow-500";
    } else if (diffDays > 3) {
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
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
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
  return (
    <div className="p-6 grow">
      <div className="flex flex-col justify-between border-b border-gray-200 p-1">
        <div className="flex justify-center items-center gap-x-2">
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
            placeholder="STATUS DE PAGAMENTO"
            onChange={(e) =>
              setFilters({ ...filters, paymentStatus: e.map((x) => x.value) })
            }
            options={[
              { value: "PAGO", label: "PAGO" },
              { value: "AGUARDANDO PAGAMENTO", label: "AGUARDANDO PAGAMENTO" },
            ]}
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
                    new Date(project.compra.dataLiberacao),
                    new Date()
                  )
                : "border border-gray-200"
            } p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">INFORMAÇÕES</span>
                <p className="text-xxs font-bold text-gray-600">
                  {project.compra.informacoes
                    ? project.compra.informacoes
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">LIBERACÃO DE CRÉDITO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.compra.statusLiberacao
                    ? project.compra.statusLiberacao
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">FORNECEDOR</span>
                <p className="text-xs text-yellow-500">
                  {project.compra.fornecedor ? project.compra.fornecedor : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">STATUS ENTREGA</span>
                <p className="text-xs text-gray-600">
                  {project.compra.statusEntrega
                    ? project.compra.statusEntrega
                    : "-"}
                </p>
              </div>
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
                    ? `${getDateDiff(
                        new Date(project.compra.dataPedido),
                        new Date(project.compra.dataLiberacao)
                      )} DIAS`
                    : `${getDateDiff(
                        new Date(),
                        new Date(project.compra.dataLiberacao)
                      )} DIAS`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalSuprimentos
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
