import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import Logo from "../utils/whitelogoHD.png";
import { FiCheck } from "react-icons/fi";
import { prices } from "../utils/constants";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PropostaPDFModel({ info }) {
  const pdfRef = useRef();

  function findPrice(modulesQtd) {
    for (let i = 0; i < prices.length; i++) {
      console.log(prices[i]);
      if (modulesQtd >= prices[i].min && modulesQtd <= prices[i].max) {
        return prices[i].price;
      }
    }
  }

  function quotaCreditNumber() {
    const mtPrice = (
      findPrice(info.qtdeModulos) * info.qtdeModulos +
      1.5 * 2 * info.distancia
    ).toFixed(2);
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
    const mtPrice = (
      findPrice(info.qtdeModulos) * info.qtdeModulos +
      1.5 * 2 * info.distancia
    ).toFixed(2);
    if (Math.floor(mtPrice / 250) <= 1) {
      return "";
    } else if (mtPrice / 250 > 12) {
      return " OU 12x NO BOLETO";
    } else {
      return ` OU ${Math.floor(mtPrice / 250)}x NO BOLETO`;
    }
  }
  const pxToMm = (px) => {
    return Math.floor(px / document.getElementById("myMm").offsetHeight);
  };

  const mmToPx = (mm) => {
    return document.getElementById("myMm").offsetHeight * mm;
  };

  const range = (start, end) => {
    return Array(end - start)
      .join(0)
      .split(0)
      .map(function (val, id) {
        return id + start;
      });
  };
  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };
  return (
    <div
      style={{ width: "210mm", height: "297mm" }}
      id="pdf"
      ref={pdfRef}
      className="bg-zinc-200 p-4"
    >
      <div id="myMm" style={{ height: "1mm" }} />
      <div className="grid grid-cols-5 w-full">
        <div className="flex flex-col col-span-2">
          <h1 className="text-xl font-bold text-[#15599b]">
            {info.nomeCliente}
          </h1>
          <p className="text-xl font-bold">{info.cidade}</p>
          <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center justify-center">
          <div
            onClick={handleDownloadPdf}
            // onClick={() => {
            //   // const input = document.getElementById("pdf");
            //   const input = pdfRef.current;
            //   const inputHeightMm = pxToMm(input.offsetHeight);
            //   const a4WidthMm = 210;
            //   const a4HeightMm = 297;
            //   const a4HeightPx = mmToPx(a4HeightMm);
            //   const numPages =
            //     inputHeightMm <= a4HeightMm
            //       ? 1
            //       : Math.floor(inputHeightMm / a4HeightMm) + 1;
            //   console.log({
            //     input,
            //     inputHeightMm,
            //     a4HeightMm,
            //     a4HeightPx,
            //     numPages,
            //     range: range(0, numPages),
            //     comp: inputHeightMm <= a4HeightMm,
            //     inputHeightPx: input.offsetHeight,
            //   });

            //   html2canvas(input).then((canvas) => {
            //     const imgData = canvas.toDataURL("image/png");
            //     var pdf;
            //     // Document of a4WidthMm wide and inputHeightMm high
            //     if (inputHeightMm > a4HeightMm) {
            //       // elongated a4 (system print dialog will handle page breaks)
            //       pdf = new jsPDF("p", "mm", [inputHeightMm + 16, a4WidthMm]);
            //     } else {
            //       // standard a4
            //       pdf = new jsPDF();
            //     }

            //     pdf.addImage(imgData, "PNG", 0, 0);
            //     pdf.save(`PROPOSTA.pdf`);
            //   });

            //   ////////////////////////////////////////////////////////
            //   // System to manually handle page breaks
            //   // Wasn't able to get it working !
            //   // The idea is to break html2canvas screenshots into multiple chunks and stich them together as a pdf
            //   // If you get this working, please email me a khuranashivek@outlook.com and I'll update the article
            //   ////////////////////////////////////////////////////////
            //   // range(0, numPages).forEach((page) => {
            //   //   console.log(`Rendering page ${page}. Capturing height: ${a4HeightPx} at yOffset: ${page*a4HeightPx}`);
            //   //   html2canvas(input, {height: a4HeightPx, y: page*a4HeightPx})
            //   //     .then((canvas) => {
            //   //       const imgData = canvas.toDataURL('image/png');
            //   //       console.log(imgData)
            //   //       if (page > 0) {
            //   //         pdf.addPage();
            //   //       }
            //   //       pdf.addImage(imgData, 'PNG', 0, 0);
            //   //     });
            //   //   ;
            //   // });

            //   // setTimeout(() => {
            //   //   pdf.save(`${id}.pdf`);
            //   // }, 5000);
            // }}
            className="h-[70px] w-[70px]"
          >
            <Image objectFit="fill" className="cursor-pointer" src={Logo} />
          </div>
        </div>
        <div className="flex flex-col items-end col-span-2">
          <h1 className="text-xl font-bold">Atendido por:</h1>
          <p className="font-bold text-center">{info.vendedor}</p>
          <p className="font-bold">
            {info.telefoneVendedor ? info.telefoneVendedor : "(34) 9 9775-7001"}
          </p>
        </div>
      </div>
      <div className="mt-5 border-2 border-black">
        <div className="w-full flex items-center justify-center pb-2 bg-[#15599b] text-white font-bold text-center">
          ESCOPO DO PROJETO
        </div>
        <div className="grid grid-cols-4 divide-x-2 divide-black pb-2">
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Qtd.Módulos - Potência
            </p>
            <p>
              {info.qtdeModulos} - {info.potModulos}W
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Potência kWp
            </p>
            <p>{(info.qtdeModulos * info.potModulos) / 1000}kWp</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="flex items-center h-14 text-center text-[#15599b] font-bold">
              Eficiência atual
            </p>
            <p>{info.eficienciaAtual}%</p>
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
        <h1 className="w-full pb-2 bg-[#15599b] text-white font-bold text-center ">
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
                        Manutenção simples
                      </th>
                      {!info.currentPlanOption == 1 ? (
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
                        <div className="flex justify-center">X</div>
                      </td>
                      {!info.currentPlanOption == 1 ? (
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
                        <div className="flex justify-center">X</div>
                      </td>
                      {!info.currentPlanOption == 1 ? (
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
                        <div className="flex justify-center">X</div>
                      </td>
                      {!info.currentPlanOption == 1 ? (
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
                      {!info.currentPlanOption == 1 ? (
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
                    {!info.currentPlanOption == 1 ? (
                      <>
                        <tr className="border-b bg-white">
                          <td className="px-2 text-sm font-medium text-gray-900 border-r">
                            MANUTENÇÃO ADICIONAL, COM VALOR JÁ ESTIPULADO EM
                            CONTRATO
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                            X
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                            <div className="flex justify-center">
                              <p>50% do valor do contrato</p>
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center items-center">
                              <p>70% do valor do contrato</p>
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
                            <div className="flex justify-center items-center text-green-500">
                              ILIMITADO
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

                      <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                        R$
                        {(
                          findPrice(info.qtdeModulos) * info.qtdeModulos +
                          1.5 * 2 * info.distancia
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </td>
                      {!info.currentPlanOption == 1 ? (
                        <>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap border-r">
                            R${" "}
                            {(
                              1.3 *
                                findPrice(info.qtdeModulos) *
                                info.qtdeModulos +
                              1.5 * 2 * info.distancia
                            )
                              .toFixed(2)
                              .replace(".", ",")}
                          </td>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                            R${" "}
                            {(
                              1.5 *
                                findPrice(info.qtdeModulos) *
                                info.qtdeModulos +
                              1.5 * 4 * info.distancia
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
        <div className="w-full flex items-center justify-center pb-2 bg-[#15599b] text-white font-bold text-center">
          ASSINATURA
        </div>
        <div className="pt-10 flex justify-between">
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
      <div className="w-full flex items-center justify-center mt-1">
        <p className="text-sm text-[#15599a] italic">
          *Proposta com validade de 30 dias contando de{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default PropostaPDFModel;
