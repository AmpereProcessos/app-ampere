import axios from "axios";
import { useRouter } from "next/router";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ModalVisitaTecnica from "../../components/ModalVisitaTecnica";
import dayjs from "dayjs";
import { BsPatchCheckFill } from "react-icons/bs";
function VisitaTecnica({ credentials, setCredentials }) {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    numModules: "",
    search: "",
  });
  const [modal, setModal] = useState({
    open: false,
    form: {},
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });
  function getProjects() {
    axios.get("/api/solicitacoes/visitaTecnica").then((res) => {
      setFilteredForms(res.data);
      setForms(res.data);
    });
  }
  function getCardColor(statusAprovacao) {
    if (statusAprovacao == "CONCLUIDO") {
      return "bg-green-100";
    } else if (statusAprovacao == "EM ANÁLISE TÉCNICA") {
      return "bg-yellow-100";
    } else if (statusAprovacao == "PENDÊNCIA COMERCIAL") {
      return "bg-cyan-100";
    } else if (statusAprovacao == "VISITA IN LOCO") {
      return "bg-indigo-100";
    } else if (statusAprovacao == "REJEITADA") {
      return "bg-red-300";
    } else {
      return "bg-[#fff]";
    }
  }
  function filterForms() {
    var newArr;
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter(
        (form) =>
          form[dateFilter.field] >= dateFilter.after &&
          form[dateFilter.field] <= dateFilter.before
      );
    }
    if (filters.status.length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) => filters.status.includes(form.status));
    }
    if (filters.search.trim().length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) =>
        form.nomeDoCliente.toUpperCase().includes(filters.search.toUpperCase())
      );
    }
    if (filters.numModules > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) => form.qtdeModulos > filters.numModules);
    }
    if (!newArr) {
      setFilteredForms(forms);
      return forms;
    } else {
      setFilteredForms(newArr);
      return newArr;
    }
  }
  function getPendenceStatusBorder(tipoDeLaudo, currentTimeDiff, status) {
    if (tipoDeLaudo == "NÃO DEFINIDO") return;
    if (status != "CONCLUIDO") {
      var matches = /\(([^)]+)\)/.exec(tipoDeLaudo)[1];
      var expectedHours = matches.split(" ")[0];
      if (Number(expectedHours) - Number(currentTimeDiff) <= 3) {
        return "border-2 border-red-500";
      } else if (Number(expectedHours) - Number(currentTimeDiff) <= 5) {
        return "border-2 border-yellow-500";
      } else {
        return;
      }
    } else {
      return;
    }
  }
  function getPendenceStatusText(tipoDeLaudo, currentTimeDiff, status) {
    if (tipoDeLaudo == "NÃO DEFINIDO") return "text-gray-700";
    if (status != "CONCLUIDO") {
      var matches = /\(([^)]+)\)/.exec(tipoDeLaudo)[1];
      var expectedHours = matches.split(" ")[0];
      if (Number(expectedHours) - Number(currentTimeDiff) <= 3) {
        return "text-red-500";
      } else if (Number(expectedHours) - Number(currentTimeDiff) <= 5) {
        return "text-yellow-500";
      } else {
        return "text-gray-700";
      }
    } else {
      return "text-gray-700";
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Projetos")) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Projetos")) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff] flex flex-col">
      <div className="flex flex-col gap-2 items-center w-full border-b border-gray-200 pb-2">
        <h1 className="pb-2 text-[#fead61] text-xl font-bold w-full text-center">
          FORMULÁRIOS DE VISITA TÉCNICA ({filteredForms.length})
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-green-200 rounded" />
            <p>CONCLUIDO</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-yellow-200 rounded" />
            <p>EM ANÁLISE TÉCNICA</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-cyan-200 rounded" />
            <p>PENDÊNCIA COMERCIAL</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-indigo-200 rounded" />
            <p>VISITA IN LOCO</p>
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap grow gap-2">
          <div className="hidden lg:flex gap-x-2">
            <input
              type={"text"}
              placeholder="Digite o nome do cliente..."
              value={filters.search}
              className="outline-none text-xs p-1.5 h-[36px] w-[300px] text-center rounded border border-gray-200 placeholder:italic"
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="NºModulos > que"
              className={
                "outline-none text-xs p-1.5 h-[36px] text-center rounded border border-gray-200 placeholder:italic"
              }
              value={filters.numModules}
              onChange={(e) =>
                setFilters({ ...filters, numModules: Number(e.target.value) })
              }
            />
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
                {
                  label: "DATA DE CONCLUSÃO",
                  value: "dataDeConclusao",
                },
                { label: "NÃO DEFINIDO", value: null },
              ]}
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  field: e.value,
                })
              }
            />
          </div>
          <Select
            isMulti
            placeholder="STATUS"
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.map((x) => x.value),
              })
            }
            options={[
              { label: "CONCLUIDO", value: "CONCLUIDO" },
              { label: "EM ANÁLISE TÉCNICA", value: "EM ANÁLISE TÉCNICA" },
              { label: "PENDÊNCIA COMERCIAL", value: "PENDÊNCIA COMERCIAL" },
              { label: "VISITA IN LOCO", value: "VISITA IN LOCO" },
            ]}
          />
          <button
            onClick={filterForms}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-around gap-3 mt-4">
        {filteredForms.map((form) => (
          <div
            onClick={() => {
              setModal({ open: true, form: form });
            }}
            key={form._id}
            className={`w-[250px] ${getCardColor(
              form.status
            )} ${getPendenceStatusBorder(
              form.tipoDeLaudo,
              dayjs().diff(dayjs(form.dataDeAbertura), "hours"),
              form.status
            )} lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex justify-center">
              <h1 className="text-xs text-[#15599a] font-bold">
                {form.nomeDoCliente}
              </h1>
              {form.solicitacaoContrato && (
                <BsPatchCheckFill
                  style={{
                    fontSize: "20px",
                    color: "rgb(21 128 61)",
                    marginLeft: "10px",
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-xxs text-gray-700">CIDADE</p>
                <p className="text-xs text-gray-700 font-bold">{form.cidade}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xxs text-gray-700">VENDEDOR</p>
                <p className="text-xs text-gray-700 font-bold">
                  {form.nomeVendedor}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-xxs text-gray-700">TIPO DE LAUDO</p>
                <p className="text-xs text-gray-700 font-bold">
                  {form.tipoDeLaudo}
                </p>
              </div>
              <div
                className={`flex flex-col ${getPendenceStatusText(
                  form.tipoDeLaudo,
                  dayjs().diff(dayjs(form.dataDeAbertura), "hours"),
                  form.status
                )} items-center mt-2`}
              >
                <p className="text-xxs">
                  {form.dataDeConclusao
                    ? "TEMPO ATÉ CONCLUSÃO"
                    : "TEMPO DESDE ABERTURA"}
                </p>
                <p className="text-xs font-bold">
                  {form.dataDeConclusao
                    ? dayjs(form.dataDeConclusao).diff(
                        dayjs(form.dataDeAbertura),
                        "hours"
                      )
                    : dayjs().diff(dayjs(form.dataDeAbertura), "hours")}{" "}
                  HORAS
                </p>
              </div>
            </div>
          </div>
        ))}
        {modal.open && (
          <ModalVisitaTecnica
            info={modal.form}
            setModalIsOpen={() => setModal({ ...modal, open: false })}
            handleUpdates={getProjects}
          />
        )}
      </div>
    </div>
  );
}

export default VisitaTecnica;
