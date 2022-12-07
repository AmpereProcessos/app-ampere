import dayjs from "dayjs";
import React from "react";

function PPSModalCallInfo({ tipoDeSolicitacao, dados }) {
  return (
    <div className="flex flex-col  gap-x-2 border border-gray-200 p-2 mt-4 w-full">
      <span className="text-center font-bold">INFORMAÇÕES ADICIONAIS</span>
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
        {tipoDeSolicitacao == "PROPOSTA COMERCIAL" && (
          <>
            <div className="grid grid-cols-2 items-center text-gray-600 w-full">
              <p className="font-bold text-xs text-center">GERAÇÃO</p>
              <p className="text-xs text-center">{dados.geracaoAplicada}</p>
            </div>
            <div className="grid grid-cols-2 items-center text-gray-600 w-full">
              <p className="font-bold text-xs text-center">TOPOLOGIA</p>
              <p className="text-xs text-center">{dados.topologia}</p>
            </div>
            <div className="grid grid-cols-2 items-center text-gray-600 w-full">
              <p className="font-bold text-xs text-center">TIPO DA ESTRUTURA</p>
              <p className="text-xs text-center">{dados.tipoDaEstrutura}</p>
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
                {dayjs(dados.dataDeNascimento).add(4, "h").format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center text-gray-600 w-full">
              <p className="font-bold text-xs text-center">VALOR FINANCIADO</p>
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
              <p className="text-xs text-center">{dados.profissaoDoCliente}</p>
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
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PPSModalCallInfo;
