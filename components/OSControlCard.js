import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import OSBlock from "./OSBlock";
function OSControlCard({ info, reload, emAberto, categoria }) {
  const [os, setOs] = useState(info);
  function handleChange(id, index, fechamento) {
    axios
      .put("/api/ordensDeServico", {
        id: id,
        index: index,
        fechamento: fechamento,
      })
      .then((res) => console.log(res));
  }
  return (
    <div className="flex flex-col p-2 border border-blue-300 rounded shadow-lg">
      <div className="flex justify-around border-b border-gray-200 pb-2">
        <h1 className="font-bold text-[#15599a]">
          {os.qtde} - {os.nomeDoContrato}
        </h1>
        <p className="font-raleway text-sm text-gray-500">
          CIDADE: {os.cidade ? os.cidade : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-sm text-gray-500">
          LOGRADOURO: {os.logradouro ? os.logradouro : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-sm text-gray-500">
          BAIRRO: {os.bairro ? os.bairro : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-sm text-gray-500">
          Nº: {os.numeroResidencia ? os.numeroResidencia : "-"}
        </p>
      </div>
      {os.ordensDeServico?.map((ordem, index) => (
        <OSBlock
          key={index}
          ordem={ordem}
          index={index}
          emAberto={emAberto}
          categoria={categoria}
          info={info}
          setOs={setOs}
          os={os}
        />
      ))}
    </div>
  );
}

export default OSControlCard;
