import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../utils/assinatura.jpg";
import Logo from "../utils/whitelogo.png";
function ServiceOrderPDF({ info, openingDate, urgency, kitInfo }) {
  console.log(info.tipotelha);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/obras">
            <div className="flex justify-center items-center">
              <Image height="60px" width="60px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">
              AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2">DATA DE ABERTURA</p>
            <p className="text-center pr-2">
              {openingDate ? openingDate : "-"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-end pr-2">GRAU DE URGÊNCIA</p>
            <p className="text-center pr-2">{urgency}</p>
          </div>
        </div>
      </div>
      <div className="border border-black mt-4">
        <h1 className="text-center my-2 font-bold">DADOS DO CLIENTE</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Nome:</p>
              <p className="text-xs col-span-3 text-center border border-black">
                {info.nomedocontrato}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Endereço:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">
                {info.logradouro}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Telefone:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">
                {info.telefone}
              </p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Bairro:</p>
              <p className="text-xs col-span-3 text-center border border-black">
                {info.bairro}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Número:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">
                {info.numerores}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Cidade:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">
                {info.cidade}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-3">
        <h1 className="text-center my-2 font-bold">DADOS INSTALAÇÃO</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Topologia:
              </p>
              <p className="text-xs col-span-3 text-center border border-black">
                {info.topologia} ({info.qtdepotinversor})
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Módulos:
              </p>
              <p className="text-xs text-center col-span-3 text-center border border-black border-t-0">
                {info.nmodulos ? info.nmodulos : "-"} -{" "}
                {info.potmodulos ? info.potmodulos : "-"}W
              </p>
            </div>
            <div className="row-span-3 grid grid-cols-5 min-h-[80px]">
              <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                KIT SOLAR
              </p>
              <div className="flex items-center justify-center text-xs col-span-3 border border-black border-t-0">
                {kitInfo ? (
                  <div className="text-xs font-bold text-center">
                    {kitInfo
                      ? kitInfo
                          .split("/")
                          .map((string, index) => <li key={index}>{string}</li>)
                      : false}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="grid grid-rows-2 min-h-[65px]">
              <div className="row-span-3 grid grid-cols-5 min-h-[80px]">
                <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                  OBS.COMERCIAL
                </p>
                <p className="flex items-center justify-center text-center text-xs col-span-3 border border-black border-t-0">
                  {info.obscomercial ? info.obscomercial : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-6">
            <div className="row-span-4 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center w-32 font-semibold uppercase">
                MATERIAL DO ESCRITÓRIO
              </p>
              <div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black">
                {info.estruturafaltando ? (
                  <div className="text-xs font-bold text-center">
                    {info.estruturafaltando
                      ? info.estruturafaltando
                          .split("/")
                          .map((string, index) => <li key={index}>{string}</li>)
                      : false}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="row-span-1 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center font-semibold uppercase">
                TIPO DE TELHA
              </p>
              <div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black border-y-0">
                <div>{info.tipotelha ? info.tipotelha : "-"}</div>
              </div>
            </div>
            <div className="row-span-1 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center font-semibold uppercase">
                TIPO DE ESTRUTURA
              </p>
              <div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black">
                <div>{info.tipoestrutura ? info.tipoestrutura : "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-3">
        <h1 className="text-center  font-bold pt-1">OBSERVAÇÕES DA OBRA/OS</h1>
        <div className="flex justify-center min-h-[100px] items-center">
          {info.obsobra ? (
            <div
              className={`${
                info.obsobra.length > 370 ? "text-xxs" : "text-xs"
              } px-2 my-2 font-bold text-center`}
            >
              {info.obsobra
                ? info.obsobra
                    .split("/")
                    .map((string, index) => <li key={index}>{string}</li>)
                : false}
            </div>
          ) : (
            <p className="my-2">SEM OBSERVAÇÕES</p>
          )}
        </div>
      </div>
      <div className="border border-black mt-3 px-4 pb-4">
        <h1 className="text-center font-bold py-2">
          CONFERÊNCIA DOS CHECKLIST
        </h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">CONFIGURAÇÃO DO SISTEMA FEITA ?</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">FOTOS DA INSTALAÇÃO NO GRUPO DE OBRA ?</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs text-center pl-2">
                TERMO DE RECEBIMENTO DE OBRA
              </p>
            </div>
            <div className="flex mt-2 gap-x-2 items-center uppercase">
              <p className="text-xs">Data execução:</p>
              <p>____/____/_____</p>
            </div>
          </div>
        </div>
        <div className="mt-1 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-xs text-start">Autorizado por:</p>
            <div className="w-[150px] flex justify-center  items-centertext-center">
              <Image src={Assinatura} />
            </div>
            <hr className="border-t-2 border-black" />
            <p className="text-xs text-center">
              ASSINATURA DIRETOR DE ENGENHARIA
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-start">Realizado por:</p>
            <hr className="mt-12 border-t-2 border-black" />
            <p className="text-xs text-center">
              ASSINATURA TÉCNICO RESPONSÁVEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceOrderPDF;
