import React from "react";
import Image from "next/image";
import Logo from "../../../../../utils/whitelogoHD.png";
function LaudoTecnicoUrbano() {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border-b border-black py-2">
          <h1 className="font-bold uppercase text-[#15599a]">
            LAUDO TÉCNICO - URBANO
          </h1>
          <div className="w-[55px] h-[55px]">
            <Image style={{ width: "55px", height: "55px" }} src={Logo} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center font-bold">
            CADASTRO
          </h1>
          <div className="flex">
            <div className="grid grid-rows-6 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">CLIENTE</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">REPRESENTANTE</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">ENDEREÇO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">BAIRRO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">DATA DA VISITA</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">TIPO DE SOLICITAÇÃO</p>
                <p className="text-center text-sm">-</p>
              </div>
            </div>
            <div className="grid grid-rows-6 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">TELEFONE</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">Nº DE PROJETO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">NÚMERO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">MUNICÍPIO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">PRAZO LAUDO</p>
                <p className="text-center text-sm">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-sm">TIPO DE LAUDO</p>
                <p className="text-center text-sm">-</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center font-bold">
            ESTRUTURA FOTOVOLTAICA
          </h1>
          <div className="flex">
            <div className="w-[20%] h-full flex justify-center items-center bg-[#15599a] text-center text-white font-bold">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="w-[80%] flex flex-col">
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                INVERSORES
              </h1>
              <div className="flex border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">TOPOLOGIA</p>
                    <p className="text-center text-xs">-</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs">-</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">
                      MARCA DO INVERSOR
                    </p>
                    <p className="text-center text-xs">-</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">POTÊNCIA</p>
                    <p className="text-center text-xs">-</p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs">-</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs">POTÊNCIA</p>
                    <p className="text-center text-xs">-</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xs w-[50%]">
                  MARCA DOS MÓDULOS
                </p>
                <p className="text-center text-xs w-[50%]">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaudoTecnicoUrbano;
