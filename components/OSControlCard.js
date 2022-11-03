import React, { useState } from "react";
import axios from "axios";
function OSControlCard({ info, reload, emAberto }) {
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
        <p className="font-raleway text-sm text-gray-500">
          LOGRADOURO: {os.logradouro ? os.logradouro : "-"}
        </p>
        <p className="font-raleway text-sm text-gray-500">
          BAIRRO: {os.bairro ? os.bairro : "-"}
        </p>
        <p className="font-raleway text-sm text-gray-500">
          Nº: {os.numeroResidencia ? os.numeroResidencia : "-"}
        </p>
      </div>
      {os.ordensDeServico?.map((ordem, index) => (
        <div
          key={index}
          className={`grid ${
            emAberto
              ? ordem.dataDeFechamento != undefined
                ? "hidden"
                : ""
              : ""
          } items-center grid-cols-7 border-b border-gray-200 pb-2`}
        >
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">CATEGORIA DA OS</p>
            <p className="text-xs uppercase">
              {ordem.categoria ? ordem.categoria : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">
              SERVIÇO PARA EXECUÇÃO
            </p>
            <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">
              REALIZAR COBRANÇA?
            </p>
            <p className="text-xs uppercase">
              {ordem.realizarCobranca ? "SIM" : "NÃO"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">VALOR DA COBRANÇA</p>
            <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">EMISSOR DA OS</p>
            <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">DATA DE ABERTURA</p>
            <p className="text-xs uppercase">
              {new Date(ordem.dataDeAbertura).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase text-gray-500">
              DATA DE FECHAMENTO
            </p>
            {ordem.dataDeFechamento == undefined ? (
              <input
                type="datetime-local"
                onChange={(e) => {
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
                  handleChange(
                    os._id,
                    index,
                    new Date(e.target.value).toISOString().slice(0, 10)
                  );
                }}
                className="text-xxs font-bold bg-[#15599a] w-fit text-white p-1 rounded"
              />
            ) : (
              <p>{new Date(ordem.dataDeFechamento).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OSControlCard;
