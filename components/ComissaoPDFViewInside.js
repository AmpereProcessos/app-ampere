import React, { useRef } from 'react'
import Image from 'next/image'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import whiteLogo from '../utils//images/logo-texto-azul-vertical.png'
function ComissaoPDFView({ projects }) {
  const printRef = useRef()
  function getTotalComission() {
    var sumProjeto = 0
    var sumPadrao = 0
    var sumEstrutura = 0
    var sumInside = 0
    for (let i = 0; i < projects.length; i++) {
      var valueProjeto = !isNaN(projects[i].sistema.valorProjeto) ? projects[i].sistema.valorProjeto : 0
      var valuePadrao = !isNaN(projects[i].padrao.valor) ? projects[i].padrao.valor : 0
      var valueEstrutura = !isNaN(projects[i].estruturaPersonalizada.valor) ? projects[i].estruturaPersonalizada.valor : 0

      if (projects[i].insider != null || projects[i].insider != undefined) {
        sumInside = sumInside + (projects[i].porcentagemComissaoInsider / 100) * (valueProjeto + valuePadrao + valueEstrutura)
      }
      sumProjeto = sumProjeto + (Number(valueProjeto) * projects[i].porcentagemComissao) / 100
      sumPadrao = sumPadrao + (Number(valuePadrao) * projects[i].porcentagemComissao) / 100
      sumEstrutura = sumEstrutura + (Number(valueEstrutura) * projects[i].porcentagemComissao) / 100
    }
    sumProjeto = sumProjeto != undefined ? sumProjeto : 0
    sumPadrao = sumPadrao != undefined ? sumPadrao : 0
    sumEstrutura = sumEstrutura != undefined ? sumEstrutura : 0
    sumInside = sumInside != undefined ? sumInside : 0
    return {
      ativoProjeto: sumProjeto.toFixed(2),
      ativoPadrao: sumPadrao.toFixed(2),
      ativoEstrutura: sumEstrutura.toFixed(2),
      inside: sumInside.toFixed(2),
      total: (sumProjeto + sumPadrao + sumEstrutura + sumInside).toFixed(2),
    }
  }
  const handleDownloadPdf = async () => {
    const element = printRef.current
    const canvas = await html2canvas(element)
    const data = canvas.toDataURL('image/png')

    const pdf = new jsPDF()
    const imgProperties = pdf.getImageProperties(data)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('print.pdf')
  }
  return (
    <div className="flex flex-col mt-3">
      <div className="flex items-center justify-center my-2">
        <button onClick={handleDownloadPdf} className="p-1 rounded bg-green-200 hover:bg-green-500 hover:text-white font-bold w-fit">
          BAIXAR PDF
        </button>
      </div>
      <div className="w-[21cm] h-[29.7cm] px-10 flex flex-col items-center py-4" id="report" ref={printRef}>
        <div className="w-[60px] h-[60px]">
          <Image width={'60px'} height={'60px'} src={whiteLogo} />
        </div>

        <h1 className="font-bold text-[#fead61] text-center my-4">RELATÓRIO DE COMISSÃO DE INSIDER</h1>
        <div className="grid grid-cols-10 border border-gray-700 w-full">
          <div className="col-span-9 flex items-center justify-center h-[35px] border-r border-gray-700 text-xs bg-[#fead61] text-white font-bold text-center p-1">
            VALOR TOTAL
          </div>
          <div className="col-span-1 flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 font-bold text-center p-1">
            R$ {getTotalComission().inside}
          </div>
        </div>
        <div className="grid grid-cols-10 border border-gray-700 w-full">
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-2">
            NOME DO CLIENTE
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            CÓDIGO SVB
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            VENDEDOR
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            VALOR DO PROJETO
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            VALOR DO PADRÃO
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            VALOR DA ESTRUTURA
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            INSIDER
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center border-r border-gray-700 text-xs text-white text-center font-bold p-1 col-span-1">
            % DE COMISSÃO
          </div>
          <div className="bg-[#15599a] flex items-center h-[50px] justify-center text-xs text-white text-center font-bold p-1 col-span-1">
            VALOR DA COMISSÃO
          </div>
        </div>
        <div className="flex flex-col w-full">
          {projects.map((project, index) => (
            <div key={index} className="grid grid-cols-10 border border-t-0 border-gray-700 w-full">
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-2 font-bold text-center p-1">
                {project.nomeDoContrato}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.codigoSVB}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.vendedor.nome}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                R$ {project.sistema.valorProjeto.toLocaleString('pt-br')}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.padrao.valor ? project.padrao.valor.toLocaleString('pt-br') : '-'}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.estruturaPersonalizada.valor ? project.estruturaPersonalizada.valor.toLocaleString('pt-br') : '-'}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.insider ? project.insider : 'N/A'}
              </div>
              <div className="flex items-center justify-center h-[35px] border-r border-gray-700 text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                {project.porcentagemComissaoInsider ? project.porcentagemComissaoInsider : '-'}
              </div>
              <div className="flex items-center justify-center h-[35px] text-xxs text-gray-700 col-span-1 font-bold text-center p-1">
                R$ {project.sistema.valorProjeto && project.insider ? (project.sistema.valorProjeto * 0.003).toFixed(2).toLocaleString('pt-br') : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComissaoPDFView
