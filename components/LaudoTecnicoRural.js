import React from 'react'
import Image from 'next/image'
import Logo from '../utils/whitelogoHD.png'
import Assinatura from '../utils/assinatura.jpg'
import dayjs from 'dayjs'
import { GeneralTechnicalAnalysisSchema } from '../utils/schemas/technical-analysis'
function LaudoTecnicoRural({ analysis }) {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">LAUDO TÉCNICO - RURAL</h1>
          <div className="w-[47px] h-[47px]">
            <Image style={{ width: '47px', height: '47px' }} src={Logo} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">INFORMAÇÕES DO CLIENTE</h1>
          <div className="flex">
            <div className="grid grid-rows-5 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">CLIENTE</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.nome}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">REPRESENTANTE</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">ENDEREÇO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.localizacao.endereco}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">BAIRRO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.localizacao.bairro}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">DATA DA VISITA</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{dayjs().format('DD/MM/YYYY')}</p>
              </div>
            </div>
            <div className="grid grid-rows-5 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">TELEFONE</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">Nº DE PROJETO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.projeto.identificador || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">NÚMERO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.localizacao.numeroOuIdentificador}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">MUNICÍPIO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.localizacao.cidade}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">TIPO DE SOLICITAÇÃO</p>
                <p className="text-center text-[0.6rem] border-r p-1 border-black">{analysis.tipoSolicitacao}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">EQUIPAMENTOS</h1>
          <div className="flex">
            <div className="w-[20%] h-full flex justify-center items-center bg-[#15599a] text-center text-white font-bold">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="w-[80%] flex flex-col">
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">INVERSORES</h1>
              <div className="flex border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">TOPOLOGIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">MARCA DO INVERSOR</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.modelo}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">POTÊNCIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.potencia}</p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">POTÊNCIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xs font-bold p-1 w-[50%]">MARCA DOS MÓDULOS</p>
                <p className="text-center text-[0.6rem] font-bold p-1 w-[50%]">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-sm text-white text-center font-bold border border-black border-t-0">EXECUÇÃO</h1>
          <div className="grid grid-cols-4 border-b border-black">
            <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black col-span-2">ESPAÇO NO QGBT</p>
            <p className="text-xxs text-center border-r border-black col-span-2">{analysis.execucao.espacoQGBT ? 'SIM' : 'NÃO'}</p>
          </div>
          <div className="flex">
            <div className="grid grid-rows-3 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">LOCAL DE ATERRAMENTO</p>
                <p className="text-xxs text-center border-r border-black">{analysis.locais.aterramento || '-'}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">LOCAL INSTALAÇÃO DO INVERSOR</p>
                <p className="text-xxs text-center border-r border-black">{analysis.locais.inversor ? analysis.locais.inversor : '-'}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">LOCAL INSTALAÇÃO DOS MÓDULOS</p>
                <p className="text-xxs text-center border-r border-black">{analysis.locais.modulos ? analysis.locais.modulos : '-'}</p>
              </div>
            </div>
            <div className="grid grid-rows-3 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">DISTÂNCIA DO INVERSOR AO PADRÃO</p>
                <p className="text-xxs text-center border-r border-black">{analysis.distancias.cabeamentoCA}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">DISTÂNCIA DOS MÓDULOS AO INVERSOR</p>
                <p className="text-xxs text-center border-r border-black">{analysis.distancias.cabeamentoCC}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">DISTÂNCIA DO COMUNICADOR AO ROTEADOR</p>
                <p className="text-xxs text-center border-r border-black">{analysis.distancias.conexaoInternet}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">OBSERVAÇÕES</h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {analysis.execucao.observacoes || 'SEM OBSERVAÇÕES PREENCHIDAS'}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center text-sm font-bold border border-black border-t-0">SERVIÇOS EXTRAS</h1>
          <div className="grid grid-cols-2 border-b border-black">
            <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">REALIMENTAR</p>
            <p className="text-xxs text-center border-r border-black">{analysis.servicosAdicionais.realimentar ? 'SIM' : 'NÃO'}</p>
          </div>
          <div className="flex">
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">CASA DE MÁQUINAS</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.casaDeMaquinas ? analysis.servicosAdicionais.casaDeMaquinas : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">INSTALAÇÃO INTERNET</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.roteador ? analysis.servicosAdicionais.roteador : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">INSTALAÇÃO DE ALAMBRADO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.alambrado ? analysis.servicosAdicionais.alambrado : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">TERRAPLANAGEM USINA DE SOLO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.terraplanagem ? analysis.servicosAdicionais.terraplanagem : '-'}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">CONSTRUÇÃO DE BARRACÃO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.barracao ? analysis.servicosAdicionais.barracao : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">REDE PARA INTERLIGAR FAZENDA</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.redeReligacao ? analysis.servicosAdicionais.redeReligacao : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">BRITAGEM</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.britagem ? analysis.servicosAdicionais.britagem : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">LIMPEZA DO LOCAL USINA DE SOLO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.limpezaLocal ? analysis.servicosAdicionais.limpezaLocal : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center text-sm font-bold border border-black border-t-0">SUPRIMENTOS</h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10">
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-3 border-b border-r border-black">INSUMO</p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-3 border-b border-r border-black">TIPO</p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-2 border-b border-r border-black">QUANTIDADE</p>
              <p className="bg-[#fead61] text-center text-white text-sm font-bold col-span-2 border-b border-r border-black">MEDIDA</p>
            </div>
            {analysis.suprimentos?.itens?.length > 0 ? (
              analysis.suprimentos.itens.map((supply, index) => (
                <div key={index} className="grid grid-cols-10">
                  <p className="text-center text-xxs font-bold col-span-3 border-b border-r border-black">{supply.descricao}</p>
                  <p className="text-center text-xxs font-bold col-span-3 border-b border-r border-black">{supply.tipo}</p>
                  <p className="text-center text-xxs font-bold col-span-2 border-b border-r border-black">{supply.qtde}</p>
                  <p className="text-center text-xxs font-bold col-span-2 border-b border-r border-black">{supply.grandeza}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[50px] border-b border-r border-black italic">SEM ITENS ADICIONADOS</div>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">OBSERVAÇÕES</h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {analysis.suprimentos?.observacoes ? analysis.suprimentos.observacoes : 'SEM OBSERVAÇÕES'}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black border-t-0">PROJETOS</h1>
          <div className="flex">
            <div className="w-[50%] grid grid-cols-2 border-b border-black">
              <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">CONCESSIONÁRIA</p>
              <p className="font-bold text-xxs text-center border-r border-black">
                {analysis.detalhes.concessionaria ? analysis.detalhes.concessionaria : '-'}
              </p>
            </div>
            <div className="w-[50%] grid grid-cols-2 border-b border-black">
              <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">TOPOLOGIA</p>
              <p className="font-bold text-xxs text-center border-r border-black">
                {analysis.detalhes.topologia ? analysis.detalhes.topologia : '-'}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">PADRÃO</h1>
            {analysis.padrao.map((paInfo, index) => (
              <div key={index} className="flex flex-col w-full">
                {analysis.padrao?.length > 1 ? (
                  <h1 className="bg-[#fead41] text-white text-xs text-center font-bold border border-black border-t-0">PADRÃO Nº {index + 1}</h1>
                ) : null}
                <div className="flex w-full">
                  <div className="w-[50%] flex flex-col">
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">PADRÃO ESTÁ</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.tipo}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">ENTRADA</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.tipoEntrada}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">SAÍDA</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.tipoSaida}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">Nº DO MEDIDOR</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.codigoMedidor}</p>
                    </div>
                  </div>
                  <div className="w-[50%] flex flex-col">
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">LIGAÇÃO</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.ligacao}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">AMPERAGEM</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.amperagem}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">Nº DO POSTE DE DERIVAÇÃO</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.codigoPosteDerivacao || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">MODELO DA CAIXA</p>
                      <p className="text-center font-bold border-r border-black text-xxs">{paInfo.modeloCaixaMedidor}</p>
                    </div>
                  </div>
                </div>
                {paInfo.alteracao ? (
                  <div className="flex flex-col w-full">
                    <h1 className="w-full bg-red-500 text-white text-xxs text-center font-bold border border-black border-t-0">POSSUI ALTERAÇÃO</h1>
                    <div className="flex w-full">
                      <div className="w-[50%] grid grid-cols-2 border-b border-black">
                        <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">NOVA LIGAÇÃO</p>
                        <p className="text-center font-bold border-r border-black text-xxs">{paInfo.novaLigacao || '-'}</p>
                      </div>
                      <div className="w-[50%] grid grid-cols-2 border-b border-black">
                        <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">NOVA AMPERAGEM</p>
                        <p className="text-center font-bold border-r border-black text-xxs">{paInfo.novaAmperagem || '-'}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">TRANSFORMADOR</h1>

            <div className="grid grid-rows-2">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">POTÊNCIA DO TRANSFORMADOR</p>
                <p className="text-center font-bold border-r border-black text-xxs">
                  {analysis.transformador.potencia ? analysis.transformador.potencia : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">Nº DO TRANSFORMADOR</p>
                <p className="text-center font-bold border-r border-black text-xxs">
                  {analysis.transformador.codigo ? analysis.transformador.codigo : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 text-center font-bold border-r border-black text-xxs">PADRÃO ACOPLADO</p>
                <p className="text-center font-bold border-r border-black text-xxs">{analysis.transformador.acopladoPadrao ? 'SIM' : 'NÃO'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">DESENHO</h1>
            <div className="flex">
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">FOTO DO DRONE</p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {analysis.detalhes.imagensDrone ? analysis.detalhes.imagensDrone : '-'}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">MEDIDAS NO LOCAL</p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {analysis.detalhes.medicoes ? analysis.detalhes.medicoes : '-'}
                  </p>
                </div>
              </div>
              <div className="w-[50%] grid grid-rows-2">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">FOTO DA FACHADA</p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {analysis.detalhes.imagensFachada ? analysis.detalhes.imagensFachada : '-'}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-gray-200 text-xxs text-center font-bold border-r border-black">GOOGLE EARTH</p>
                  <p className="text-xxs text-center font-bold border-r border-black">
                    {analysis.detalhes.imagensSatelite ? analysis.detalhes.imagensSatelite : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col">
            <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0 text-xs">OBSERVAÇÕES</h1>
            <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[50px] text-center p-2">
              {analysis.obsProjetos ? analysis.obsProjetos : 'SEM OBSERVAÇÕES'}
            </div>
          </div> */}
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
            <p className="text-xxs text-center">ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Realizado por:</p>
            <hr className="mt-8 border-t-2 border-black" />
            <p className="text-xxs text-center">ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaudoTecnicoRural
