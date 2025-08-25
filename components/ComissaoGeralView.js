import axios from 'axios'
import dayjs from 'dayjs'
import React from 'react'
import { BsPatchCheckFill } from 'react-icons/bs'
function ComissaoGeralView({ projects, setProjects }) {
  function validateComissions() {
    axios.post('/api/projects/comissao', projects).then((res) => alert(res.data))
  }
  function setAsPaid(id, index, porcentagemComissao) {
    axios
      .post(`/api/projects/update/${id}`, {
        'contrato.comissaoPaga': true,
        'contrato.comissaoVendedor': porcentagemComissao,
      })
      .then((res) => {
        let arr = [...projects]
        arr[index].contrato.comissaoPaga = true
        setProjects([...arr])
      })
  }
  function getTotal(project, pa, comission) {
    const projectValue = project ? (project * comission) / 100 : 0
    const paValue = pa ? (pa * comission) / 100 : 0
    return (projectValue + paValue).toLocaleString('pt-br', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <button
          onClick={validateComissions}
          className="mt-4 rounded bg-green-400 p-2 font-bold transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
        >
          VALIDAR INFORMAÇÕES
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {projects?.map((project, index) => (
          <div key={index} className="border-primary/20 flex w-full flex-col rounded border p-2">
            <div className="flex items-center justify-between">
              <h1 className="text-md col-span-2 self-center pb-2 text-center font-bold text-[#15599a]">
                #{project.qtde} - {project.nomeDoContrato}
              </h1>
              {project.contrato.comissaoPaga ? (
                <BsPatchCheckFill style={{ color: 'rgb(34 197 94)', fontSize: '25px' }} />
              ) : (
                <button
                  onClick={() => setAsPaid(project._id, index, project.porcentagemComissao)}
                  className="rounded border border-green-500 p-1 font-bold text-green-500 hover:bg-green-500 hover:text-white"
                >
                  PAGO?
                </button>
              )}
            </div>

            <div className="border-primary/20 flex flex-wrap items-center justify-center gap-3 border-b pb-1 lg:justify-between">
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">CÓDIGO SVB</p>
                <p className="text-primary/80 text-xs">{project.codigoSVB ? project.codigoSVB : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">DATA ASSINATURA</p>
                <p className="text-primary/80 text-xs">
                  {project.contrato.dataAssinatura ? dayjs(project.contrato.dataAssinatura).add(4, 'hours').format('DD/MM/YYYY') : '-'}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">DATA PAGAMENTO</p>
                <p className="text-primary/80 text-xs">
                  {project.compra && project.compra.dataPagamento ? dayjs(project.compra.dataPagamento).add(4, 'hours').format('DD/MM/YYYY') : '-'}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">DATA RECEBIMENTO</p>
                <p className="text-primary/80 text-xs">
                  {project.pagamento && project.pagamento.dataRecebimento
                    ? dayjs(project.pagamento.dataRecebimento).add(4, 'hours').format('DD/MM/YYYY')
                    : '-'}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">TIPO DE SERVIÇO</p>
                <p className="text-primary/80 text-xs">{project.tipoDeServico ? project.tipoDeServico : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">CIDADE</p>
                <p className="text-primary/80 text-xs">{project.cidade ? project.cidade : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">VENDEDOR</p>
                <p className="text-primary/80 text-xs">{project.vendedor ? project.vendedor.nome : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">POTÊNCIA PICO</p>
                <p className="text-primary/80 text-xs">{project.sistema ? `${project.sistema.potPico} kWp` : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">CANAL DE VENDA</p>
                <p className="text-primary/80 text-xs">{typeof project.canalVenda == 'string' ? project.canalVenda : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">INSIDER</p>
                <p className="text-primary/80 text-xs">{project.insider ? project.insider : 'NÃO POSSUI'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">VALOR DO PROJETO</p>
                <p className="text-primary/80 text-xs">{project.sistema?.valorProjeto ? `R$ ${project.sistema.valorProjeto.toFixed(2)}` : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">VALOR DO PADRÃO</p>
                <p className="text-primary/80 text-xs">{project.padrao?.valor ? `R$ ${project.padrao.valor.toFixed(2)}` : '-'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/70 text-xs font-bold">VALOR DA ESTRUTURA</p>
                <p className="text-primary/80 text-xs">
                  {project.estruturaPersonalizada?.valor ? `R$ ${project.estruturaPersonalizada.valor.toFixed(2)}` : '-'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <p className="text-primary/70 text-center text-sm font-bold">PORCENTAGEM DE COMISSÃO</p>
                  <input
                    type="number"
                    value={project.porcentagemComissao ? project.porcentagemComissao : 0}
                    className="text-primary/80 p-2 text-center text-xs outline-hidden"
                    onChange={(e) => {
                      let arr = [...projects]
                      arr[index].porcentagemComissao = Number(e.target.value)
                      setProjects([...arr])
                    }}
                  />
                </div>
                {project.insider && (
                  <div className="flex flex-col items-center">
                    <p className="text-primary/70 text-center text-sm font-bold">PORCENTAGEM DE COMISSÃO INSIDER</p>
                    <input
                      type="number"
                      value={project.porcentagemComissaoInsider ? project.porcentagemComissaoInsider : 0}
                      className="text-primary/80 p-2 text-center text-xs outline-hidden"
                      onChange={(e) => {
                        let arr = [...projects]
                        arr[index].porcentagemComissaoInsider = Number(e.target.value)
                        setProjects([...arr])
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <p className="text-primary/70 text-center text-sm font-bold">VALOR (PROJETO)</p>
                  <p className="text-primary/80 p-2 text-center text-xs">
                    R$
                    {project.sistema.valorProjeto ? ((project.sistema.valorProjeto * project.porcentagemComissao) / 100).toFixed(2) : 0}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-primary/70 text-center text-sm font-bold">VALOR (PADRÃO)</p>
                  <p className="text-primary/80 p-2 text-center text-xs">
                    R$
                    {project.padrao.valor ? ((project.padrao.valor * project.porcentagemComissao) / 100).toFixed(2) : 0}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-primary/70 text-center text-sm font-bold">VALOR TOTAL</p>
                  <p className="text-primary/80 p-2 text-center text-xs">
                    R$
                    {project.padrao.valor || project.sistema.valorProjeto
                      ? getTotal(project.sistema.valorProjeto, project.padrao.valor, project.porcentagemComissao)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ComissaoGeralView
