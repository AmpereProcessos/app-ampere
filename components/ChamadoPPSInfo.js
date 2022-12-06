import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { cidadesAtendidas } from "../utils/constants";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import dayjs from "dayjs";
function ChamadosExternoPPSInfo({ dados, setDados, setStage }) {
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
  return (
    <div className="mt-12 w-full self-center lg:w-[75%] min-h-[275px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] p-12 shadow-lg bg-[#fff]">
      <TextInput
        label={"NOME COMPLETO"}
        editable={true}
        value={dados.nomeDoCliente}
        handleChange={(value) =>
          setDados({ ...dados, nomeDoCliente: value.toUpperCase() })
        }
      />
      <TextInput
        label={"Telefone"}
        editable={true}
        value={dados.telefone}
        handleChange={(value) =>
          setDados({ ...dados, telefone: phoneMask(value) })
        }
      />
      <SelectInput
        label={"CIDADE"}
        editable={true}
        options={[
          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ...cidadesAtendidas.map((cidade) => {
            return { label: cidade, value: cidade };
          }),
        ]}
        handleChange={(value) => setDados({ ...dados, cidade: value })}
      />
      <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          OBSERVAÇÕES
        </span>
        <textarea
          placeholder={"Descrição da solicitação aqui.."}
          value={dados.observacoes}
          onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
          className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
        />
      </div>
      {dados.tipoDeSolicitacao == "PROPOSTA COMERCIAL" && (
        <>
          <NumberInput
            label={"GERAÇÃO"}
            editable={true}
            unit={"kWh"}
            value={dados.consumoCliente}
            handleChange={(value) =>
              setDados({ ...dados, consumoCliente: Number(value) })
            }
          />
          <SelectInput
            label={"TOPOLOGIA"}
            editable={true}
            value={dados.topologia}
            options={[
              { label: "INVERSOR", value: "INVERSOR" },
              { label: "MICRO", value: "MICRO" },
              { label: "OUTROS SERV.", value: "OUTROS SERV." },
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
            handleChange={(value) => setDados({ ...dados, topologia: value })}
          />
          <SelectInput
            label={"ESTRUTURA"}
            editable={true}
            value={dados.estrutura}
          />
        </>
      )}
      {dados.tipoDeSolicitacao == "ANÁLISE DE CRÉDITO" && (
        <>
          <TextInput
            label={"CPF"}
            editable={true}
            value={dados.cpf_cnpj}
            handleChange={(value) =>
              setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })
            }
          />
          <TextInput
            label={"EMAIL"}
            editable={true}
            value={dados.email}
            normalCase={true}
            handleChange={(value) => setDados({ ...dados, email: value })}
          />
          <DateInput
            label={"DATA DE NASCIMENTO"}
            editable={true}
            value={
              dados.dataDeNascimento
                ? new Date(dados.dataDeNascimento).toISOString().slice(0, 10)
                : null
            }
            handleChange={(value) =>
              setDados({
                ...dados,
                dataDeNascimento: dayjs(value).isValid()
                  ? new Date(value).toISOString()
                  : null,
              })
            }
          />
          <NumberInput
            label={"VALOR FINANCIADO"}
            tag={"R$"}
            editable={true}
            value={dados.valorFinanciamento}
            handleChange={(value) =>
              setDados({ ...dados, valorFinanciamento: Number(value) })
            }
          />
          <NumberInput
            label={"RENDA"}
            tag={"R$"}
            editable={true}
            value={dados.rendaDoCliente}
            handleChange={(value) =>
              setDados({ ...dados, rendaDoCliente: Number(value) })
            }
          />
          <TextInput
            label={"ENDEREÇO"}
            editable={true}
            value={dados.enderecoDoCliente}
            handleChange={(value) =>
              setDados({ ...dados, enderecoDoCliente: value.toUpperCase() })
            }
          />
          <TextInput
            label={"PROFISSÃO"}
            editable={true}
            value={dados.profissaoDoCliente}
            handleChange={(value) =>
              setDados({ ...dados, profissaoDoCliente: value.toUpperCase() })
            }
          />
        </>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setStage((prevState) => prevState - 1)}
          className="bg-[#15599a] text-white font-bold p-2 rounded hover:bg-[#fead61] hover:text-black"
        >
          VOLTAR
        </button>
        <button className="bg-[#fead61] font-bold p-2 rounded hover:bg-[#15599a] hover:text-white">
          ENVIAR
        </button>
      </div>
    </div>
  );
}

export default ChamadosExternoPPSInfo;
