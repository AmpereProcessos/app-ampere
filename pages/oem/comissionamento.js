import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import Select from "react-select";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import ComissionamentoPosObraCard from "../../components/ComissionamentoPosObraCard";
import ComissionamentoPosObraSkeleton from "../../components/skeletons/ComissionamentoPosObraSkeleton";
import {
  cidadesAtendidas,
  equipesTecnicas,
  vendedores,
} from "../../utils/constants";
import FilterButton from "../../components/utils/Buttons/FilterButton";
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

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();
  const [filters, setFilters] = useState({
    search: "",
    city: [],
    respTeam: [],
    plantPowered: [],
    seller: [],
    technicalDeliveryType: [],
    appPending: false,
    injectedEnergyPending: false,
    technicalDeliveryPending: false,
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  function getProjects() {
    axios.get("/api/projects/comissionamentoPosObra").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function handleSearchFilter(value) {
    setFilters({ ...filters, search: value });
    if (value != "" || value != " ") {
      var filteredArr = filterProjects();
      var newArr = filteredArr.filter((project) =>
        project.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function filterProjects() {
    var newArr;
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.appPending) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => project.app.data == undefined);
      console.log(newArr);
    }
    if (filters.injectedEnergyPending) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.medidor.data != undefined &&
          project.conferencias.energiaInjetada.data == undefined
      );
    }
    if (filters.technicalDeliveryPending) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.medidor.data != undefined &&
          (project.jornada?.tipoEntregaTecnica == undefined ||
            project.jornada?.tipoEntregaTecnica == "NÃO DEFINIDO")
      );
    }
    // if (filters.search.length > 0) {
    //   if (!newArr) newArr = projects;
    //   newArr = newArr.filter((call) =>
    //     call.nomeDoContrato.toUpperCase().includes(filters.search)
    //   );
    // }
    if (filters.city.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => filters.city.includes(call.cidade));
    }
    if (filters.seller.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.seller.includes(call.vendedor.nome)
      );
    }
    if (filters.respTeam.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.respTeam.includes(call.obra?.equipeResp)
      );
    }
    if (filters.technicalDeliveryType.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.technicalDeliveryType.includes(call.jornada.tipoEntregaTecnica)
      );
    }
    if (filters.plantPowered.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.plantPowered.includes(call.conferencias.usinaLigada.status)
      );
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects([...newArr]);
      return newArr;
    }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("O&M") ||
      session?.user.accessibleRoutes.includes("Pós-Venda")
    ) {
      if (!projects) {
        getProjects();
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    if (filteredProjects) {
      return (
        <div className="p-6 grow flex flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-['Roboto']">
                  COMISSIONAMENTO PÓS-OBRA
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects.length})
                </p>
              </div>

              {dropdownMenuVisible ? (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropupCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setDropdownMenuVisible(false)}
                  />
                </div>
              ) : (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropdownCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setDropdownMenuVisible(true)}
                  />
                </div>
              )}
            </div>
            <AnimatePresence>
              {dropdownMenuVisible ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col w-full gap-y-2 mt-4"
                >
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <input
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={filters.search}
                      onChange={(e) => handleSearchFilter(e.target.value)}
                    />
                    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                      <div className="flex items-center gap-x-2 justify-center">
                        <div className="flex flex-col w-fit items-center">
                          <span className="uppercase font-bold font-raleway text-center text-sm">
                            Depois de:
                          </span>
                          <input
                            className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                            type="date"
                            value={
                              dateFilter.after &&
                              new Date(dateFilter.after)
                                .toISOString()
                                .slice(0, 10)
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
                              new Date(dateFilter.before)
                                .toISOString()
                                .slice(0, 10)
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
                      </div>
                      <div className="w-full lg:w-[250px]">
                        <Select
                          isMulti={false}
                          placeholder={"CAMPO DE FILTRO"}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              width: "100%",
                              minHeight: "41px",
                            }),
                          }}
                          options={[
                            { label: "SAÍDA DE OBRA", value: "obra.saida" },
                            {
                              label: "TROCA DO MEDIDOR",
                              value: "medidor.data",
                            },
                            { label: "NÃO DEFINIDO", value: null },
                          ]}
                          onChange={(e) =>
                            setDateFilter({
                              ...dateFilter,
                              field1:
                                e.value != null ? e.value.split(".")[0] : null,
                              field2:
                                e.value != null ? e.value.split(".")[1] : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="USINA LIGADA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            plantPowered: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: "NÃO REALIZADO", value: "NÃO REALIZADO" },
                          { label: "REALIZADO", value: "REALIZADO" },
                        ]}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="EQUIP.RESP"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            respTeam: e.map((x) => x.value),
                          })
                        }
                        options={equipesTecnicas.map((equipe) => equipe)}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="VENDEDOR"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            seller: e.map((x) => x.value),
                          })
                        }
                        options={vendedores.map((vendedor) => {
                          return { label: vendedor.nome, value: vendedor.nome };
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="CIDADE"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            city: e.map((x) => x.value),
                          })
                        }
                        options={cidadesAtendidas.map((cidade) => {
                          return {
                            label: cidade,
                            value: cidade,
                          };
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="TIPO DA ENTREGA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            technicalDeliveryType: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            label: "PRESENCIAL",
                            value: "PRESENCIAL",
                          },
                          {
                            label: "REMOTO",
                            value: "REMOTO",
                          },
                          {
                            label: "NÃO DEFINIDO",
                            value: "NÃO DEFINIDO",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          appPending: !filters.appPending,
                        })
                      }
                      className={`${
                        filters.appPending ? "bg-[#15599a]" : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      APP PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          injectedEnergyPending: !filters.injectedEnergyPending,
                        })
                      }
                      className={`${
                        filters.injectedEnergyPending
                          ? "bg-[#15599a]"
                          : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      ENERGIA INJETADA PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          technicalDeliveryPending:
                            !filters.technicalDeliveryPending,
                        })
                      }
                      className={`${
                        filters.technicalDeliveryPending
                          ? "bg-[#15599a]"
                          : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      ENTREGA TÉCNICA PENDENTE
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <FilterButton
                      text={"FILTRAR"}
                      icon={<AiOutlineSearch />}
                      handleClick={filterProjects}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {filteredProjects?.map((project, index) => (
              <ComissionamentoPosObraCard
                key={project._id}
                project={project}
                index={index}
                handleUpdates={() => getProjects()}
              />
            ))}
          </div>
          <Link href={"/vendas/entregaTecnica"}>
            <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
              <p className="uppercase font-bold text-sm">
                ENTREGAS TÉCNICAS PRESENCIAIS
              </p>
            </a>
          </Link>
        </div>
      );
    } else {
      return <ComissionamentoPosObraSkeleton />;
    }
  }
}

export default Comissionamento;
