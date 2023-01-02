import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  listAll,
  list,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/firebase";
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
  // useEffect(() => {
  //   getProjects();
  // }, []);
  console.log(emRota);
  // async function listFiles() {
  //   const listRef = ref(storage);
  //   let arq = await listAll(listRef);
  //   arq.prefixes.forEach(async (folderRef) => {
  //     console.log(folderRef.name);
  //     if (folderRef.name == "chamadosPPS") {
  //       let chamadosRef = await listAll(folderRef);
  //       chamadosRef.prefixes.forEach(async (pasta) => {
  //         let clientes = await listAll(pasta);
  //         clientes.items.forEach(async (cliente) => {
  //           let clienteRef = ref(storage, cliente.fullPath);
  //           let metaData = await getMetadata(clienteRef);
  //           console.log("CHEGUEI AQUI", metaData);
  //           if (
  //             new Date(metaData.timeCreated) <
  //             new Date("2022-12-10T19:39:13.481Z")
  //           ) {
  //             console.log(metaData);
  //             let fileRef = ref(storage, metaData.fullPath);
  //             // deleteObject(fileRef).then((res) => console.log(res));
  //           }
  //         });
  //       });
  //     }
  //   });
  // }
  return (
    <div className="w-[21cm] h-[29.7cm] bg-zinc-100 p-4">
      <div className="flex flex-col items-center">
        {/**<h1 classNameName="text-center text-[#15599a] font-bold">ENTREGUES</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            DESDE ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {entregues.map((obj) => (
            <div classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
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
        {/* <h1 classNameName="text-center text-[#15599a] font-bold">EM ROTA</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            ATÉ ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {emRota.map((obj, index) => (
            <div key={index} classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {dayjs(obj.compra.previsaoEntrega).diff(new Date(), "day")} dias
              </div>
            </div>
          ))}
        </div> */}
        <ol className="border-l-2 border-blue-600">
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                Title of section 1
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6">
              <a
                href="#!"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
              >
                4 February, 2022
              </a>
              <p className="text-gray-700 mt-2 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <button
                type="button"
                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Read more
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                Title of section 2
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6">
              <a
                href="#!"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
              >
                12 January, 2022
              </a>
              <p className="text-gray-700 mt-2 mb-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt.
              </p>
              <button
                type="button"
                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Read more
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                Title of section 3
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6">
              <a
                href="#!"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
              >
                27 December, 2021
              </a>
              <p className="text-gray-700 mt-2 mb-4">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio.
              </p>
              <button
                type="button"
                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Read more
              </button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Teste;
/* 
      <div classNameName="w-[21cm] h-[29.7cm] bg-zinc-200 p-4">
      <div classNameName="grid grid-cols-5 w-full">
        <div classNameName="col-span-2">
          <h1 classNameName="text-xl font-bold text-[#15599b]">SEST SENAT</h1>
          <p classNameName="text-xl font-bold">ITUIUTABA</p>
          <p classNameName="text-xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
        <Link href="/oem/propostas">
          <div classNameName="flex justify-center">
            <Image
              width="80px"
              height="80px"
              classNameName="rounded-full cursor-pointer"
              src={Logo}
            />
          </div>
        </Link>
        <div classNameName="col-span-2 place-self-end">
          <h1 classNameName="text-xl font-bold">Atendido por:</h1>
          <p classNameName="font-bold text-center">LEANDRO VIALI</p>
          <p classNameName="font-bold">(34) 9 9775-7001</p>
        </div>
      </div>
      <div classNameName="mt-5 border-2 border-black">
        <h1 classNameName="text-xl w-full text-center bg-[#15599b] text-white font-semibold">
          ESCOPO DO PROJETO
        </h1>
        <div classNameName="grid grid-cols-4 divide-x-2 divide-black">
          <div classNameName="flex flex-col items-center">
            <p classNameName="flex items-center h-14 text-center text-[#15599b] font-bold">
              Qtd.Módulos - Potência
            </p>
            <p>380 - 335W</p>
          </div>
          <div classNameName="flex flex-col items-center">
            <p classNameName="flex items-center h-14 text-center text-[#15599b] font-bold">
              Potência kWp
            </p>
            <p> 127,3 kWp</p>
          </div>
          <div classNameName="flex flex-col items-center">
            <p classNameName="flex items-center h-14 text-center text-[#15599b] font-bold">
              Eficiência atual
            </p>
            <p>100%</p>
          </div>
          <div classNameName="flex flex-col items-center border-r-2 border-black">
            <p classNameName="flex items-center h-14 text-center text-[#15599b] font-bold">
              Estimativa de perda financeira anual
            </p>
            <p>-</p>
          </div>
        </div>
      </div>
      <div classNameName="flex flex-col mt-2">
        <h1 classNameName="w-full text-center text-xl text-[#15599b] font-semibold">
          CONSEQUÊNCIAS DA FALTA DE MANUTENÇÃO
        </h1>
        <div classNameName="flex justify-center">
          <ul classNameName="font-semibold">
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
      <div classNameName="mt-2">
        <h1 classNameName="w-full bg-[#15599b] text-white font-bold text-center ">
          SERVIÇO DE OPERAÇÃO E MANUTENÇÃO
        </h1>
        <div classNameName="flex flex-col">
          <div classNameName="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div classNameName="inline-block min-w-full sm:px-6 lg:px-8">
              <div classNameName="overflow-hidden">
                <table classNameName="min-w-full border text-center">
                  <thead classNameName="border-b bg-white">
                    <tr>
                      <th
                        scope="col"
                        classNameName="text-sm font-medium text-[#15599a] px-2 py-2 border-r"
                      >
                        SERVIÇOS
                      </th>
                      <th
                        scope="col"
                        classNameName="text-sm font-medium text-[#15599a] px-2 py-2"
                      >
                        PLANO SOL +
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                      </td>
                      <td classNameName="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap text-center">
                        <div classNameName="flex justify-center items-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        REAPERTO CONEXÕES ELÉTRICAS
                      </td>
                      <td classNameName="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap">
                        <div classNameName="flex justify-center items-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                        EQUIPAMENTOS ELÉTRICOS
                      </td>
                      <td classNameName="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div classNameName="flex justify-center items-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        CONFIGURAÇÃO E INSTALAÇÃO DE APLICATIVO DE MONITORAMENTO
                        DE GERAÇÃO DO INVERSOR
                      </td>
                      <td classNameName="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div classNameName="flex justify-center items-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                      </td>
                      <td classNameName="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                        <div classNameName="flex justify-center items-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 text-sm font-medium text-gray-900 border-r">
                        MONITORAMENTO DA GERAÇÃO DE ENERGIA POR 12 MESES C/
                        RELATÓRIOS MENSAIS DE GERAÇÃO
                      </td>
                      <td classNameName="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <div classNameName="flex justify-center">
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
                    <tr classNameName="border-b bg-white">
                      <td classNameName="px-2 py-1 text-sm font-medium text-gray-900 border-r">
                        VALOR DO PLANO ANUAL
                      </td>
                      <td classNameName="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
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
        <h1 classNameName="w-full bg-[#15599b] text-white font-bold text-center">
          ASSINATURA
        </h1>
        <div classNameName="mt-10 flex justify-between">
          <div classNameName="w-[35%]">
            <hr classNameName="border-t-2 border-black" />
            <p classNameName="text-center">Cliente</p>
          </div>
          <div classNameName="w-[35%]">
            <hr classNameName="border-t-2 border-black" />
            <p classNameName="text-center">Ampère Energias</p>
          </div>
        </div>
      </div>
    </div>
 */
