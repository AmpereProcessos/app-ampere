import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { AppContext } from "../../context/AppContext";

function Acompanhamento() {
  const { crendetials, setCredentials } = useContext(AppContext);
  const [info, setInfo] = useState([]);
  const [dateFilter, setDateFilter] = useState({ after: null, before: null });
  function getInfo() {
    axios.get("/api/report").then((res) => setInfo(res.data));
  }
  function getPotenciaVendida() {
    var filteredArr = info;
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.contrato.dataAssinatura >= dateFilter.after &&
          x.contrato.dataAssinatura <= dateFilter.before
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
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.parecer.statusDoParecerDeAcesso >= dateFilter.after &&
          x.parecer.statusDoParecerDeAcesso <= dateFilter.before
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
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
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
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
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
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
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
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
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
  function getNps() {
    var filteredArr = info;
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
      );
    }
    let promotores = filteredArr.filter((x) => x.nps >= 9);
    let detratores = filteredArr.filter((x) => x.nps != null && x.nps <= 6);
    let consultasTotais = filteredArr.filter(
      (x) => x.nps != null && x.nps >= 0 && x.nps <= 10
    );
    console.log("promotores", promotores.length);
    console.log(detratores, detratores.length);
    console.log("consultasTotais", consultasTotais.length);
    return (
      ((promotores.length - detratores.length) * 100) /
      consultasTotais.length
    ).toFixed(2);
  }
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="grow p-6 flex flex-col gap-2">
      <div className="flex flex-col items-center border-b border-gray-200 py-2">
        <h1 className="text-2xl font-bold text-[#fead61]">RESULTADOS AMPÈRE</h1>
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
            <h1 className="uppercase text-gray-600">Potência Pico instalada</h1>
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
            <h1 className="uppercase text-gray-600">TEMPO MÉDIO PARA COMPRA</h1>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {getTempoMedioDeCompra()} dias
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
      <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-2">
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
                pathColor: `#fead61`,
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
  );
}

export default Acompanhamento;
