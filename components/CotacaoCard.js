import dayjs from "dayjs";
import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
function CotacaoCard({ info }) {
  const [infoHolder, setInfoHolder] = useState(info);
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
  return (
    <div className="flex flex-col w-full p-2 rounded border border-[#15599a]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-gray-500 font-bold text-md">
            {infoHolder.dataDeCotacao
              ? dayjs(infoHolder.dataDeCotacao)
                  .add(4, "hours")
                  .format("DD/MM/YYYY")
              : null}
          </h1>
          <h1 className="text-[#15599a] font-bold text-xl">
            {infoHolder.fornecedor}
          </h1>
          <h1 className="text-green-500 font-bold">
            {infoHolder.potPico?.toFixed(2).replace(".", ",")} kWp
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-[#15599a] font-bold">
            R$ {infoHolder.valorDoKit.toFixed(2).replace(".", ",")}
          </h1>
          {dropdownMenuVisible ? (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(false)}
              />
            </div>
          ) : (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(true)}
              />
            </div>
          )}
        </div>
      </div>
      {dropdownMenuVisible ? (
        <div className="flex justify-around mt-2 border-t border-gray-200 pt-2">
          {infoHolder.modulos ? (
            <div className="flex flex-col">
              <h1 className="text-center text-[#15599a] font-bold">MÓDULOS</h1>
              {infoHolder.modulos.map((modulo, index) => (
                <h1 key={index} className="text-gray-500">
                  ({modulo.qtde}) {modulo.marca} - {modulo.modelo}
                </h1>
              ))}
            </div>
          ) : null}
          {infoHolder.inversores ? (
            <div className="flex flex-col">
              <h1 className="text-center text-[#15599a] font-bold">
                INVERSORES
              </h1>
              {infoHolder.inversores.map((inversor, index) => (
                <h1 key={index} className="text-gray-500">
                  ({inversor.qtde}) {inversor.marca} - {inversor.modelo}
                </h1>
              ))}
            </div>
          ) : null}
          {infoHolder.componentes ? (
            <div className="flex flex-col">
              <h1 className="text-center text-[#15599a] font-bold">
                INVERSORES
              </h1>
              {infoHolder.componentes.map((componente, index) => (
                <h1 key={index} className="text-gray-500">
                  ({componente.qtde}) {componente.insumo} -{" "}
                  {`[ ${componente.tipo} ]`}
                </h1>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default CotacaoCard;
