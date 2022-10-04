import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../../utils/assinatura.jpg";
import Logo from "../../utils/whitelogo.png";
import connectToDatabase from "../../utils/projectsDb";
import { ObjectId } from "mongodb";
function osPDF({ info }) {
  console.log(info);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/serviceOrder">
            <div className="flex justify-center items-center">
              <Image height="100px" width="100px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">
              AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME
            </p>
            <p className="text-center font-bold">
              CNPJ <br />
              27.901.968/0001-45
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2">ID do Projeto</p>
            <p className="text-center pr-2">{info._id}</p>
          </div>
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2">DATA DE ABERTURA</p>
            <p className="text-center pr-2">
              {new Date().toLocaleDateString()}
            </p>
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
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">DADOS DO SISTEMA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Topologia:
              </p>
              <p className="text-xs col-span-3 text-center border border-black">
                {info.topologia}
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                NºMódulos:
              </p>
              <p className="text-xs text-center col-span-3 text-center border border-black border-t-0">
                {info.nmodulos}
              </p>
            </div>
            <div className="row-span-3 grid grid-cols-5 min-h-[80px]">
              <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                Obs. Estrutura
              </p>
              <p className="flex items-center justify-center text-xs col-span-3 border border-black border-t-0">
                {info.obsestrutura}
              </p>
            </div>
          </div>
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Micro/Inversor
              </p>
              <p className="text-xs col-span-3 w-48 text-center border border-black">
                DEYE 1.5K
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Módulo
              </p>
              <p className="text-xs col-span-3 w-48 text-center border border-black border-t-0">
                JINKO 450W
              </p>
            </div>
            <div className="row-span-3 grid grid-cols-5 ">
              <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                Cabos
              </p>
              <p className="flex items-center justify-center text-xs col-span-3 text-center border border-black border-t-0">
                {info.cabo ? `${info.qtdecabo} metros` : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">INFORMAÇÕES PARA OBRA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-2 min-h-[65px]">
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-xs font-semibold text-center">
                DESLIGAMENTO REMOTO
              </p>
              <p className="col-span-3 text-xs text-center border border-black">
                SIM
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold">
                TROCA DE KIT
              </p>
              <div className="flex text-xs justify-center items-center col-span-3 border border-black border-t-0">
                NÃO HOUVE
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 min-h-[65px]">
            <div className="grid grid-cols-5">
              <p className="text-center text-xs col-span-2 font-semibold">
                TIPO DE TELHA:
              </p>
              <p className="col-span-3 text-xs text-center border border-black">
                {info.tipotelha ? info.tipotelha : "-"}
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="text-center text-xs col-span-2 font-semibold text-center">
                TIPO DE ESTRUTURA:
              </p>
              <div className="flex text-xs justify-center items-center col-span-3 border border-black border-t-0">
                {info.tipoestrutura && info.tipoestrutura}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center  font-bold py-2">OBSERVAÇÕES DA OBRA</h1>
        <div className="flex justify-center h-[120px] items-center">
          <p className="text-xs text-center">{info.obsobra && info.obsobra}</p>
        </div>
      </div>
      <div className="border border-black mt-3 px-4 pb-4">
        <h1 className="text-center font-bold py-2">
          CONFERÊNCIA DOS CHECKLIST
        </h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs">CONFIGURAÇÃO DO SISTEMA FEITA ?</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs">FOTOS DA INSTALAÇÃO NO GRUPO DE OBRA ?</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs text-center pl-2">
                TERMO DE RECEBIMENTO DE OBRA
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-start">Autorizado por:</p>
            <div className="w-[150px] flex justify-center  items-centertext-center">
              <Image src={Assinatura} />
            </div>
            <hr className="border-t-2 border-black" />
            <p>ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-start">Realizado por:</p>
            <hr className="mt-12 border-t-2 border-black" />
            <p>ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;

  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("data");
  let os = await collection.findOne({
    _id: ObjectId("632b17dd617f2a57396451cc"),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}

export default osPDF;
