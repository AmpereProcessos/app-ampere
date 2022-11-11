import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
function OSBlock({ ordem, index, emAberto, categoria, info, setOs, os }) {
  const [servicoExecutado, setServicoExecutado] = useState(
    ordem.servicoExecutado
  );
  const [dataDeFechamento, setDataDeFechamento] = useState(
    ordem.dataDeFechamento ? ordem.dataDeFechamento : null
  );
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
    <div
      className={`grid ${
        emAberto ? (ordem.dataDeFechamento != undefined ? "hidden" : "") : ""
      } ${
        !categoria.includes(ordem.categoria) ? "hidden" : ""
      } items-center grid-cols-4 lg:grid-cols-7 border-b border-gray-200 pb-2`}
    >
      <div className="flex flex-col items-center">
        <p className="text-xs uppercase text-gray-500">CATEGORIA DA OS</p>
        <p className="text-xs uppercase">
          {ordem.categoria ? ordem.categoria : "-"}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs uppercase text-gray-500">SERVIÇO PARA EXECUÇÃO</p>
        <input
          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
          value={servicoExecutado}
          onChange={(e) => setServicoExecutado(e.target.value)}
        />
      </div>
      <div className="flex-col items-center hidden lg:flex">
        <p className="text-xs uppercase text-gray-500">REALIZAR COBRANÇA?</p>
        <p className="text-xs uppercase">
          {ordem.realizarCobranca ? "SIM" : "NÃO"}
        </p>
      </div>
      <div className="flex-col items-center hidden lg:flex">
        <p className="text-xs uppercase text-gray-500">VALOR DA COBRANÇA</p>
        <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
      </div>
      <div className="flex-col items-center hidden lg:flex">
        <p className="text-xs uppercase text-gray-500">EMISSOR DA OS</p>
        <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs uppercase text-gray-500">DATA DE FECHAMENTO</p>

        <input
          type="date"
          value={
            dataDeFechamento
              ? new Date(dataDeFechamento).toISOString().slice(0, 10)
              : null
          }
          onChange={(e) => {
            /*
            setOs((prevState) => {
              let temp = {
                ...prevState,
                ordensDeServico: [...prevState.ordensDeServico],
              };
              temp.ordensDeServico[index].dataDeFechamento = new Date(
                e.target.value
              ).toISOString();
              return temp;
            });
            handleChange(os._id, index, new Date(e.target.value).toISOString());*/
            console.log(new Date(e.target.value).toISOString());
            handleChange(os._id, index, new Date(e.target.value).toISOString());
            setDataDeFechamento(new Date(e.target.value).toISOString());
          }}
          className="text-xxs font-bold outline-none bg-[#15599a] text-white p-1 rounded"
        />
      </div>
      <div className="flex items-center justify-center">
        <Link href={`/ordemDeServico/pdf/${info._id}?index=${index}`}>
          <button className="p-1 bg-[#fead61] font-bold rounded w-fit">
            VER
          </button>
        </Link>
      </div>
    </div>
  );
}

export default OSBlock;
