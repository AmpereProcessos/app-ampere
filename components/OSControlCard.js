import React, { useState } from "react";

function OSControlCard({ info, reload }) {
  const [os, setOs] = useState(info);
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
      {os.ordensDeServico?.map((ordem, index) => (
        <div
          key={index}
          className={`grid grid-cols-7 border-b border-gray-200 pb-2`}
        >
          <div className="flex flex-col items-center">
            <p className="uppercase text-gray-500">CATEGORIA DA OS</p>
            <p className="text-xs uppercase">
              {ordem.categoria ? ordem.categoria : "-"}
            </p>
          </div>
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
            <p className="text-xs uppercase">-</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OSControlCard;
