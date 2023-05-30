import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import FileLinkBlock from "../components/utils/FileLinkBlock";
function getContractValue(valorProjeto, valorPadrao, valorEstrutura) {
  var totalSum = 0;

  let projeto = !isNaN(valorProjeto) ? valorProjeto : 0;
  let padrao = !isNaN(valorPadrao) ? valorPadrao : 0;
  let estrutura = !isNaN(valorEstrutura) ? valorEstrutura : 0;
  totalSum =
    Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura);
  return totalSum;
}
function AnaliseBlock({ project }) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  return (
    <div className="flex flex-col w-full p-1 border border-gray-200">
      <div className="w-full grid grid-cols-8 items-center">
        <div className="flex items-center gap-2 col-span-2">
          {showAdditionalInfo ? (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropupCircle
                style={{ fontSize: "15px" }}
                onClick={() => setShowAdditionalInfo(false)}
              />
            </div>
          ) : (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "15px" }}
                onClick={() => setShowAdditionalInfo(true)}
              />
            </div>
          )}
          <div className="text-sm gap-2 flex items-center">
            <strong className="text-[#fead61]">({project.codigoSVB})</strong>
            {project.nomeDoContrato}{" "}
            <strong className="text-[#15599a]">{project.qtde}</strong> -{" "}
          </div>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">TIPO DE SERVIÇO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            {project.tipoDeServico}
          </h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">POTÊNCIA PICO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            {project.sistema?.potPico}kWp
          </h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">
            VALOR DO PROJETO
          </h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            R${" "}
            {Number(project.sistema?.valorProjeto).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">VALOR DO PADRÃO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            R${" "}
            {Number(project.padrao?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">
            VALOR DA ESTRUTURA
          </h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            R${" "}
            {Number(project.estruturaPersonalizada?.valor).toLocaleString(
              "pt-br",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">
            VALOR DO CONTRATO
          </h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">
            R${" "}
            {getContractValue(
              project.sistema?.valorProjeto,
              project.padrao?.valor,
              project.estruturaPersonalizada?.valor
            ).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
      {showAdditionalInfo ? (
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">CPF/CNPJ</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">
                {project.cpfCnpj ? project.cpfCnpj : "-"}
              </h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">CIDADE</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">
                {project.cidade ? project.cidade : "-"}
              </h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">BAIRRO</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">
                {project.bairro ? project.bairro : "-"}
              </h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">LOGRADOURO</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">
                {project.logradouro ? project.logradouro : "-"}
              </h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">Nº</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">
                {project.numeroResidencia ? project.numeroResidencia : "-"}
              </h1>
            </div>
          </div>
          {project.links && (
            <div className="flex justify-center gap-2 gap-y-4 mt-3 flex-wrap">
              {Object.keys(project.links).map((category, index) =>
                project.links[category]?.length > 0 ? (
                  <div
                    key={index}
                    className="flex flex-col w-full lg:w-[45%] p-1 shadow-sm"
                  >
                    <h1 className="font-bold text-center text-green-500">
                      {category.toUpperCase()}
                    </h1>
                    <div className="flex flex-col items-center gap-1">
                      {project.links[category].map((obj, index2) => (
                        <FileLinkBlock
                          key={index2}
                          obj={obj}
                          deleteFile={(obj) =>
                            alert(
                              "Exclusão de arquivos não permitida nessa área."
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default AnaliseBlock;
