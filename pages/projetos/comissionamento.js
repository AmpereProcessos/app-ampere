import axios from "axios";
import React, { useEffect, useState } from "react";
import ComissionamentoCard from "../../components/ComissionamentoCard";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function Comissionamento() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState();
  const [filters, setFilters] = useState({
    pendenciaComercial: false,
    pendenciaSuprimentos: false,
    pendenciaProjetos: false,
  });
  function getProjects() {
    axios.get("/api/projects/comissionamento").then((res) => {
      console.log(res.data);
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  function filterPendenciaComercial(value) {
    setFilters({ pendenciaComercial: value });
    var newArr;
    if (value) {
      newArr = projects.filter((obj) => !obj.comissionamento?.comercial);
      console.log("comercial", newArr);
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function filterPendenciaSuprimentos(value) {
    setFilters({ pendenciaSuprimentos: value });
    var newArr;
    if (value) {
      newArr = projects.filter(
        (obj) =>
          obj.comissionamento?.comercial && !obj.comissionamento?.suprimentos
      );
      console.log("comercial", newArr);
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }

  function filterPendenciaProjetos(value) {
    setFilters({ pendenciaProjetos: value });
    var newArr;
    if (value) {
      newArr = projects.filter(
        (obj) =>
          obj.comissionamento?.comercial && obj.comissionamento?.suprimentos
      );
      console.log("comercial", newArr);
    }
    if (!newArr) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(newArr);
    }
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
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Projetos")) {
      getProjects();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-2xl text-[#15599a]">
                Comissionamento
              </p>
              {filteredProjects && (
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects.length})
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-y-2 mt-4">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
              <input
                type={"text"}
                className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                placeholder="DIGITE O NOME DO CONTRATO"
                value={searchFilter}
                onChange={(e) => handleSearchFilter(e.target.value)}
              />
              <div
                onClick={() =>
                  filterPendenciaComercial(!filters.pendenciaComercial)
                }
                className={`${
                  filters.pendenciaComercial ? "bg-[#15599a]" : "bg-blue-300"
                } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
              >
                PENDENCIA COMERCIAL
              </div>
              <div
                onClick={() =>
                  filterPendenciaSuprimentos(!filters.pendenciaSuprimentos)
                }
                className={`${
                  filters.pendenciaSuprimentos ? "bg-[#15599a]" : "bg-blue-300"
                } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
              >
                PENDENCIA SUPRIMENTOS
              </div>
              <div
                onClick={() =>
                  filterPendenciaProjetos(!filters.pendenciaProjetos)
                }
                className={`${
                  filters.pendenciaProjetos ? "bg-[#15599a]" : "bg-blue-300"
                } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
              >
                PENDENCIA PROJETOS
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3 mt-4 ">
          {filteredProjects.map((project) => (
            <ComissionamentoCard
              getProjects={getProjects}
              credentials={session?.user}
              key={project._id}
              info={project}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Comissionamento;
