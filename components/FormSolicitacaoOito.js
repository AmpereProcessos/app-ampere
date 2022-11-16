import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
  return cep;
}
function FormSolicitacaoOito({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState("");
  const [idemContrato, setIdemContrato] = useState("NÂO");
  function validarCamposObrigatorios() {
    if (dados.nomePagador.trim().length < 3) {
      setMessage("Por favor, preencha o nome do pagador.");
      return false;
    }
    if (dados.contatoPagador.trim().length < 8) {
      setMessage("Por favor, preencha o contato do pagador.");
      return false;
    }
    if (dados.cpf_cnpjNF.trim().length < 11) {
      setMessage("Por favor, preencha um CPF/CPNJ válido para NF");
      return false;
    }
    if (dados.restricoesEntrega == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha as restrições para entrega.");
      return false;
    }
    if (dados.valorContrato == null || dados.valorContrato == 0) {
      setMessage("Por favor, preencha o valor do contrato fotovoltaico.");
      return false;
    }
    if (dados.origemRecurso == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha a origem do recurso.");
      return false;
    }
    if (dados.formaDePagamento == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha a forma de pagamento.");
      return false;
    }
    if (
      dados.origemRecurso == "FINANCIAMENTO" &&
      dados.credor == "NÃO DEFINIDO"
    ) {
      setMessage("Por favor, preencha o credor do financiamento.");
      return false;
    }
    if (
      dados.origemRecurso == "FINANCIAMENTO" &&
      dados.credor == "NÃO DEFINIDO"
    ) {
      setMessage("Por favor, preencha o credor do financiamento.");
      return false;
    }
    if (
      dados.origemRecurso == "FINANCIAMENTO" &&
      dados.nomeGerente.trim().length < 5
    ) {
      setMessage("Por favor, preencha o nome do gerente.");
      return false;
    }
    if (
      dados.origemRecurso == "FINANCIAMENTO" &&
      dados.contatoGerente.trim().length < 8
    ) {
      setMessage("Por favor, preencha o contato do gerente.");
      return false;
    }
    setMessage("");
    return true;
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  function getIdemContrato() {
    setIdemContrato("SIM");
    setDados({
      ...dados,
      nomePagador: dados.nomeDoContrato,
      contatoPagador: dados.telefone,
      cpf_cnpjNF: dados.cpf_cnpj,
    });
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS FINANCEIROS E NEGOCIAÇÃO
      </span>
      <div className="flex justify-center">
        <SelectInput
          label={"IDEM CONTRATO?"}
          editable={true}
          options={[
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "SIM",
              value: "SIM",
            },
          ]}
          valor={idemContrato}
          handleChange={(value) => {
            if (value == "SIM") {
              getIdemContrato();
            } else setIdemContrato(value);
          }}
        />
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <TextInput
          label={"NOME DO PAGADOR"}
          editable={true}
          value={dados.nomePagador}
          handleChange={(value) => setDados({ ...dados, nomePagador: value })}
        />
        <TextInput
          label={"CONTATO DO PAGADOR"}
          editable={true}
          value={dados.contatoPagador}
          handleChange={(value) =>
            setDados({ ...dados, contatoPagador: phoneMask(value) })
          }
        />
        <TextInput
          label={"CPF/CNPJ PARA NF"}
          editable={true}
          value={dados.cpf_cnpjNF}
          handleChange={(value) =>
            setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })
          }
        />
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectInput
          label={"NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?"}
          editable={true}
          value={dados.necessidaInscricaoRural}
          handleChange={(value) =>
            setDados({ ...dados, necessidaInscricaoRural: value })
          }
          options={[
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "SIM",
              value: "SIM",
            },
          ]}
        />
        {dados.necessidaInscricaoRural == "SIM" && (
          <TextInput
            label={"INSCRIÇÃO RURAL"}
            editable={true}
            value={dados.inscriçãoRural}
            handleChange={(value) =>
              setDados({ ...dados, inscriçãoRural: value })
            }
          />
        )}
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectInput
          label={"LOCAL DE ENTREGA"}
          options={[
            {
              label: "MESMO DO PROJETO",
              value: "MESMO DO PROJETO",
            },
            {
              label: "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
              value: "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
            },
            {
              label:
                "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
              value:
                "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
            },
          ]}
          editable={true}
          value={dados.localEntrega}
          handleChange={(value) => setDados({ ...dados, localEntrega: value })}
        />
        <SelectInput
          label={"END. ENTREGA IGUAL COBRANÇA?"}
          editable={true}
          value={dados.entregaIgualCobranca}
          handleChange={(value) =>
            setDados({ ...dados, entregaIgualCobranca: value })
          }
          options={[
            {
              label: "SIM",
              value: "SIM",
            },
            {
              label: "NÃO",
              value: "NÃO",
            },
          ]}
        />
        <SelectInput
          label={"HÁ RESTRIÇÕES PARA ENTREGA?"}
          editable={true}
          value={dados.restricoesEntrega}
          handleChange={(value) =>
            setDados({ ...dados, restricoesEntrega: value })
          }
          options={[
            {
              label: "SOMENTE HORARIO COMERCIAL",
              value: "SOMENTE HORARIO COMERCIAL",
            },
            {
              label: "NÃO HÁ RESTRIÇÕES",
              value: "NÃO HÁ RESTRIÇÕES",
            },
            {
              label: "CASA EM CONSTRUÇÃO",
              value: "CASA EM CONSTRUÇÃO",
            },
            {
              label: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
              value: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
        />
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <NumberInput
          label={"VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"}
          editable={true}
          tag={"R$"}
          value={dados.valorContrato}
          handleChange={(value) =>
            setDados({ ...dados, valorContrato: Number(value) })
          }
        />
        <SelectInput
          label={"ORIGEM DO RECURSO"}
          editable={true}
          value={dados.origemRecurso}
          handleChange={(value) => setDados({ ...dados, origemRecurso: value })}
          options={[
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
            {
              label: "FINANCIAMENTO",
              value: "FINANCIAMENTO",
            },
            {
              label: "CAPITAL PRÓPRIO",
              value: "CAPITAL PRÓPRIO",
            },
          ]}
        />
        {dados.origemRecurso == "FINANCIAMENTO" && (
          <>
            <SelectInput
              label={"CREDOR"}
              editable={true}
              options={[
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
                {
                  label: "BANCO DO BRASIL",
                  value: "BANCO DO BRASIL",
                },
                {
                  label: "BRADESCO",
                  value: "BRADESCO",
                },
                {
                  label: "BV FINANCEIRA",
                  value: "BV FINANCEIRA",
                },
                {
                  label: "CAIXA",
                  value: "CAIXA",
                },
                {
                  label: "COOPACREDI",
                  value: "COOPACREDI",
                },
                {
                  label: "CREDICAMPINA",
                  value: "CREDICAMPINA",
                },
                {
                  label: "CREDIPONTAL",
                  value: "CREDIPONTAL",
                },
                {
                  label: "SANTANDER",
                  value: "SANTANDER",
                },
                {
                  label: "SOL FACIL",
                  value: "SOL FACIL",
                },
                {
                  label: "SICOOB ARACOOP",
                  value: "SICOOB ARACOOP",
                },
              ]}
              valor={dados.credor}
              handleChange={(value) => setDados({ ...dados, credor: value })}
            />
            <TextInput
              label={"NOME DO GERENTE"}
              editable={true}
              value={dados.nomeGerente}
              handleChange={(value) =>
                setDados({ ...dados, nomeGerente: value })
              }
            />
            <TextInput
              label={"CONTATO DO GERENTE"}
              editable={true}
              value={dados.contatoGerente}
              handleChange={(value) =>
                setDados({ ...dados, contatoGerente: phoneMask(value) })
              }
            />
          </>
        )}
        <NumberInput
          label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
          editable={true}
          value={dados.numParcelas}
          handleChange={(value) =>
            setDados({
              ...dados,
              numParcelas: Number(value),
              valorParcela: dados.valorContrato / Number(value),
            })
          }
        />
        <NumberInput
          label={"VALOR DA PARCELA"}
          editable={true}
          value={dados.valorParcela}
          tag={"R$"}
          handleChange={(value) =>
            setDados({ ...dados, valorParcela: Number(value) })
          }
        />
        <SelectInput
          label={"NECESSIDADE N.F ADIANTADA"}
          editable={true}
          value={dados.necessidadeNFAdiantada}
          options={[
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "SIM",
              value: "SIM",
            },
          ]}
          handleChange={(value) =>
            setDados({ ...dados, necessidadeNFAdiantada: value })
          }
        />
        <SelectInput
          label={"NECESSIDADE CÓDIGO FINAME?"}
          editable={true}
          value={dados.necessidadeCodigoFiname}
          options={[
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "SIM",
              value: "SIM",
            },
          ]}
          handleChange={(value) =>
            setDados({ ...dados, necessidadeCodigoFiname: value })
          }
        />
        <SelectInput
          label={"FORMA DE PAGAMENTO"}
          editable={true}
          options={[
            {
              label:
                "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
              value:
                "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
            },
            {
              label: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
              value: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
            },
            {
              label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
              value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          value={dados.formaDePagamento}
          handleChange={(value) =>
            setDados({ ...dados, formaDePagamento: value })
          }
        />
      </div>
      <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          DESCRIÇÃO DA NEGOCIAÇÃO
        </span>
        <textarea
          placeholder={"Descreva aqui a negociação"}
          value={dados.descricaoNegociacao}
          onChange={(e) =>
            setDados({
              ...dados,
              descricaoNegociacao: e.target.value,
            })
          }
          className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
        />
      </div>
      {message && <p className="text-red-400 italic text-center">{message}</p>}
      <div className="flex w-full justify-center gap-2 flex-wrap mt-2">
        <button
          onClick={voltar}
          className="bg-[#15599a] rounded p-2 font-bold text-white"
        >
          VOLTAR
        </button>
        <button
          onClick={proximaEtapa}
          className="w-fit text-center p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold "
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormSolicitacaoOito;
