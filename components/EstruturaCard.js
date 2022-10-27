import axios from "axios";
import React, { useState } from "react";

function EstruturaCard({ project }) {
  const [changes, setChanges] = useState({
    "estruturaPersonalizada.dataMontagem":
      project.estruturaPersonalizada.dataMontagem,
    "estruturaPersonalizada.pagTerceiro":
      project.estruturaPersonalizada.pagTerceiro,
  });
  function handleChanges(mudancas) {
    console.log(mudancas);
  }
  return (
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col justify-center items-center">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="font-bold text-center">{project.nomeDoContrato}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center grow justify-around">
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              PAGAMENTO DO KIT
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusLiberacao}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              LOGRADOURO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.logradouro}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">
              {project.numeroResidencia}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              DATA ASS.DOCUMENTAÇÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.projeto?.dataAssDocumentacao
                ? new Date(
                    project.projeto.dataAssDocumentacao
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              TIPO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.tipo
                ? project.estruturaPersonalizada?.tipo
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              RESP.PAGAMENTO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.respPagamento
                ? project.estruturaPersonalizada?.respPagamento
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              VALOR DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.valor
                ? project.estruturaPersonalizada?.valor
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              NºModulos
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.sistema.qtdeModulos ? project.sistema.qtdeModulos : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around mt-2">
        <div className="flex flex-col">
          <h1 className="font-bold">DIA DA MONTAGEM</h1>
          <input
            type="date"
            value={
              changes["projeto.fechamentoAC"]
                ? new Date(changes["projeto.fechamentoAC"])
                    .toISOString()
                    .slice(0, 10)
                : null
            }
            onChange={(e) => {
              handleChanges({
                "estruturaPersonalizada.dataMontagem": new Date(e.target.value),
              });
              setChanges({
                ...changes,
                "estruturaPersonalizada.dataMontagem": new Date(e.target.value),
              });
            }}
          />
        </div>
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            PAGAMENTO TERCEIRO
          </span>
          <div className="flex">
            <input
              type="checkbox"
              name="projetoconcluido"
              id="projetoconcluido"
              onChange={(e) => {
                handleChanges({
                  "estruturaPersonalizada.pagTerceiro": e.target.checked,
                });
                setChanges({
                  ...changes,
                  "estruturaPersonalizada.pagTerceiro": true,
                });
              }}
            />
            <label className="ml-2" htmlFor="projetoconcluido">
              OK
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstruturaCard;
