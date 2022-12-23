import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
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
    console.log(sum);
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
    console.log(sum);
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
    console.log(sum);
    return sum.toFixed(2);
  }
  function getObrasFinalizadas() {
    var filteredArr = info;
    console.log(filteredArr);
    filteredArr = filteredArr.filter(
      (x) => x.obra?.statusDaObra == "CONCLUIDA"
    );
    console.log(filteredArr);
    if (dateFilter.after && dateFilter.before) {
      filteredArr = filteredArr.filter(
        (x) =>
          x.obra.saida >= dateFilter.after && x.obra.saida <= dateFilter.before
      );
    }
    return filteredArr.length;
  }
  function getTempoMedioDeAprovacao() {}
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="grow p-6 flex flex-col gap-2">
      <h1>{getPotenciaVendida()}kWp vendidos</h1>
      <h1>{getPotenciaHomologada()}kWp homologado</h1>
      <h1>{getPotenciaInstalada()}kWp instalada</h1>
      <h1>{getObrasFinalizadas()} obras finalizadas</h1>
    </div>
  );
}

export default Acompanhamento;
