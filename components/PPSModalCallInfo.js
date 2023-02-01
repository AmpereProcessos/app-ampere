import dayjs from "dayjs";
import React from "react";

function PPSModalCallInfo({ tipoDeSolicitacao, dados }) {
  function getTotalsOfEquipment(arr) {
    let sumTotalPot = 0;
    let sumTotalDailyConsumption = 0;
    for (let i = 0; i < arr.length; i++) {
      sumTotalPot = sumTotalPot + arr[i].qtde * arr[i].pot;
      sumTotalDailyConsumption =
        sumTotalDailyConsumption +
        arr[i].qtde * arr[i].pot * arr[i].horasDiarias;
    }
    return {
      totalPot: sumTotalPot / 1000,
      totalDailyConsumption: sumTotalDailyConsumption,
    };
  }
  return (
    <div className="flex flex-col  gap-x-2 border border-gray-200 p-2 mt-4 w-full">
      <span className="text-center font-bold">INFORMAÇÕES ADICIONAIS</span>
      {tipoDeSolicitacao != "DÚVIDAS E AUXILIOS TÉCNICOS" ? (
        <div className="border border-gray-200 flex flex-col items-center p-2">
          <div className="grid grid-cols-2 items-center text-gray-600 w-full">
            <p className="font-bold text-xs text-center">NOME DO CLIENTE</p>
            <p className="text-xs text-center">{dados.nomeDoCliente}</p>
          </div>
          <div className="grid grid-cols-2 items-center text-gray-600 w-full">
            <p className="font-bold text-xs text-center">TELEFONE</p>
            <p className="text-xs text-center">{dados.telefone}</p>
          </div>
          <div className="grid grid-cols-2 items-center text-gray-600 w-full">
            <p className="font-bold text-xs text-center">CIDADE</p>
            <p className="text-xs text-center">{dados.cidade}</p>
          </div>
          <div className="grid grid-cols-2 items-center text-gray-600 w-full">
            <p className="font-bold text-xs text-center">CPF OU CPNJ?</p>
            <p className="text-xs text-center">{dados.tipoDoCliente}</p>
          </div>
          {(tipoDeSolicitacao == "PROPOSTA COMERCIAL" ||
            tipoDeSolicitacao == "PROPOSTA COMERCIAL (ON GRID)") && (
            <>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">GERAÇÃO</p>
                <p className="text-xs text-center">
                  {dados.geracaoEstimada} kWh
                </p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">TOPOLOGIA</p>
                <p className="text-xs text-center">{dados.topologia}</p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">
                  TIPO DA ESTRUTURA
                </p>
                <p className="text-xs text-center">{dados.tipoDaEstrutura}</p>
              </div>
            </>
          )}
          {tipoDeSolicitacao == "PROPOSTA COMERCIAL (OFF GRID)" && (
            <>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">LOCALIZAÇÃO</p>
                <p className="text-xs text-center">{dados.localizacao}</p>
              </div>
              <div className="flex flex-col text-gray-600 w-full">
                <p className="font-bold text-xs text-center">EQUIPAMENTOS</p>
                <div className="grid grid-cols-6">
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 border-r border-white font-bold">
                    NOME
                  </h1>
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 border-r border-white font-bold">
                    POTÊNCIA NOMINAL
                  </h1>
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 border-r border-white font-bold">
                    QUANTIDADE
                  </h1>
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 border-r border-white font-bold">
                    POTÊNCIA TOTAL
                  </h1>
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 border-r border-white font-bold">
                    HORAS DE USO
                  </h1>
                  <h1 className="bg-gray-600 text-white text-xs text-center p-1 font-bold">
                    Wh DIÁRIO
                  </h1>
                </div>
                {dados.equipamentos.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 border border-t-0 border-gray-200"
                  >
                    <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">
                      {item.nome}
                    </h1>
                    <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">
                      {item.pot}
                    </h1>
                    <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">
                      {item.qtde}
                    </h1>
                    <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">
                      {item.qtde * item.pot}
                    </h1>
                    <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">
                      {item.horasDiarias}
                    </h1>
                    <h1 className="text-gray-600 text-xxs text-center p-2 font-bold">
                      {item.qtde * item.pot * item.horasDiarias}
                    </h1>
                  </div>
                ))}
                <div className="grid grid-cols-6 border border-t-0 border-gray-200">
                  <p className="bg-gray-600 text-white text-xs col-span-5 text-center p-1 border-r border-white font-bold">
                    CONSUMO DIÁRIO TOTAL
                  </p>
                  <p className="text-gray-600 text-xxs col-span-1 text-center p-2 font-bold">
                    {
                      getTotalsOfEquipment(dados.equipamentos)
                        .totalDailyConsumption
                    }
                  </p>
                </div>
                <div className="grid grid-cols-6 border border-t-0 border-gray-200">
                  <p className="bg-gray-600 text-white text-xs col-span-5 text-center p-1 border-r border-white font-bold">
                    POTÊNCIA TOTAL
                  </p>
                  <p className="text-gray-600 text-xxs col-span-1 text-center p-2 font-bold">
                    {getTotalsOfEquipment(dados.equipamentos).totalPot}
                  </p>
                </div>
              </div>
            </>
          )}
          {tipoDeSolicitacao == "ANÁLISE DE CRÉDITO" && (
            <>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">CPF/CNPJ</p>
                <p className="text-xs text-center">{dados.cpf_cnpj}</p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">EMAIL</p>
                <p className="text-xs text-center">{dados.email}</p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">DATA NASCIMENTO</p>
                <p className="text-xs text-center">
                  {dayjs(dados.dataDeNascimento)
                    .add(4, "h")
                    .format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">
                  VALOR FINANCIADO
                </p>
                <p className="text-xs text-center">
                  R${dados.valorFinanciamento.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">RENDA</p>
                <p className="text-xs text-center">
                  R${dados.rendaDoCliente.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">ENDEREÇO</p>
                <p className="text-xs text-center">{dados.enderecoDoCliente}</p>
              </div>
              <div className="grid grid-cols-2 items-center text-gray-600 w-full">
                <p className="font-bold text-xs text-center">PROFISSÃO</p>
                <p className="text-xs text-center">
                  {dados.profissaoDoCliente}
                </p>
              </div>
              {dados.links?.length > 0 && (
                <div className="flex flex-col gap-x-2 p-2 mt-4">
                  <span className="font-bold text-center font-raleway">
                    LINKS
                  </span>
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
        <div className="flex flex-col gap-x-2 p-2 mt-4">
          <span className="font-bold text-center font-raleway">DÚVIDAS</span>
          <span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic">
            {dados.duvida ? (
              <ul className="text-xs font-bold text-center list-none">
                {dados.duvida.split("/").map((string, index) => (
                  <li key={index}>{string}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center italic text-gray-600">
                SEM OBSERVAÇÕES...
              </p>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default PPSModalCallInfo;
