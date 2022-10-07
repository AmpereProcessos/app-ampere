import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../../utils/assinatura.jpg";
import Logo from "../../utils/whitelogo.png";
import connectToDatabase from "../../utils/projectsDb";
import { ObjectId } from "mongodb";
function osPDF({ info }) {
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/">
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
            <p className="text-end pr-2">ID do Projeto</p>
            <p className="text-center pr-2">{info._id}</p>
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
                KIT SOLAR
              </p>
              <div className="flex items-center justify-center text-xs col-span-3 border border-black border-t-0">
                {info.estruturafaltando && (
                  <div className="text-xxs font-bold text-center">
                    {info.estruturafaltando
                      ? info.estruturafaltando
                          .split("/")
                          .map((string) => <li>{string}</li>)
                      : false}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Micro/Inversor
              </p>
              <p className="text-xs col-span-3 w-48 text-center border border-black">
                -
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">
                Módulo
              </p>
              <p className="text-xs col-span-3 w-48 text-center border border-black border-t-0">
                -
              </p>
            </div>
            <div className="grid grid-rows-2 row-span-3">
              <div className="row-auto grid grid-cols-5 ">
                <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                  Cabos
                </p>
                <p className="flex items-center justify-center text-xs col-span-3 text-center border border-black border-t-0">
                  {info.qtdecabo ? `${info.qtdecabo} metros` : "-"}
                </p>
              </div>
              <div className="row-auto grid grid-cols-5 ">
                <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                  Conectores
                </p>
                <p className="flex items-center justify-center text-xs col-span-3 text-center border border-black border-t-0">
                  -
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">INFORMAÇÕES PARA OBRA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-2 min-h-[65px]">
            <div className="row-span-3 grid grid-cols-5 min-h-[80px]">
              <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">
                OBS.COMERCIAL
              </p>
              <p className="flex items-center justify-center text-center text-xs col-span-3 border border-black">
                {info.obscomercial ? info.obscomercial : "-"}
              </p>
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
        <h1 className="text-center  font-bold pt-1">OBSERVAÇÕES DA OBRA</h1>
        <div className="flex justify-center items-center">
          {info.obsobra && (
            <div className="text-xxs font-bold text-center">
              {info.obsobra ? info.obsobra : false}
            </div>
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
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs">CONFIGURAÇÃO DO SISTEMA FEITA ?</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs">FOTOS DA INSTALAÇÃO NO GRUPO DE OBRA ?</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex">
              <div className="w-6 h-6 border rounded-md border-black"></div>
              <p className="text-xs text-center pl-2">
                TERMO DE RECEBIMENTO DE OBRA
              </p>
            </div>
            <div className="mt-2 uppercase">Data execução: ____/____/_____</div>
          </div>
        </div>
        <div className="mt-2 grid gap-x-4 grid-cols-2">
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
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}

export default osPDF;
