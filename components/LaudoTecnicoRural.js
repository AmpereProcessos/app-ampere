import React from "react";
import Image from "next/image";
import Logo from "../utils/whitelogoHD.png";
import Assinatura from "../utils/assinatura.jpg";
import dayjs from "dayjs";
function LaudoTecnicoRural({ info }) {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">
            LAUDO TÉCNICO - RURAL
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
                <p className="text-center text-xs border-r border-black">
                  CLIENTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  REPRESENTANTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeVendedor}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  ENDEREÇO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.logradouro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  BAIRRO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.bairro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  DATA DA VISITA
                </p>
                <p className="text-center text-xs border-r border-black">
                  {dayjs().format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  TIPO DE SOLICITAÇÃO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeSolicitacao}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-6 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  TELEFONE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.telefoneDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  Nº DE PROJETO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.codigoSVB}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  NÚMERO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.numeroResidencia}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  MUNICÍPIO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.cidade}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  PRAZO LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {/\(([^)]+)\)/.exec(info.tipoDeLaudo)[1]}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">
                  TIPO DE LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeLaudo.split("(")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
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
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      TOPOLOGIA
                    </p>
                    <p className="text-center text-xxs font-bold">
                      {info.tipoInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xxs font-bold">
                      {info.qtdeInversor}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      MARCA DO INVERSOR
                    </p>
                    <p className="text-center text-xxs font-bold">
                      {info.marcaInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xxs font-bold">
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
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xxs font-bold">
                      {info.qtdeModulos}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xxs font-bold">
                      {info.potModulos}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xxs font-bold w-[50%]">
                  MARCA DOS MÓDULOS
                </p>
                <p className="text-center text-xxs font-bold w-[50%]">
                  {info.marcaModulos}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-[20%] bg-gray-200 font-bold text-xxs text-center border-r border-black">
            OBSERVAÇÕES VISITA
          </div>
          <div className="w-[80%] text-xxs text-center border-r border-black">
            {info.obsVisita}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black">
            OBRAS
          </h1>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-sm text-white text-center font-bold border border-black border-t-0">
              ESTRUTURA DE MONTAGEM
            </h1>
            <div className="flex">
              <div className="grid grid-rows-4 w-[50%]">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center  border-r border-black">
                    ESTRUTURA DE MONTAGEM
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.estruturaMontagem ? info.estruturaMontagem : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    TIPO DA TELHA
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.tipoTelha ? info.tipoTelha : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    TELHA RESERVA
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.telhasReservas ? info.telhasReservas : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    AVALIAR TELHADO
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.avaliarTelhado ? info.avaliarTelhado : "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-rows-4 w-[50%]">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    TIPO DA ESTRUTURA
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.tipoEstrutura ? info.tipoEstrutura : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    ORIENTAÇÃO DA ESTRUTURA
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.orientacaoEstrutura ? info.orientacaoEstrutura : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    POSSUI SOMBRA
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.respostaPossuiSombra
                      ? info.respostaPossuiSombra
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    DISTÂNCIA DE ITUIUTABA À ZONA RURAL
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.distanciaItbaRural ? info.distanciaItbaRural : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-sm text-white text-center font-bold border border-black border-t-0">
              INFRAESTRUTURA ELÉTRICA
            </h1>
            <div className="flex">
              <div className="grid grid-rows-4 w-[50%]">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    LOCAL INSTALAÇÃO DO EQUIPAMENTO
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.localInstalacaoInversor
                      ? info.localInstalacaoInversor
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    DISTÂNCIA DO SISTEMA AO INVERSOR
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.distanciaSistemaInversor
                      ? info.distanciaSistemaInversor
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    PAREDE DE FIXAÇÃO DOS EQUIPAMENTOS
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.tipoFixacaoInversores
                      ? info.tipoFixacaoInversores
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.distanciaInversorPadrao
                      ? info.distanciaInversorPadrao
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-rows-4 w-[50%]">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    INFRA PARA LANÇAMENTO DE CABOS
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.infraCabos ? info.infraCabos : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    DISTÂNCIA DO ROTEADOR AO INVERSOR
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.distanciaInversorRoteador
                      ? info.distanciaInversorRoteador
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    REALIMENTAR A FAZENDA?
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.realimentar ? info.realimentar : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                    TEM ESTUDO DE CASO?
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.temEstudoDeCaso ? info.temEstudoDeCaso : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              OBSERVAÇÕES
            </h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {info.obsObras ? info.obsObras : "SEM OBSERVAÇÕES"}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center text-sm font-bold border border-black border-t-0">
            SERVIÇOS EXTRAS
          </h1>
          <div className="flex">
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  CASA DE MÁQUINAS
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.casaDeMaquinas ? info.casaDeMaquinas : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  INSTALAÇÃO INTERNET
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.instalacaoRoteador ? info.instalacaoRoteador : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  INSTALAÇÃO DE ALAMBRADO
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.alambrado ? info.alambrado : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  TERRAPLANAGEM USINA DE SOLO
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.terraplanagemUsinaSolo
                    ? info.terraplanagemUsinaSolo
                    : "-"}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  CONSTRUÇÃO DE BARRACÃO
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.construcaoBarracao ? info.construcaoBarracao : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  REDE PARA INTERLIGAR FAZENDA
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.redeReligacao ? info.redeReligacao : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  BRITAGEM
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.britagem ? info.britagem : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                  LIMPEZA DO LOCAL USINA DE SOLO
                </p>
                <p className="text-xxs text-center border-r border-black">
                  {info.limpezaLocalUsinaSolo
                    ? info.limpezaLocalUsinaSolo
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center text-sm font-bold border border-black border-t-0">
            SUPRIMENTOS
          </h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10">
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-3 border-b border-r border-black">
                INSUMO
              </p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-3 border-b border-r border-black">
                TIPO
              </p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-2 border-b border-r border-black">
                QUANTIDADE
              </p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-2 border-b border-r border-black">
                MEDIDA
              </p>
            </div>
            {info.suprimentos.map((suprimento, index) => (
              <div key={index} className="grid grid-cols-10">
                <p className="text-center text-xxs font-bold col-span-3 border-b border-r border-black">
                  {suprimento.insumo}
                </p>
                <p className="text-center text-xxs font-bold col-span-3 border-b border-r border-black">
                  {suprimento.tipo}
                </p>
                <p className="text-center text-xxs font-bold col-span-2 border-b border-r border-black">
                  {suprimento.qtde}
                </p>
                <p className="text-center text-xxs font-bold col-span-2 border-b border-r border-black">
                  {suprimento.medida}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              OBSERVAÇÕES
            </h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {info.obsSuprimentos ? info.obsSuprimentos : "SEM OBSERVAÇÕES"}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black border-t-0">
            PROJETOS
          </h1>
          <div className="flex">
            <div className="w-[50%] grid grid-cols-2 border-b border-black">
              <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                CONCESSIONÁRIA
              </p>
              <p className="font-bold text-xxs text-center border-r border-black">
                {info.concessionaria ? info.concessionaria : "-"}
              </p>
            </div>
            <div className="w-[50%] grid grid-cols-2 border-b border-black">
              <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">
                TIPO DE PROJETO
              </p>
              <p className="font-bold text-xxs text-center border-r border-black">
                {info.tipoProjeto ? info.tipoProjeto : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              PADRÃO RURAL
            </h1>
            <div className="flex">
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    AMPERAGEM
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.amperagem ? info.amperagem : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    Nº DO MEDIDOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.numeroMedidor ? info.numeroMedidor : "-"}
                  </p>
                </div>
              </div>
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    TIPO DO DISJUNTOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.tipoDisjuntor ? info.tipoDisjuntor : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    MODELO DA CAIXA
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.modeloCaixa ? info.modeloCaixa : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              TRANSFORMADOR
            </h1>
            <div className="flex">
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    POTÊNCIA DO TRANSFORMADOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.potTrafo ? info.potTrafo : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    Nº DO TRANSFORMADOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.numeroTrafo ? info.numeroTrafo : "-"}
                  </p>
                </div>
              </div>
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    PADRÃO ACOPLADO
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.padraoTrafoAcoplados
                      ? info.padraoTrafoAcoplados
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    PENDÊNCIAS
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.pendenciasTrafo ? info.pendenciasTrafo : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              GOIÁS
            </h1>
            <div className="flex">
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    Nº DO POSTE TRANSFORMADOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.numeroPosteTrafo ? info.numeroPosteTrafo : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    POTÊNCIA FUSÍVEL
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.potFusivel ? info.potFusivel : "-"}
                  </p>
                </div>
              </div>
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    Nº POSTE DE DERIVAÇÃO
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.numeroPosteDerivacao
                      ? info.numeroPosteDerivacao
                      : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">
                    POTÊNCIA DO TRANSFORMADOR
                  </p>
                  <p className="text-center font-bold border-r border-black text-xxs">
                    {info.potTrafo ? info.potTrafo : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              TROCA DE PADRÃO
            </h1>
            <div className="flex border-b border-black">
              <h1 className="bg-[#15599a] text-white text-center font-bold text-xxs w-[25%] border-r border-black">
                AUMENTO DE CARGA PARA
              </h1>
              <div className="w-[75%] flex">
                <div className="w-[50%] grid grid-cols-2">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    TIPO DE PADRÃO
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.novaLigacaoPadrao ? info.novaLigacaoPadrao : "-"}
                  </p>
                </div>
                <div className="w-[50%] grid grid-cols-2">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    AMPERAGEM
                  </p>
                  <p className="text-xxs text-center border-r border-black">
                    {info.novaAmperagem ? info.novaAmperagem : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              DESENHO
            </h1>
            <div className="flex">
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    FOTO DO DRONE
                  </p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {info.fotoDroneDesenho ? info.fotoDroneDesenho : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    MEDIDAS NO LOCAL
                  </p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {info.medidasLocal ? info.medidasLocal : "-"}
                  </p>
                </div>
              </div>
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    FOTO DA FAIXADA
                  </p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {info.fotoFaixada ? info.fotoFaixada : "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">
                    GOOGLE EARTH
                  </p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {info.googleEarth ? info.googleEarth : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">
              OBSERVAÇÕES
            </h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {info.obsProjetos ? info.obsProjetos : "SEM OBSERVAÇÕES"}
            </div>
          </div>
        </div>
        <div className="mt-1 grid gap-x-4 grid-cols-2">
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

export default LaudoTecnicoRural;
