import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../../../../utils/assinatura.jpg";
import Logo from "../../../../utils/whitelogo.png";
import connectToDatabase2 from "../../../../utils/ossDb";
import { ObjectId } from "mongodb";
function osPDF({ info }) {
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/o&m/serviceOrder">
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
            <p className="text-end pr-2">ID da O.S</p>
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
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">DADOS DO CLIENTE</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Nome:</p>
              <p className="col-span-3 text-center border border-black">
                {info.generalInfos.clientName}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Endereço:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.generalInfos.address}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Telefone:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.generalInfos.cellPhoneNumber
                  ? info.generalInfos.cellPhoneNumber
                  : "-"}
              </p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Bairro:</p>
              <p className="col-span-3 text-center border border-black">
                {info.generalInfos.district}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Número:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.generalInfos.number}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Cidade:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.generalInfos.city}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">DADOS DO SISTEMA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-2">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Topologia:</p>
              <p className="col-span-3 text-center border border-black">
                {info.osInfos.topology}
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">NºMódulos:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.osInfos.modulesQty}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Marca/Modelo:</p>
              <p className="col-span-3 w-48 text-center border border-black">
                {info.osInfos.inverterModel}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">INFORMAÇÕES PARA OBRA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3 gap-y-px">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">CONFIGURAR?:</p>
              <p className="col-span-3 text-center border border-black">
                {info.osInfos.configureInverter == "true" ? "Sim" : "Não"}
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="text-center col-span-2 font-semibold">
                PONTO DE ÁGUA:
              </p>
              <div className="flex justify-center items-center col-span-3 border border-black border-t-0">
                {info.osInfos.waterPoint}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">SENHA DO WI-FI:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.osInfos.wifiPassword}
              </p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">TIPO DE TELHA:</p>
              <p className="col-span-3 text-center border border-black">
                {info.osInfos.tileType}
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold text-center">
                TIPO DE ESTRUTURA:
              </p>
              <div className="flex justify-center items-center col-span-3 border border-black border-t-0">
                {info.osInfos.structureType}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-center font-semibold">TRAFO?:</p>
              <p className="col-span-3 text-center border border-black border-t-0">
                {info.osInfos.trafo == "true" ? "Sim" : "Não"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center font-bold py-2">SERVIÇO A SER EXECUTADO</h1>
        <div className="flex justify-center h-[120px] items-center">
          <p>{info.osInfos.serviceToBeDone}</p>
        </div>
      </div>
      <div className="border border-black mt-6 px-4 pb-4">
        <h1 className="text-center font-bold py-2">
          CONFERÊNCIA DOS CHECKLIST
        </h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p>https://forms.gle/FTvLg1Eey2xzPqL37</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p>CHECKLIST DE MATERIAL</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-center">
                TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA
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

  const db = await connectToDatabase2(process.env.DB_KEY);
  const collection = db.collection("data");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}
export default osPDF;
