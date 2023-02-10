import React from "react";
function getServiceTypeTagColor(type) {
  var obj = {
    "SISTEMA FOTOVOLTAICO": {
      combination: "bg-[#15599a] text-[#fead61]",
    },
    "SISTEMA FOTOVOLTAICO (OFF GRID)": {
      combination: "bg-[#fead61] text-[#15599a]",
    },
    "BOMBA SOLAR": {
      combination: "bg-[#000066] text-white",
    },
    "OPERAÇÃO E MANUTENÇÃO": {
      combination: "bg-[#c40089] text-white",
    },
    "SUBESTAÇÃO DE ENERGIA": {
      combination: "bg-[#e6e6e6] text-[#15599a]",
    },
  };
  return obj[type] ? obj[type].combination : "bg-black text-white";
}
function TagTipoDeServico({ tipoDeServico }) {
  return (
    <div
      className={`${getServiceTypeTagColor(
        tipoDeServico
      )} text-xs font-bold text-center rounded-br-lg rounded-bl-lg`}
    >
      {tipoDeServico ? tipoDeServico : "NÃO DEFINIDO"}
    </div>
  );
}

export default TagTipoDeServico;
