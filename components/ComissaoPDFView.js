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
  function getProjectTotalComission(project) {
    var valueProjeto = !isNaN(project.sistema.valorProjeto) ? project.sistema.valorProjeto : 0
    var valuePadrao = !isNaN(project.padrao.valor) ? project.padrao.valor : 0
    var valueEstrutura = !isNaN(project.estruturaPersonalizada.valor) ? project.estruturaPersonalizada.valor : 0
    return (project.porcentagemComissao / 100) * (valueProjeto + valuePadrao + valueEstrutura)
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
    <div className="mt-3 flex flex-col">
      <div className="my-2 flex items-center justify-center">
        <button onClick={handleDownloadPdf} className="w-fit rounded bg-green-200 p-1 font-bold hover:bg-green-500 hover:text-white">
          BAIXAR PDF
        </button>
      </div>
      <div className="flex h-[29.7cm] w-[21cm] flex-col items-center px-10 py-4" id="report" ref={printRef}>
        <div className="h-[60px] w-[60px]">
          <Image width={'60px'} height={'60px'} src={whiteLogo} />
        </div>

        <h1 className="my-4 text-center font-bold text-[#fead61]">RELATÓRIO DE COMISSÃO DE VENDEDOR</h1>
        <div className="grid w-full grid-cols-8 border border-gray-700">
          <div className="col-span-7 flex h-[35px] items-center justify-center border-r border-gray-700 bg-[#fead61] p-1 text-center text-xs font-bold text-white">
            VALOR TOTAL
          </div>
          <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
            R$ {Number(getTotalComission().ativoProjeto) + Number(getTotalComission().ativoPadrao) + Number(getTotalComission().ativoEstrutura)}
          </div>
        </div>
        <div className="grid w-full grid-cols-10 border border-gray-700">
          <div className="col-span-2 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            NOME DO CLIENTE
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            CÓDIGO SVB
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            VENDEDOR
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            VALOR DO PROJETO
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            VALOR DO PADRÃO
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            VALOR DA ESTRUTURA
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            INSIDER
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center border-r border-gray-700 bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            % DE COMISSÃO
          </div>
          <div className="col-span-1 flex h-[50px] items-center justify-center bg-[#15599a] p-1 text-center text-xs font-bold text-white">
            VALOR DA COMISSÃO
          </div>
        </div>
        <div className="flex w-full flex-col">
          {projects.map((project, index) => (
            <div key={index} className="grid w-full grid-cols-10 border border-t-0 border-gray-700">
              <div className="col-span-2 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                {project.nomeDoContrato}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                {project.codigoSVB}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                {project.vendedor.nome}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                R$ {project.sistema.valorProjeto.toLocaleString('pt-br')}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                R$ {project.padrao.valor ? project.padrao.valor.toLocaleString('pt-br') : '-'}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                R$ {project.estruturaPersonalizada.valor ? project.estruturaPersonalizada.valor.toLocaleString('pt-br') : '-'}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                {project.insider ? project.insider : 'N/A'}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center border-r border-gray-700 p-1 text-center text-xxs font-bold text-gray-700">
                {project.porcentagemComissao}
              </div>
              <div className="col-span-1 flex h-[35px] items-center justify-center p-1 text-center text-xxs font-bold text-gray-700">
                R$ {getProjectTotalComission(project).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComissaoPDFView
