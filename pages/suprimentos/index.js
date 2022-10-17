import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";

import ModalSuprimentos from "../../components/ModalSuprimentos";
function Suprimentos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    paymentStatus: [],
    deliveryStatus: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/suprimentos").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getProjects();
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
  return (
    <div className="p-6 grow">
      <div className="flex justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos no estágio de suprimentos
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
        <div className="flex gap-x-2">
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
            placeholder="STATUS ENTREGA"
            onChange={(e) =>
              setFilters({ ...filters, deliveryStatus: e.map((x) => x.value) })
            }
            options={[
              { value: "EM ROTA", label: "EM ROTA" },
              { value: "AGUARDANDO COMPRA", label: "AGUARDANDO COMPRA" },
              { value: undefined, label: "NÃO DEFINIDO" },
            ]}
          />
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 items-center gap-x-2"
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
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">CONTRATO</span>
                <p className="text-xs text-gray-600">
                  {project.contrato.status ? project.contrato.status : "-"}
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
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalSuprimentos
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("Suprimentos") ? true : false
          }
          ppsEditor={
            credentials.accessibleRoutes.includes("PPS") ? true : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Suprimentos;
