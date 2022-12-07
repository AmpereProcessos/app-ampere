import React from "react";
import { cidadesAtendidas } from "../utils/constants";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { AiOutlineSearch } from "react-icons/ai";
function FormVisitaTecnicaUm({ dados, setDados }) {
  function formatPhone(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
    return cep;
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        INFORMAÇÕES INICIAIS
      </span>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <TextInput
          label={"NOME DO CLIENTE"}
          editable={true}
          value={dados.nomeDoCliente}
          handleChange={(value) =>
            setDados({ ...dados, nomeDoCliente: value.toUpperCase() })
          }
        />
        <TextInput
          label={"TELEFONE DO CLIENTE"}
          editable={true}
          value={dados.telefoneDoCliente}
          handleChange={(value) =>
            setDados({ ...dados, telefoneDoCliente: formatPhone(value) })
          }
        />
        <NumberInput
          label={"Nº DO PROJETO SVB"}
          editable={true}
          value={dados.codigoSVB ? dados.codigoSVB : ""}
          handleChange={(value) =>
            setDados({ ...dados, codigoSVB: Number(value) })
          }
        />
        <SelectInput
          label={"CIDADE"}
          editable={true}
          value={dados.cidade}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ...cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade };
            }),
          ]}
          handleChange={(value) => setDados({ ...dados, cidade: value })}
        />
        <TextInput
          label={"CEP"}
          editable={true}
          value={dados.cep}
          handleChange={(value) =>
            setDados({ ...dados, cep: formatCEP(value) })
          }
        />
        <button className="flex items-center p-1 h-[30px] bg-[#fead61] rounded">
          <AiOutlineSearch />
        </button>
        <TextInput
          label={"BAIRRO"}
          editable={true}
          value={dados.bairro}
          handleChange={(value) =>
            setDados({ ...dados, bairro: value.toUpperCase() })
          }
        />
        <TextInput
          label={"LOGRADOURO"}
          editable={true}
          value={dados.logradouro}
          handleChange={(value) =>
            setDados({ ...dados, logradouro: value.toUpperCase() })
          }
        />
        <NumberInput
          label={"N°RESIDÊNCIA"}
          editable={true}
          value={dados.numeroResidencia}
          handleChange={(value) =>
            setDados({ ...dados, numeroResidencia: Number(value) })
          }
        />
      </div>
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        EQUIPAMENTO
      </span>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectInput
          label={"TIPO DE INVERSOR"}
          editable={true}
          value={dados.tipoDeInversor}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
            { label: "INVERSOR", value: "INVERSOR" },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoInversor: value })}
        />
        <NumberInput
          label={"QTDE DE INVERSORES"}
          editable={true}
          value={dados.qtdeInversor}
          handleChange={(value) =>
            setDados({ ...dados, qtdeInversor: Number(value) })
          }
        />
        <NumberInput
          label={"POTÊNCIA DO INVERSOR"}
          editable={true}
          value={dados.potInversor}
          handleChange={(value) =>
            setDados({ ...dados, potInversor: Number(value) })
          }
        />
        <TextInput
          label={"MARCA DO INVERSOR"}
          editable={true}
          value={dados.marcaInversor}
          handleChange={(value) =>
            setDados({ ...dados, marcaInversor: value.toUpperCase() })
          }
        />
        <NumberInput
          label={"QTDE DE MODULOS"}
          editable={true}
          value={dados.qtdeModulos}
          handleChange={(value) =>
            setDados({ ...dados, qtdeModulos: Number(value) })
          }
        />
        <NumberInput
          label={"POTÊNCIA DOS MÓDULOS"}
          editable={true}
          value={dados.potModulos}
          handleChange={(value) =>
            setDados({ ...dados, potModulos: Number(value) })
          }
        />
        <TextInput
          label={"MARCA DOS MÓDULOS"}
          editable={true}
          value={dados.marcaModulos}
          handleChange={(value) =>
            setDados({ ...dados, marcaModulos: value.toUpperCase() })
          }
        />
      </div>
    </div>
  );
}

export default FormVisitaTecnicaUm;
