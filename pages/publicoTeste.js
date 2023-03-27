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
    <div className="w-[21cm] h-[29.7cm] bg-zinc-200 p-4">
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-2">
          <h1 className="text-xl font-bold text-[#15599b]">VIVIANE CCAA</h1>
          <p className="text-xl font-bold">Ituiutaba</p>
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
          <p className="font-bold text-center">GABRIEL MARTINS</p>
          <p className="font-bold">(34) 9 9775-7001</p>
        </div>
      </div>
      <div className="mt-6 border-2 border-black">
        <h1 className="text-xl w-full text-center bg-[#15599b] text-white font-semibold">
          ESCOPO DO PROJETO
        </h1>
        <div className="grid grid-cols-4 divide-x-2 divide-black">
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Qtd.Módulos - Potência
            </p>
            <p>80 - 330W</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Potência kWp
            </p>
            <p>26.4kWp</p>
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
            <p>R$ 45055,81</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-6">
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
      <div className="mt-6">
        <h1 className="w-full bg-[#15599b] text-white font-bold text-center ">
          PLANOS E SERVIÇOS DE OPERAÇÃO E MANUTENÇÃO
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
                        className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                      >
                        Serviços
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-2 py-2 border-r"
                      >
                        Com a concorrência
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-2 py-2 border-r"
                      >
                        Manutenção simples
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-white">
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r text-center">
                        X
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r text-center">
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
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        REAPERTO CONEXÕES ELÉTRICAS
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
                        X
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
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
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                        EQUIPAMENTOS ELÉTRICOS
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        X
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
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
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        CONFIGURAÇÃO E INSTALAÇÃO DE APLICATIVO DE MONITORAMENTO
                        DE GERAÇÃO DO INVERSOR
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        X
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
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
                      <td className="px-2 text-sm font-medium text-gray-900 border-r">
                        LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
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
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
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
                        VALOR DO PLANO ANUAL DIVIDIDO EM ATÉ 7x NO CARTÃO OU 7x
                        NO BOLETO
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                        R$1832,00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
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
    </div>
  );
}

export default Teste;
