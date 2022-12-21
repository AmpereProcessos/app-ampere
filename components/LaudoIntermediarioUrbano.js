import React from "react";
import Image from "next/image";
import Logo from "../utils/whitelogoHD.png";
import { fatorDeGeracaoPorOrientacao } from "../utils/constants";
import Assinatura from "../utils/assinatura.jpg";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
function LaudoIntermediarioUrbano({ info }) {
  function getAdditionalCostsSum(custos) {
    var sum = 0;
    for (let i = 0; i < custos.length; i++) {
      sum = sum + custos[i].qtde * custos[i].valor;
    }
    return sum;
  }
  function getCorrectedGen() {
    let norte = info.modNorte
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["NORTE"]) *
            info.modNorte *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let nordeste = info.modNordeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["NORDESTE"]) *
            info.modNordeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let leste = info.modLeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["LESTE"]) *
            info.modLeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let sudeste = info.modSudeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["NORTE"]) *
            info.modSudeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let sul = info.modSul
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["SUL"]) *
            info.modSul *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let sudoeste = info.modSudoeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["SUDESTE"]) *
            info.modSudoeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let oeste = info.modOeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["OESTE"]) *
            info.modOeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    let noroeste = info.modNoroeste
      ? (
          (Number(fatorDeGeracaoPorOrientacao[info.cidade]["NOROESTE"]) *
            info.modNoroeste *
            info.potModulos) /
          1000
        ).toFixed(2)
      : 0;
    return (
      Number(norte) +
      Number(nordeste) +
      Number(leste) +
      Number(sudeste) +
      Number(sul) +
      Number(sudoeste) +
      Number(oeste) +
      Number(noroeste)
    ).toFixed(2);
  }
  function getProposedGen() {
    return (
      (info.qtdeModulos *
        info.potModulos *
        Number(fatorDeGeracaoPorOrientacao[info.cidade].fatorGen)) /
      1000
    ).toFixed(2);
  }
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">
            LAUDO TÉCNICO - URBANO
          </h1>
          <div className="w-[47px] h-[47px]">
            <Image style={{ width: "47px", height: "47px" }} src={Logo} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">
            CADASTRO
          </h1>
          <div className="flex">
            <div className="grid grid-rows-6 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  CLIENTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  REPRESENTANTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeVendedor}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  ENDEREÇO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.logradouro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  BAIRRO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.bairro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  DATA DA VISITA
                </p>
                <p className="text-center text-xs border-r border-black">
                  {dayjs().format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE SOLICITAÇÃO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeSolicitacao}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-6 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TELEFONE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.telefoneDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  Nº DE PROJETO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.codigoSVB}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  NÚMERO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.numeroResidencia}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  MUNICÍPIO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.cidade}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  PRAZO LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {/\(([^)]+)\)/.exec(info.tipoDeLaudo)[1]}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeLaudo.split("(")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">
            ESTRUTURA FOTOVOLTAICA
          </h1>
          <div className="flex">
            <div className="w-[20%] h-full flex justify-center items-center bg-[#15599a] text-center text-white font-bold">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="w-[80%] flex flex-col">
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                INVERSORES
              </h1>
              <div className="flex border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      TOPOLOGIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.tipoInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.qtdeInversor}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      MARCA DO INVERSOR
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.marcaInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.potInversor}
                    </p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.qtdeModulos}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.potModulos}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xs font-bold w-[50%]">
                  MARCA DOS MÓDULOS
                </p>
                <p className="text-center text-xs font-bold w-[50%]">
                  {info.marcaModulos}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-b-0 border-black">
            VISUALIZAÇÃO DO PROJETO
          </h1>
          <div className="h-[704px] flex items-center border border-black">
            {info.linkVisualizacaoProjeto ? (
              <div className="w-[793.7px] h-full">
                <Image
                  width={"793px"}
                  height={"560px"}
                  src={info.linkVisualizacaoProjeto}
                  objectFit="fill"
                  alt="Picture of the author"
                />
              </div>
            ) : (
              false
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center font-bold border border-black">
            CUSTOS ADICIONAIS
          </h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10 border-b border-black">
              <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                DESCRIÇÃO
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                QUANTIDADE
              </p>
              <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                GRANDEZA
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                VALOR
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                TOTAL
              </p>
            </div>
            {info.custosAdicionais ? (
              <div className="flex flex-col">
                {info.custosAdicionais.map((custo, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-10 border-b border-black"
                  >
                    <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                      {custo.descricao}
                    </p>
                    <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                      {custo.qtde}
                    </p>
                    <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                      {custo.grandeza}
                    </p>
                    <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                      {custo.valor}
                    </p>
                    <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                      R$
                      {(custo.valor * custo.qtde).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[50px] border-b border-r border-black italic">
                SEM CUSTOS ADICIONAIS
              </div>
            )}
          </div>
          <div className="grid grid-cols-10">
            <div className="bg-[#15599a] text-white font-bold flex justify-center items-center text-center col-span-3 border border-black border-t-0 border-l-0">
              VALOR PARA AJUSTE NA PROPOSTA COMERCIAL
            </div>
            <div className="flex flex-col col-span-7 h-full">
              <div className="grid grid-cols-7 border-b border-black">
                <div className="col-span-5 bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">
                  VALOR À VISTA
                </div>
                <div className="col-span-2 bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">
                  R${" "}
                  {info.custosAdicionais
                    ? getAdditionalCostsSum(info.custosAdicionais)
                        .toFixed(2)
                        .replace(".", ",")
                    : "-"}
                </div>
              </div>
              <div className="grid grid-cols-7 border-black">
                <div className="col-span-5 bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">
                  VALOR FINANCIAMENTO
                </div>
                <div className="col-span-2 bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">
                  R${" "}
                  {info.custosAdicionais
                    ? (getAdditionalCostsSum(info.custosAdicionais) * 1.175)
                        .toFixed(2)
                        .replace(".", ",")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-20">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border  border-black">
            ESTUDO DE GERAÇÃO - DESVIO AZIMUTAL
          </h1>
          <div className="grid grid-cols-2">
            <div className="grid-rows-5">
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">
                  ORIENTAÇÃO
                </p>
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">
                  QTDE PLACAS
                </p>
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">
                  GERAÇÃO
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  NORTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNorte ? info.modNorte : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNorte && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["NORTE"]
                        ) *
                          info.modNorte *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : " - "}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  NORDESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNordeste ? info.modNordeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNordeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["NORDESTE"]
                        ) *
                          info.modNordeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : " - "}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  LESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modLeste ? info.modLeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modLeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["LESTE"]
                        ) *
                          info.modLeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : "-"}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  SUDESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSudeste ? info.modSudeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSudeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["SUDESTE"]
                        ) *
                          info.modSudeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)}`
                    : "-"}{" "}
                </p>
              </div>
            </div>
            <div className="grid-rows-5">
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">
                  ORIENTAÇÃO
                </p>
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">
                  QTDE PLACAS
                </p>
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">
                  GERAÇÃO
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  SUL
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSul ? info.modSul : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSul && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["SUL"]
                        ) *
                          info.modSul *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : "-"}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  SUDOESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSudoeste ? info.modSudoeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modSudoeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["SUDOESTE"]
                        ) *
                          info.modSudoeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : "-"}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  OESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modOeste ? info.modOeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modOeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["OESTE"]
                        ) *
                          info.modOeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : "-"}{" "}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">
                  NOROESTE
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNoroeste ? info.modNoroeste : "-"}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {info.modNoroeste && fatorDeGeracaoPorOrientacao[info.cidade]
                    ? `${(
                        (Number(
                          fatorDeGeracaoPorOrientacao[info.cidade]["NOROESTE"]
                        ) *
                          info.modNoroeste *
                          info.potModulos) /
                        1000
                      ).toFixed(2)} kWh`
                    : "-"}{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#15599a] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              GERAÇÃO PROPOSTA COMERCIAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">
              {getProposedGen()} kWh
            </div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#fead61] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              GERAÇÃO PREVISTA TOTAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">
              {getCorrectedGen()} kWh
            </div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#15599a] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              PERCENTUAL DE GERAÇÃO DEVIDO AO DESVIO AZIMUTAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">
              {getProposedGen() / getCorrectedGen() < 1
                ? ((getCorrectedGen() / getProposedGen()) * 100)
                    .toFixed(2)
                    .replace(".", ",")
                : ((getCorrectedGen() / getProposedGen()) * 100)
                    .toFixed(2)
                    .replace(".", ",")}
              %
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center my-2">
          <h1 className="text-center font-bold text-[#15599a]">
            VISUALIZAÇÃO GRÁFICA
          </h1>
          <div className="w-[600px] h-[300px]">
            <ResponsiveContainer width="100%">
              <BarChart
                width={500}
                height={250}
                data={[
                  {
                    name: "PROPOSTA",
                    PROPOSTO: getProposedGen(),
                    PREVISTO: 0,
                  },
                  {
                    name: "PREVISTO",
                    PROPOSTO: 0,
                    PREVISTO: getCorrectedGen(),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="kWh" />
                <Tooltip />
                <Legend />
                <Bar dataKey="PROPOSTO" fill="#15599a" unit={"kWh"}></Bar>
                <Bar dataKey="PREVISTO" fill="#fead61" unit={"kWh"}></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0">
            DESCRITIVO DO PROJETO
          </h1>
          <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[60px] text-center p-2">
            {info.descritivo?.length ? (
              info.descritivo?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 gap-3 w-full items-center py-1 border-b border-gray-200"
                >
                  <p className="text-xxs lg:text-xs text-[#15599a] font-bold col-span-3 text-center">
                    {item.topico}
                  </p>
                  <p
                    className={`${
                      item.texto.length > 100 ? "text-xxs" : "text-xs"
                    } text-gray-600 font-bold text-center col-span-7`}
                  >
                    {item.texto}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-center h-full italic text-gray-600">
                SEM DESCRITIVO
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="bg-[#15599a] text-white text-center font-bold border border-black border-t-0">
            CONCLUSÃO
          </h1>
          <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[60px] text-center p-2">
            {info.respostaConclusao ? info.respostaConclusao : "-"}
          </div>
        </div>
        <div className="mt-2 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Autorizado por:</p>
            <div className="w-full flex justify-center items-center">
              <div className="w-[97px] flex justify-center  items-center text-center">
                <Image src={Assinatura} />
              </div>
            </div>

            <hr className="border-t-2 border-black" />
            <p className="text-xxs text-center">
              ASSINATURA DIRETOR DE ENGENHARIA
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Realizado por:</p>
            <hr className="mt-8 border-t-2 border-black" />
            <p className="text-xxs text-center">
              ASSINATURA TÉCNICO RESPONSÁVEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaudoIntermediarioUrbano;
