import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Logo from "../../../utils/logo.png";
import Link from "next/link";
import connectToDatabase from "../../../utils/proposesDb";
import { FiCheck } from "react-icons/fi";
import { ObjectId } from "mongodb";
function pdfProposta({ info }) {
  /*const router = useRouter();
  const { id } = router.query;
  const [infos, setInfos] = useState();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/${id}`)
      .then((res) => setInfos(res.data));
  }, []);*/
  const mtPrice = (
    info.price * info.modulesQty +
    1.5 * 2 * info.distance
  ).toFixed(2);

  function quotaCreditNumber() {
    console.log(mtPrice / 250);
    if (Math.floor(mtPrice / 250) < 1) {
      return "";
    } else if (mtPrice / 250 > 12) {
      return "DIVIDIDO EM ATÉ 12x NO CARTÃO";
    } else {
      return `DIVIDIDO EM ATÉ ${Math.floor(mtPrice / 250)}x NO CARTÃO`;
    }
  }
  function quotaBoletoNumber() {
    console.log(mtPrice / 250);
    if (Math.floor(mtPrice / 250) <= 1) {
      return "";
    } else if (mtPrice / 250 > 12) {
      return " OU 12x NO BOLETO";
    } else {
      return ` OU ${Math.floor(mtPrice / 250)}x NO BOLETO`;
    }
  }
  return (
    <div className="w-[21cm] h-[29.7cm] bg-zinc-200 p-4">
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-2">
          <h1 className="text-xl font-bold text-[#15599b]">
            {info.clientName}
          </h1>
          <p className="text-xl font-bold">{info.city}</p>
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
          <p className="font-bold text-center">{info.attendant}</p>
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
            <p>
              {info.modulesQty} - {info.modulesPot}W
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Potência kWp
            </p>
            <p>{(info.modulesQty * info.modulesPot) / 1000}kWp</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Eficiência atual
            </p>
            <p>{info.currentEfficience}%</p>
          </div>
          <div className="flex flex-col items-center border-r-2 border-black">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Estimativa de perda financeira anual
            </p>
            <p>
              R${" "}
              {info.expectedMonthlyGen *
                (1 - info.currentEfficience / 100) *
                1.13 *
                12 ==
              0
                ? "-"
                : (
                    info.expectedMonthlyGen *
                    (1 - info.currentEfficience / 100) *
                    1.13 *
                    12
                  )
                    .toFixed(2)
                    .replace(".", ",")}
            </p>
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
                      {!info.maintenanceOnly ? (
                        <>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-2 py-2 border-r"
                          >
                            Plano Sol
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-2"
                          >
                            Plano Sol+
                          </th>
                        </>
                      ) : null}
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
                      {!info.maintenanceOnly ? (
                        <>
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
                        </>
                      ) : null}
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
                      {!info.maintenanceOnly ? (
                        <>
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
                        </>
                      ) : null}
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
                      {!info.maintenanceOnly ? (
                        <>
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
                        </>
                      ) : null}
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
                      {!info.maintenanceOnly ? (
                        <>
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
                        </>
                      ) : null}
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
                      {!info.maintenanceOnly ? (
                        <>
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
                        </>
                      ) : null}
                    </tr>
                    {!info.maintenanceOnly ? (
                      <>
                        <tr className="border-b bg-white">
                          <td className="px-2 text-sm font-medium text-gray-900 border-r">
                            MONITORAMENTO DA GERAÇÃO DE ENERGIA POR 12 MESES C/
                            RELATÓRIOS MENSAIS DE GERAÇÃO
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                            X
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
                          <td className="px-2 text-sm font-medium text-gray-900 border-r">
                            MANUTENÇÃO CORRETIVA EM CASO DE NECESSIDADE (SEM
                            INSUMOS ELÉTRICOS)
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                            X
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
                            DISTRIBUIÇÃO DE CRÉDITOS
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
                            X
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
                            X
                          </td>
                          <td className="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap border-r">
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
                          <td className="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap">
                            <div className="flex justify-center items-center">
                              <p>4x</p>
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
                      </>
                    ) : null}

                    <tr className="border-b bg-white">
                      <td className="px-2 py-1 text-sm font-medium text-gray-900 border-r">
                        VALOR DO PLANO ANUAL {quotaCreditNumber()}
                        {quotaBoletoNumber()}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                        R$
                        {(
                          info.price * info.modulesQty +
                          1.5 * 2 * info.distance
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </td>
                      {!info.maintenanceOnly ? (
                        <>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                            R${" "}
                            {(
                              1.3 * info.price * info.modulesQty +
                              1.5 * 2 * info.distance
                            )
                              .toFixed(2)
                              .replace(".", ",")}
                          </td>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                            R${" "}
                            {(
                              1.95 * info.price * info.modulesQty +
                              1.5 * 4 * info.distance
                            )
                              .toFixed(2)
                              .replace(".", ",")}
                          </td>
                        </>
                      ) : null}
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
  );
}
/*        <h1 className="text-xs text-[#15599b] mt-1 text-center">
          A ENERGIA QUE MOVE O MUNDO{"  "}
          <strong className="text-[#f6c228] text-sm font-bold">
            VEM DE VOCÊ!
          </strong>
        </h1>*/
/*export async function getStaticPaths() {
  const router = useRouter();
  const { id } = router.query;
  const paths = {
    params: { id: id },
  };

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  let res = await axios.get(`http://localhost:3000/api/${params.id}`);
  const info = await res.data;

  return { props: { info } };
}*/
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  /*let res = await axios.get(`/api/${id}`);
  const info = await res.data;*/
  const db = await connectToDatabase(process.env.DB2_KEY);
  const collection = db.collection("infos");
  let user = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(user));
  // Pass data to the page via props
  return { props: { info } };
}
export default pdfProposta;
