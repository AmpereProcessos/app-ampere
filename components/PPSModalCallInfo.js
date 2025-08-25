import dayjs from 'dayjs'
import React from 'react'

function PPSModalCallInfo({ tipoDeSolicitacao, dados }) {
  function getTotalsOfEquipment(arr) {
    let sumTotalPot = 0
    let sumTotalDailyConsumption = 0
    for (let i = 0; i < arr.length; i++) {
      sumTotalPot = sumTotalPot + arr[i].qtde * arr[i].pot
      sumTotalDailyConsumption = sumTotalDailyConsumption + arr[i].qtde * arr[i].pot * arr[i].horasDiarias
    }
    return {
      totalPot: sumTotalPot / 1000,
      totalDailyConsumption: sumTotalDailyConsumption,
    }
  }
  return (
    <div className="border-primary/20 mt-4 flex w-full flex-col gap-x-2 border p-2">
      <span className="text-center font-bold">INFORMAÇÕES ADICIONAIS</span>
      {tipoDeSolicitacao != 'DÚVIDAS E AUXILIOS TÉCNICOS' ? (
        <div className="border-primary/20 flex flex-col items-center border p-2">
          <div className="text-primary/80 grid w-full grid-cols-2 items-center">
            <p className="text-center text-xs font-bold">NOME DO CLIENTE</p>
            <p className="text-center text-xs">{dados.nomeDoCliente}</p>
          </div>
          <div className="text-primary/80 grid w-full grid-cols-2 items-center">
            <p className="text-center text-xs font-bold">TELEFONE</p>
            <p className="text-center text-xs">{dados.telefone}</p>
          </div>
          <div className="text-primary/80 grid w-full grid-cols-2 items-center">
            <p className="text-center text-xs font-bold">CIDADE</p>
            <p className="text-center text-xs">{dados.cidade}</p>
          </div>
          <div className="text-primary/80 grid w-full grid-cols-2 items-center">
            <p className="text-center text-xs font-bold">CPF OU CPNJ?</p>
            <p className="text-center text-xs">{dados.tipoDoCliente}</p>
          </div>
          {(tipoDeSolicitacao == 'PROPOSTA COMERCIAL' || tipoDeSolicitacao == 'PROPOSTA COMERCIAL (ON GRID)') && (
            <>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">GERAÇÃO</p>
                <p className="text-center text-xs">{dados.geracaoEstimada} kWh</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">TOPOLOGIA</p>
                <p className="text-center text-xs">{dados.topologia}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">TIPO DA ESTRUTURA</p>
                <p className="text-center text-xs">{dados.tipoDaEstrutura}</p>
              </div>
            </>
          )}
          {tipoDeSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)' && (
            <>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">LOCALIZAÇÃO</p>
                <p className="text-center text-xs">{dados.localizacao}</p>
              </div>
              <div className="text-primary/80 flex w-full flex-col">
                <p className="text-center text-xs font-bold">EQUIPAMENTOS</p>
                <div className="grid grid-cols-6">
                  <h1 className="bg-primary/80 border-r border-white p-1 text-center text-xs font-bold text-white">NOME</h1>
                  <h1 className="bg-primary/80 border-r border-white p-1 text-center text-xs font-bold text-white">POTÊNCIA NOMINAL</h1>
                  <h1 className="bg-primary/80 border-r border-white p-1 text-center text-xs font-bold text-white">QUANTIDADE</h1>
                  <h1 className="bg-primary/80 border-r border-white p-1 text-center text-xs font-bold text-white">POTÊNCIA TOTAL</h1>
                  <h1 className="bg-primary/80 border-r border-white p-1 text-center text-xs font-bold text-white">HORAS DE USO</h1>
                  <h1 className="bg-primary/80 p-1 text-center text-xs font-bold text-white">Wh DIÁRIO</h1>
                </div>
                {dados.equipamentos.map((item, index) => (
                  <div key={index} className="border-primary/20 grid grid-cols-6 border border-t-0">
                    <h1 className="text-primary/80 text-xxs border-primary/20 border-r p-2 text-center font-bold">{item.nome}</h1>
                    <h1 className="text-primary/80 text-xxs border-primary/20 border-r p-2 text-center font-bold">{item.pot}</h1>
                    <h1 className="text-primary/80 text-xxs border-primary/20 border-r p-2 text-center font-bold">{item.qtde}</h1>
                    <h1 className="text-primary/80 text-xxs border-primary/20 border-r p-2 text-center font-bold">{item.qtde * item.pot}</h1>
                    <h1 className="text-primary/80 text-xxs border-primary/20 border-r p-2 text-center font-bold">{item.horasDiarias}</h1>
                    <h1 className="text-primary/80 text-xxs p-2 text-center font-bold">{item.qtde * item.pot * item.horasDiarias}</h1>
                  </div>
                ))}
                <div className="border-primary/20 grid grid-cols-6 border border-t-0">
                  <p className="bg-primary/80 col-span-5 border-r border-white p-1 text-center text-xs font-bold text-white">CONSUMO DIÁRIO TOTAL</p>
                  <p className="text-primary/80 text-xxs col-span-1 p-2 text-center font-bold">
                    {getTotalsOfEquipment(dados.equipamentos).totalDailyConsumption}
                  </p>
                </div>
                <div className="border-primary/20 grid grid-cols-6 border border-t-0">
                  <p className="bg-primary/80 col-span-5 border-r border-white p-1 text-center text-xs font-bold text-white">POTÊNCIA TOTAL</p>
                  <p className="text-primary/80 text-xxs col-span-1 p-2 text-center font-bold">{getTotalsOfEquipment(dados.equipamentos).totalPot}</p>
                </div>
              </div>
            </>
          )}
          {tipoDeSolicitacao == 'ANÁLISE DE CRÉDITO' && (
            <>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">CPF/CNPJ</p>
                <p className="text-center text-xs">{dados.cpf_cnpj}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">EMAIL</p>
                <p className="text-center text-xs">{dados.email}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">DATA NASCIMENTO</p>
                <p className="text-center text-xs">{dayjs(dados.dataDeNascimento).add(4, 'h').format('DD/MM/YYYY')}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">VALOR FINANCIADO</p>
                <p className="text-center text-xs">R${dados.valorFinanciamento.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">RENDA</p>
                <p className="text-center text-xs">R${dados.rendaDoCliente.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">ENDEREÇO</p>
                <p className="text-center text-xs">{dados.enderecoDoCliente}</p>
              </div>
              <div className="text-primary/80 grid w-full grid-cols-2 items-center">
                <p className="text-center text-xs font-bold">PROFISSÃO</p>
                <p className="text-center text-xs">{dados.profissaoDoCliente}</p>
              </div>
              {dados.links?.length > 0 && (
                <div className="mt-4 flex flex-col gap-x-2 p-2">
                  <span className="font-raleway text-center font-bold">LINKS</span>
                  <div className="flex flex-col items-center">
                    {dados.links.map((x, index) => (
                      <div key={index} className="flex items-center gap-x-2">
                        <a className="text-blue-300" href={x.link}>
                          {x.title}
                          {x.format ? ` - ${x.format}` : false}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-x-2 p-2">
          <span className="font-raleway text-center font-bold">DÚVIDAS</span>
          <span className="font-raleway bg-primary/20 grow p-4 text-center text-sm italic">
            {dados.duvida ? (
              <ul className="list-none text-center text-xs font-bold">
                {dados.duvida.split('/').map((string, index) => (
                  <li key={index}>{string}</li>
                ))}
              </ul>
            ) : (
              <p className="text-primary/80 text-center italic">SEM OBSERVAÇÕES...</p>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default PPSModalCallInfo
