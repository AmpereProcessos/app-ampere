import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Select from "react-select";
import { AppContext } from "../../context/AppContext";
import { cidadesAtendidas, vendedores } from "../../utils/constants";

function Acompanhamento() {
  const router = useRouter();
  const { credentials, setCredentials } = useContext(AppContext);
  console.log(credentials);
  const [info, setInfo] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [filters, setFilters] = useState({
    vendedorFilter: [],
    cidadeFilter: [],
    regionalFilter: "GERAL",
  });
  function getInfo() {
    axios.get("/api/report").then((res) => setInfo(res.data));
  }
  function getPotenciaVendida() {
    var filteredArr = info;
    filteredArr = filteredArr.filter((x) => x.contrato.status == "ASSINADO");
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico)
        ? filteredArr[i].sistema.potPico
        : 0;
      sum = sum + Number(pot);
    }
    return sum.toFixed(2);
  }
  function getPotenciaHomologada() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) =>
        x.parecer.dataParecerDeAcesso != null &&
        x.parecer.dataParecerDeAcesso != undefined &&
        x.parecer.dataParecerDeAcesso != "-"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico)
        ? filteredArr[i].sistema.potPico
        : 0;
      sum = sum + Number(pot);
    }
    return sum.toFixed(2);
  }
  function getPotenciaInstalada() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) => x.obra?.statusDaObra == "CONCLUIDA"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico)
        ? filteredArr[i].sistema.potPico
        : 0;
      sum = sum + Number(pot);
    }
    return sum.toFixed(2);
  }
  function getObrasFinalizadas() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) => x.obra?.statusDaObra == "CONCLUIDA"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
      console.log("pós filtro de data", filteredArr);
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    return filteredArr.length;
  }
  function getTempoMedioDeAprovacao() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) =>
        x.parecer.statusDoParecerDeAcesso != "CANCELADO" &&
        x.obra.statusDaObra != "OBRA CANCELADA"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let diff = dayjs(filteredArr[i].parecer.dataParecerDeAcesso).diff(
        filteredArr[i].projeto.dataAssDocumentacao,
        "day"
      );
      if (isNaN(diff)) {
        sum = sum;
      } else {
        sum = sum + diff;
      }
    }

    return (sum / filteredArr.length).toFixed(2);
  }
  function getTempoMedioDeCompra() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) =>
        x.parecer.statusDoParecerDeAcesso != "CANCELADO" &&
        x.obra.statusDaObra != "OBRA CANCELADA"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let diff = dayjs(filteredArr[i].compra.dataPedido).diff(
        filteredArr[i].compra.dataLiberacao,
        "day"
      );
      if (isNaN(diff)) {
        sum = sum;
      } else {
        sum = sum + diff;
      }
    }

    return (sum / filteredArr.length).toFixed(2);
  }
  function getTempoMedioDeInstalacao() {
    var filteredArr = info;
    filteredArr = filteredArr.filter(
      (x) => x.obra?.statusDaObra == "CONCLUIDA"
    );
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var sum = 0;
    for (let i = 0; i < filteredArr.length; i++) {
      let diff = dayjs(filteredArr[i].obra.saida).diff(
        filteredArr[i].obra.entrada,
        "day"
      );
      if (isNaN(diff)) {
        sum = sum;
      } else {
        sum = sum + diff;
      }
    }
    return (sum / filteredArr.length).toFixed(2);
  }
  function getNps() {
    var filteredArr = info;
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    let promotores = filteredArr.filter((x) => x.nps >= 9);
    let detratores = filteredArr.filter((x) => x.nps != null && x.nps <= 6);
    let consultasTotais = filteredArr.filter(
      (x) => x.nps != null && x.nps >= 0 && x.nps <= 10
    );
    return (
      ((promotores.length - detratores.length) * 100) /
      consultasTotais.length
    ).toFixed(2);
  }
  function getTotalVendido() {
    var filteredArr = info;
    filteredArr = filteredArr.filter((x) => x.contrato.status == "ASSINADO");
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) =>
          x[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }

    if (filters.regionalFilter != "GERAL") {
      if (!filteredArr) filteredArr = info;
      filteredArr = filteredArr.filter(
        (x) => x.regional == filters.regionalFilter
      );
    }
    var totalSum = 0;
    for (var i = 0; i < filteredArr.length; i++) {
      let projeto = !isNaN(filteredArr[i].sistema?.valorProjeto)
        ? filteredArr[i].sistema.valorProjeto
        : 0;
      let padrao = !isNaN(filteredArr[i].padrao?.valor)
        ? filteredArr[i].padrao?.valor
        : 0;
      let estrutura = !isNaN(filteredArr[i].estruturaPersonalizada?.valor)
        ? filteredArr[i].estruturaPersonalizada.valor
        : 0;
      totalSum =
        Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura);
    }
    return {
      total: totalSum,
      ticketMedio: totalSum / filteredArr.length,
      vendas: filteredArr.length,
    };
  }
  useEffect(() => {
    if (credentials) {
      if (credentials.manager == true) {
        getInfo();
      } else {
        router.push("/");
      }
    }
  }, []);
  console.log(filters);
  if (credentials.manager == true)
    return (
      <div className="grow p-6 flex flex-col gap-2">
        <div className="flex flex-col items-center border-b border-gray-200 py-2">
          <h1 className="text-2xl font-bold text-[#15599a] font-raleway">
            RESULTADOS AMPÈRE
          </h1>
          <div className="flex items-center justify-around gap-2 py-2">
            <Select
              isMulti
              placeholder="VENDEDORES"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  vendedorFilter: e.map((x) => x.value),
                })
              }
              options={vendedores.map((vendedor) => {
                return { label: vendedor.nome, value: vendedor.nome };
              })}
            />
            <Select
              isMulti
              placeholder="CIDADES"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  cidadeFilter: e.map((x) => x.value),
                })
              }
              options={cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade };
              })}
            />
            <select
              value={filters.regionalFilter}
              onChange={(e) =>
                setFilters({ ...filters, regionalFilter: e.target.value })
              }
              className="outline-none h-[36px] p-2 rounded-sm border border-gray-200 text-gray-600 font-semibold text-center"
            >
              <option value={"GERAL"}>GERAL</option>
              <option value={"REGIONAL ITUIUTABA"}>REGIONAL ITUIUTABA</option>
              <option value={"REGIONAL UBERLÂNDIA"}>REGIONAL UBERLÂNDIA</option>
            </select>
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
                  {
                    label: "DATA DO PARECER",
                    value: "parecer.dataParecerDeAcesso",
                  },
                  { label: "ASS.CONTRATO", value: "contrato.dataAssinatura" },
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
          </div>
        </div>
        <div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
          <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">Obras finalizadas</h1>
            </div>
            <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
              {getObrasFinalizadas()} obras
            </p>
          </div>
          <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">
                Potência Pico instalada
              </h1>
            </div>
            <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
              {getPotenciaInstalada()} kWp
            </p>
          </div>
          <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">
                Potência Pico homologada
              </h1>
            </div>
            <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
              {getPotenciaHomologada()} kWp
            </p>
          </div>
          <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">
                TEMPO MÉDIO PARA INSTALAÇÃO
              </h1>
            </div>
            <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
              {getTempoMedioDeInstalacao()} dias
            </p>
          </div>
          <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">
                TEMPO MÉDIO DE APROVAÇÃO
              </h1>
            </div>
            <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
              {getTempoMedioDeAprovacao()} dias
            </p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-x-3">
          <div className="flex flex-col col-span- p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">Nº DE VENDAS</h1>
            </div>
            <p className="grow text-2xl font-bold text-[#15599a] flex items-center justify-center">
              {getTotalVendido().vendas}
            </p>
          </div>
          <div className="flex flex-col col-span- p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">Potência Pico Vendida</h1>
            </div>
            <p className="grow text-2xl font-bold text-[#15599a] flex items-center justify-center">
              {getPotenciaVendida()} kWp
            </p>
          </div>
          <div className="flex flex-col col-span-1 p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">TOTAL VENDIDO</h1>
            </div>
            <p className="grow text-2xl font-bold text-[#15599a] flex items-center justify-center">
              R$ {getTotalVendido().total.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="flex flex-col col-span-1 p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">TICKET MÉDIO</h1>
            </div>
            <p className="grow text-2xl font-bold text-[#15599a] flex items-center justify-center">
              R$ {getTotalVendido().ticketMedio.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="flex flex-col p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl col-span-1">
            <h1 className="text-gray-600 text-xl text-center">NPS</h1>
            <div className="flex grow items-center justify-center">
              <div className="w-[150px] h-[150px]">
                <CircularProgressbar
                  styles={buildStyles({
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: "butt",
                    // Text size
                    textSize: "12px",
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',

                    // Colors
                    pathColor: `#15599a`,
                    textColor: "#15599a",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                  value={Number(getNps())}
                  text={`${getNps()}%`}
                  strokeWidth={6}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Acompanhamento;
