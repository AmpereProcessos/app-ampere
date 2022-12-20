import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../utils/logo.png";
import Link from "next/link";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
function Teste() {
  const [entregues, setEntregues] = useState([]);
  const [emRota, setEmRota] = useState([]);
  function sortByEntrega(arr) {
    var newArr = arr.sort((a, b) => {
      let paramA = a.compra.dataEntrega
        ? a.compra.dataEntrega
        : a.compra.previsaoEntrega;
      let paramB = b.compra.dataEntrega
        ? b.compra.dataEntrega
        : b.compra.previsaoEntrega;
      return new Date(paramA) - new Date(paramB);
    });
    return newArr;
  }
  function sortByPrev(arr) {
    var newArr = arr.sort((a, b) => {
      /*
      let paramA = a.compra.dataEntrega
        ? a.compra.dataEntrega
        : a.compra.previsaoEntrega;
      let paramB = b.compra.dataEntrega
        ? b.compra.dataEntrega
        : b.compra.previsaoEntrega;*/
      return (
        new Date(a.compra.previsaoEntrega) - new Date(b.compra.previsaoEntrega)
      );
    });
    return newArr;
  }
  function getProjects() {
    axios.get("/api/report").then((res) => {
      console.log(res.data);
      setEntregues(sortByEntrega(res.data.entregues));
      setEmRota(sortByPrev(res.data.emRota));
    });
  }
  useEffect(() => {
    getProjects();
  }, []);
  console.log(emRota);
  return (
    <div className="w-[21cm] h-[29.7cm] bg-zinc-100 p-4">
      <div className="flex flex-col items-center">
        {/**<h1 className="text-center text-[#15599a] font-bold">ENTREGUES</h1>
        <div className="grid grid-cols-6">
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            DESDE ENTREGA
          </div>
        </div>
        <div className="flex flex-col bg-[#fff]">
          {entregues.map((obj) => (
            <div className="grid grid-cols-6 h-[36px]">
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.compra.statusEntrega == "ENTREGUE"
                  ? obj.compra.dataEntrega
                    ? `${dayjs(new Date()).diff(
                        obj.compra.dataEntrega,
                        "days"
                      )} dias`
                    : `${dayjs(new Date()).diff(
                        obj.compra.previsaoEntrega,
                        "days"
                      )} dias`
                  : "-"}
              </div>
            </div>
          ))}
        </div> */}
        <h1 className="text-center text-[#15599a] font-bold">EM ROTA</h1>
        <div className="grid grid-cols-6">
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div className=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            ATÉ ENTREGA
          </div>
        </div>
        <div className="flex flex-col bg-[#fff]">
          {emRota.map((obj) => (
            <div className="grid grid-cols-6 h-[36px]">
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div className="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {dayjs(obj.compra.previsaoEntrega).diff(new Date(), "day")} dias
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teste;
/* 
      <div className="w-[21cm] h-[29.7cm] bg-zinc-200 p-4">
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-2">
          <h1 className="text-xl font-bold text-[#15599b]">SEST SENAT</h1>
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
            <p> 127,3 kWp</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Eficiência atual
            </p>
            <p>100%</p>
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
          SERVIÇO DE OPERAÇÃO E MANUTENÇÃO
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
                        className="text-sm font-medium text-[#15599a] px-2 py-2 border-r"
                      >
                        SERVIÇOS
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#15599a] px-2 py-2"
                      >
                        PLANO SOL +
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
                        R$ 6990,00
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
    </div>
 */
