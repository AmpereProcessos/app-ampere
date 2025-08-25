import axios from 'axios'
import React, { useState } from 'react'

function OSCard({ info, reload }) {
  const [os, setOs] = useState(info)
  function handleChange(id, index, status, date) {
    console.log(os)
    axios
      .post('/api/ordensDeServico/realizarCobranca', {
        id: id,
        index: index,
        status: status,
        date: date,
      })
      .then((res) => reload())
  }
  return (
    <div className="flex flex-col rounded border border-blue-300 p-2 shadow-lg">
      <div className="border-primary/20 flex flex-wrap items-center justify-around gap-2 border-b pb-2">
        <h1 className="text-center font-bold text-[#15599a]">
          {os.qtde} - {os.nomeDoContrato}
        </h1>
        <p className="font-raleway text-primary/60 text-sm">TELEFONE: {os.telefone ? os.telefone : '-'}</p>
        <p className="font-raleway text-primary/60 text-sm">CONTATO (PAGADOR): {os.pagamento?.contatoPagador ? os.pagamento?.contatoPagador : '-'}</p>
      </div>
      {os.ordensDeServico?.map((ordem, index) => {
        if (ordem.cobrancaRealizada == false) {
          return (
            <div
              key={index}
              className={`mt-1 flex flex-wrap ${ordem.dataDeFechamento == undefined && 'hidden'} border-primary/20 items-center justify-around border-b pb-2`}
            >
              <div className="flex flex-col items-center">
                <p className="text-primary/60 uppercase">SERVIÇO PARA EXECUÇÃO</p>
                <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
              </div>
              <div className="hidden flex-col items-center lg:flex">
                <p className="text-primary/60 uppercase">REALIZAR COBRANÇA?</p>
                <p className="text-xs uppercase">{ordem.realizarCobranca ? 'SIM' : 'NÃO'}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/60 uppercase">VALOR DA COBRANÇA</p>
                <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary/60 uppercase">EMISSOR DA OS</p>
                <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
              </div>
              <div className="hidden flex-col items-center lg:flex">
                <p className="text-primary/60 uppercase">DATA DE ABERTURA</p>
                <p className="text-xs uppercase">{new Date(ordem.dataDeAbertura).toLocaleDateString()}</p>
              </div>
              <div className="hidden flex-col items-center lg:flex">
                <p className="text-primary/60 uppercase">DATA DE FECHAMENTO</p>
                <p className="text-xs uppercase">
                  {ordem.dataDeFechamento != undefined ? new Date(new Date(ordem.dataDeFechamento).setHours(27)).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className={`flex flex-col items-center ${ordem.cobrancaRealizada != true ? 'text-red-500' : 'text-primary/60'}`}>
                <p className="uppercase">DATA DE COBRANÇA</p>
                <input
                  type="date"
                  className="bg-transparent text-xs"
                  value={ordem.dataDeCobranca ? new Date(ordem.dataDeCobranca).toISOString().slice(0, 10) : null}
                  onChange={(e) => {
                    setOs((prevState) => {
                      let temp = {
                        ...prevState,
                        ordensDeServico: [...prevState.ordensDeServico],
                      }
                      temp.ordensDeServico[index].cobrancaRealizada = true
                      temp.ordensDeServico[index].dataDeCobranca = new Date(e.target.value).toISOString().slice(0, 10)
                      return temp
                    })
                    handleChange(os._id, index, true, new Date(e.target.value))
                  }}
                />
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default OSCard
