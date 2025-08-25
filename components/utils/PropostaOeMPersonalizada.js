import React from 'react'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
import Link from 'next/link'
import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'
function PropostaOeMPersonalizada() {
  const planOption = 2
  return (
    <div className="h-[29.7cm] w-[21cm] bg-zinc-200 p-4">
      <div className="grid w-full grid-cols-5 items-start">
        <div className="col-span-2 flex flex-col">
          <h1 className="text-xl font-bold text-[#15599b]">RAFAEL LEONEL SILVA</h1>
          <p className="text-xl font-bold">Ituiutaba</p>
          <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center justify-center">
          <Link href="/oem/propostas">
            <div className="h-[70px] w-[70px]">
              <Image objectFit="fill" className="cursor-pointer" src={Logo} />
            </div>
          </Link>
        </div>

        <div className="col-span-2 flex flex-col items-end">
          <h1 className="text-xl font-bold">Atendido por:</h1>
          <p className="text-center font-bold">STENIO DE ASSIS</p>
          <p className="font-bold">(34) 9 9647-7115 </p>
        </div>
      </div>
      <div className="mt-2 border-2 border-black">
        <h1 className="w-full bg-[#15599b] text-center text-xl font-semibold text-white">ESCOPO DO PROJETO</h1>
        <div className="grid grid-cols-4 divide-x-2 divide-black">
          <div className="flex flex-col items-center">
            <p className="flex h-14 items-center text-center font-bold text-[#15599b]">Qtd.Módulos - Potência</p>
            <p>92 - 330W</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex h-14 items-center text-center font-bold text-[#15599b]">Potência kWp</p>
            <p>30,36 kWp</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex h-14 items-center text-center font-bold text-[#15599b]">Eficiência atual</p>
            <p>N/A</p>
          </div>
          <div className="flex flex-col items-center border-r-2 border-black">
            <p className="flex h-14 items-center text-center font-bold text-[#15599b]">Estimativa de perda financeira anual</p>
            <p>N/A</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col">
        <h1 className="w-full text-center text-xl font-semibold text-[#15599b]">CONSEQUÊNCIAS DA FALTA DE MANUTENÇÃO</h1>
        <div className="flex justify-center">
          <ul className="text-xs font-semibold">
            <li>1. Perda de geração de energia e eficiência;</li>
            <li>2. Danificação e perda de vida útil dos modulos por criação de pontos de aquecimento;</li>
            <li>3. Redução da vida útil dos equipamentos elétricos;</li>
            <li>4. Riscos de falhas elétricas e mecânicas, ocasionando danificações e até possíveis incêndios;</li>
            <li>5. Falta de monitoramento e consequentemente o sistema ficar desconectado sem gerar energia;</li>
            <li>6. Perda da garantia de instalação do sistema fotovoltaico.</li>
          </ul>
        </div>
      </div>
      <div className="mt-5">
        <h1 className="w-full bg-[#15599b] text-center font-bold text-white">PLANOS E SERVIÇOS DE OPERAÇÃO E MANUTENÇÃO</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full border text-center">
                  <thead className="bg-background border-b">
                    <tr>
                      <th scope="col" className="border-r px-6 py-2 text-sm font-medium text-gray-900">
                        Serviços
                      </th>
                      <th scope="col" className="border-r px-2 py-2 text-sm font-medium text-gray-900">
                        Com a concorrência
                      </th>
                      {/* <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-2 py-2 border-r"
                      >
                        Manutenção simples
                      </th> */}

                      <th scope="col" className="border-r px-2 py-2 text-sm font-medium text-gray-900">
                        Plano Sol
                      </th>
                      {/* <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-2"
                          >
                            Plano Sol+
                          </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS</td>
                      <td className="border-r px-6 py-4 text-center text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r text-center">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}

                      <td className="border-r px-6 py-4 text-center text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap text-center">
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
                          </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">REAPERTO CONEXÕES ELÉTRICAS</td>
                      <td className="border-r px-6 py-2 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}
                      <td className="border-r px-6 py-2 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap">
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
                          </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">
                        ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS ELÉTRICOS
                      </td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
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
                          </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">
                        CONFIGURAÇÃO E INSTALAÇÃO DE APLICATIVO DE MONITORAMENTO DE GERAÇÃO DO INVERSOR
                      </td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
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
                      </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">LIMPEZA NOS MÓDULOS FOTOVOLTAICOS</td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
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
                          </td> */}
                    </tr>

                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">
                        MONITORAMENTO DA GERAÇÃO DE ENERGIA POR 12 MESES C/ RELATÓRIOS MENSAIS DE GERAÇÃO
                      </td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        X
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: "#23c906",
                              fontSize: "20px",
                              margin: 0,
                            }}
                          />
                        </div>
                      </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">
                        MANUTENÇÃO CORRETIVA EM CASO DE NECESSIDADE (SEM INSUMOS ELÉTRICOS)
                      </td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        X
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">
                        <div className="flex justify-center">
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
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
                      </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 text-xs font-medium text-gray-900">DISTRIBUIÇÃO DE CRÉDITOS</td>
                      <td className="border-r px-6 py-2 text-xs font-light whitespace-nowrap text-gray-900">X</td>
                      {/* <td className="text-xs text-gray-900 font-light px-6 py-2 whitespace-nowrap border-r">
                        X
                      </td> */}
                      <td className="border-r px-6 py-2 text-xs font-bold whitespace-nowrap text-gray-900">
                        <div className="flex items-center justify-center">
                          <p>2x</p>
                          <FiCheck
                            style={{
                              color: '#23c906',
                              fontSize: '20px',
                              margin: 0,
                            }}
                          />
                        </div>
                      </td>
                      {/* <td className="text-sm text-gray-900 font-bold px-6 py-2 whitespace-nowrap">
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
                      </td> */}
                    </tr>

                    <tr className="bg-background border-b">
                      <td className="border-r px-2 py-1 text-xs font-medium text-gray-900">VALOR DO PLANO ANUAL EM ATÉ 10X SEM JUROS</td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">-</td>
                      {/* <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                        R$ 3.008,84
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-semibold whitespace-nowrap text-gray-900">R$ 3.008,84</td>
                      {/* <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                        R${" "}
                        {(
                          1.95 * info.price * info.modulesQty +
                          1.5 * 4 * info.distance
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </td> */}
                    </tr>
                    <tr className="bg-background border-b">
                      <td className="border-r px-2 py-1 text-xs font-medium text-gray-900">VALOR DO PLANO ANUAL A VISTA</td>
                      <td className="border-r px-6 py-4 text-xs font-light whitespace-nowrap text-gray-900">-</td>
                      {/* <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                        R$ 3.008,84
                      </td> */}
                      <td className="border-r px-6 py-4 text-xs font-semibold whitespace-nowrap text-gray-900">R$ 2.700,00</td>
                      {/* <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                        R${" "}
                        {(
                          1.95 * info.price * info.modulesQty +
                          1.5 * 4 * info.distance
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="w-full bg-[#15599b] text-center font-bold text-white">ASSINATURA</h1>
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
      <div className="mt-4 flex w-full items-center justify-center">
        <p className="text-sm text-[#15599a] italic">*Proposta com validade de 30 dias contando de {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default PropostaOeMPersonalizada
