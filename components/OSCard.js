import axios from "axios";
import React, { useState } from "react";

function OSCard({ info, reload }) {
  const [os, setOs] = useState(info);
  function handleChange(id, index, status, date) {
    console.log(os);
    axios
      .post("/api/ordensDeServico/realizarCobranca", {
        id: id,
        index: index,
        status: status,
        date: date,
      })
      .then((res) => reload());
  }
  return (
    <div className="flex flex-col p-2 border border-blue-300 rounded shadow-lg">
      <div className="flex justify-around border-b border-gray-200 pb-2">
        <h1 className="font-bold text-[#15599a]">
          {os.qtde} - {os.nomeDoContrato}
        </h1>
        <p className="font-raleway text-sm text-gray-500">
          TELEFONE: {os.telefone ? os.telefone : "-"}
        </p>
        <p className="font-raleway text-sm text-gray-500">
          CONTATO (PAGADOR):{" "}
          {os.pagamento?.contatoPagador ? os.pagamento?.contatoPagador : "-"}
        </p>
      </div>
      {os.ordensDeServico?.map((ordem, index) => {
        if (ordem.cobrancaRealizada == false) {
          return (
            <div
              key={index}
              className={`flex mt-1 ${
                ordem.dataDeFechamento == undefined && "hidden"
              } items-center justify-around border-b border-gray-200 pb-2`}
            >
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">SERVIÇO PARA EXECUÇÃO</p>
                <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">REALIZAR COBRANÇA?</p>
                <p className="text-xs uppercase">
                  {ordem.realizarCobranca ? "SIM" : "NÃO"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">VALOR DA COBRANÇA</p>
                <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">EMISSOR DA OS</p>
                <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">DATA DE ABERTURA</p>
                <p className="text-xs uppercase">
                  {new Date(ordem.dataDeAbertura).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase text-gray-500">DATA DE FECHAMENTO</p>
                <p className="text-xs uppercase">
                  {ordem.dataDeFechamento != undefined
                    ? new Date(
                        new Date(ordem.dataDeFechamento).setHours(27)
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div
                className={`flex flex-col items-center ${
                  ordem.cobrancaRealizada != true
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                <p className="uppercase">DATA DE COBRANÇA</p>
                <input
                  type="date"
                  className="bg-transparent text-xs"
                  value={
                    ordem.dataDeCobranca
                      ? new Date(ordem.dataDeCobranca)
                          .toISOString()
                          .slice(0, 10)
                      : null
                  }
                  onChange={(e) => {
                    setOs((prevState) => {
                      let temp = {
                        ...prevState,
                        ordensDeServico: [...prevState.ordensDeServico],
                      };
                      temp.ordensDeServico[index].cobrancaRealizada = true;
                      temp.ordensDeServico[index].dataDeCobranca = new Date(
                        e.target.value
                      )
                        .toISOString()
                        .slice(0, 10);
                      return temp;
                    });
                    handleChange(os._id, index, true, new Date(e.target.value));
                  }}
                />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default OSCard;
