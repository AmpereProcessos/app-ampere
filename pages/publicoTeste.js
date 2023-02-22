import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../utils/assinatura.jpg";
import Logo from "../utils/whitelogo.png";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
function Teste() {
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-center gap-2 mb-3">
        <button className="w-[60px] h-[31px] bg-gray-200"></button>
        <button className="w-[60px] h-[31px] bg-gray-200"></button>
        <button className="w-[60px] h-[31px] bg-gray-200"></button>
      </div>
      <div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="w-[226px] h-[24px] bg-gray-200"></h1>
          </div>
          <div className="grow flex items-center justify-center">
            <p className="w-[50px] h-[24px] bg-gray-200"></p>
          </div>
          <p className="w-[236px] h-[24px] bg-gray-200"></p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="w-[226px] h-[24px] bg-gray-200"></h1>
          </div>
          <div className="grow flex items-center justify-center">
            <p className="w-[50px] h-[24px] bg-gray-200"></p>
          </div>
          <p className="w-[236px] h-[24px] bg-gray-200"></p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="w-[226px] h-[24px] bg-gray-200"></h1>
          </div>
          <div className="grow flex items-center justify-center">
            <p className="w-[50px] h-[24px] bg-gray-200"></p>
          </div>
          <p className="w-[236px] h-[24px] bg-gray-200"></p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="w-[226px] h-[24px] bg-gray-200"></h1>
          </div>
          <div className="grow flex items-center justify-center">
            <p className="w-[50px] h-[24px] bg-gray-200"></p>
          </div>
          <p className="w-[236px] h-[24px] bg-gray-200"></p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="w-[226px] h-[24px] bg-gray-200"></h1>
          </div>
          <div className="grow flex items-center justify-center">
            <p className="w-[50px] h-[24px] bg-gray-200"></p>
          </div>
          <p className="w-[236px] h-[24px] bg-gray-200"></p>
        </div>
      </div>
      <div className="grid grid-rows-2 grid-cols-1 gap-y-2 mt-4 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-2">
          <div className="w-[234px] h-[30px] bg-gray-200"></div>
          <div className="flex grow items-center justify-center">
            <div className="w-[150px] h-[150px] rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-8">
          <div className="grid grid-cols-2 py-2">
            <h1 className="bg-gray-200 w-[635x] h-[36px]"></h1>
            <div className="flex items-center gap-x-2 justify-center">
              <p className="bg-gray-200 w-[44px] h-[36px]"> </p>
              <p className="bg-gray-200 w-[44px] h-[36px]"> </p>
              <p className="bg-gray-200 w-[44px] h-[36px]"> </p>
              <p className="bg-gray-200 w-[44px] h-[36px]"> </p>
            </div>
          </div>
          {/* <AreaChart
                width={550}
                height={300}
                data={statsData.graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey={"Total"}
                  domain={[0, statsData.maxGraphValue]}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Total"
                  strokeWidth={"1"}
                  stroke="#15599a"
                  fillOpacity={1}
                  fill="#15599a"
                />
              </AreaChart> */}
          <div className="w-full h-[300px] bg-gray-200"> </div>
        </div>
      </div>
      <div className="flex mt-4 grow flex-col p-4  border border-gray-200 bg-[#fff] shadow-xl">
        <div className="flex w-full items-center justify-between">
          <h1 className="bg-gray-200 w-[200px] h-[25px]"> </h1>
          <button
            onClick={() => filterBirthday(!filters.birthdayToday)}
            className="p-2 w-[205px] h-[42px] bg-gray-200"
          >
            {" "}
          </button>
        </div>
        <div className="w-full grow flex flex-wrap justify-between gap-y-2 mt-2">
          {[1, 2, 3, 4]?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-[350px] h-[60px] text-xs text-center bg-[#fff] border border-gray-200 p-2"
            >
              <p className="bg-gray-200 w-[50%] h-[20px] self-center"> </p>
              <p className="bg-gray-200 w-[50%] h-[20px] mt-2 self-center"> </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teste;
{
  /** 
    <div className="w-[21cm] h-[29.7cm] bg-zinc-200 p-4">
      <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
        <div className="absolute">
          {images.videoTeste ? (
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-400 font-normal text-center">
                {images.videoTeste.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-400 font-normal">
                Adicione o arquivo aqui...
              </span>
            </div>
          )}
        </div>
        <input
          onChange={(e) =>
            setImages({
              ...images,
              videoTeste: e.target.files[0],
            })
          }
          className="h-full w-full opacity-0"
          type="file"
          accept=".jpg"
        />
      </div>
      <button onClick={send} className="bg-black text-white p-2 rounded">
        ENVIAR
      </button>
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-2">
          <h1 className="text-xl font-bold text-[#15599b]">SEST SENAI</h1>
          <p className="text-xl font-bold">ITUIUTABA</p>
          <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
        <Link href="/oem/propostas">
          <div className="flex justify-center">
            <Image
              width="80px"
              height="80px"
              className="rounded-full cursor-pointer"
              src={Logo}
            />
          </div>
        </Link>
        <div className="col-span-2 place-self-end">
          <h1 className="text-xl font-bold">Atendido por:</h1>
          <p className="font-bold text-center">LEANDRO VIALI</p>
          <p className="font-bold">(34) 9 9775-7001</p>
        </div>
      </div>
      <div className="mt-5 border-2 border-black">
        <h1 className="text-xl w-full text-center bg-[#15599b] text-white font-semibold">
          ESCOPO DO PROJETO
        </h1>
        <div className="grid grid-cols-4 divide-x-2 divide-black">
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Qtd.Módulos - Potência
            </p>
            <p>380 - 335W</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Potência kWp
            </p>
            <p>127,3 kWp</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Eficiência atual
            </p>
            <p>-</p>
          </div>
          <div className="flex flex-col items-center border-r-2 border-black">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Estimativa de perda financeira anual
            </p>
            <p>-</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <h1 className="w-full text-center text-xl text-[#15599b] font-semibold">
          CONSEQUÊNCIAS DA FALTA DE MANUTENÇÃO
        </h1>
        <div className="flex justify-center">
          <ul className="font-semibold">
            <li>1. Perda de geração de energia e eficiência;</li>
            <li>
              2. Danificação e perda de vida útil dos modulos por criação de
              pontos de aquecimento;
            </li>
            <li>3. Redução da vida útil dos equipamentos elétricos;</li>
            <li>
              4. Riscos de falhas elétricas e mecânicas, ocasionando
              danificações e até possíveis incêndios;
            </li>
            <li>
              5. Falta de monitoramento e consequentemente o sistema ficar
              desconectado sem gerar energia;
            </li>
            <li>6. Perda da garantia de instalação do sistema fotovoltaico.</li>
          </ul>
        </div>
      </div>
      <div className="mt-2">
        <h1 className="w-full bg-[#15599b] text-white font-bold text-center ">
          SERVIÇOS DE OPERAÇÃO E MANUTENÇÃO
        </h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full border text-center">
                  <thead className="border-b bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#15599a] px-6 py-2 border-r"
                      >
                        SERVIÇOS
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#15599a] px-6 py-2"
                      >
                        PLANO SOL+
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                      </td>
                      <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        REAPERTO CONEXÕES ELÉTRICAS
                      </td>
                      <td className="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                        EQUIPAMENTOS ELÉTRICOS
                      </td>
                      <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        CONFIGURAÇÃO E INSTALAÇÃO DE APLICATIVO DE MONITORAMENTO
                        DE GERAÇÃO DO INVERSOR
                      </td>
                      <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                      </td>
                      <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        MONITORAMENTO DA GERAÇÃO DE ENERGIA POR 12 MESES C/
                        RELATÓRIOS MENSAIS DE GERAÇÃO
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-2 py-1 text-sm font-medium text-gray-900 border-r">
                        VALOR DO PLANO ANUAL
                      </td>
                      <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                        R$ 9218,04
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="w-full bg-[#15599b] text-white font-bold text-center">
          ASSINATURA
        </h1>
        <div className="mt-10 flex justify-between">
          <div className="w-[35%]">
            <hr className="border-t-2 border-black" />
            <p className="text-center">Cliente</p>
          </div>
          <div className="w-[35%]">
            <hr className="border-t-2 border-black" />
            <p className="text-center">Ampère Energias</p>
          </div>
        </div>
      </div>
    </div>*/
}
