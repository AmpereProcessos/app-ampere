import React from "react";
import { cidadesAtendidas } from "../utils/constants";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
function FormVisitaTecnicaUm({ dados, setDados, images, setImages }) {
  function formatPhone(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          console.log(res.data.erro);
          return;
        } else {
          console.log(
            cidadesAtendidas.includes(res.data.localidade.toUpperCase())
          );
          console.log(res.data.localidade);
          setDados({
            ...dados,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "ITUIUTABA",
            logradouro: res.data.logradouro,
          });
        }
      });
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
    return cep;
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
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
        <button
          onClick={() => findCPF()}
          className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
        >
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
        <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            OBSERVAÇÕES PARA VISITA
          </span>
          <textarea
            placeholder={"Descrição aqui.."}
            value={dados.obsVisita}
            onChange={(e) => setDados({ ...dados, obsVisita: e.target.value })}
            className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectInput
          label={"TIPO DE LAUDO"}
          editable={true}
          value={dados.tipoDeLaudo}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            {
              label: "ESTUDO SIMPLES (36 HORAS)",
              value: "ESTUDO SIMPLES (36 HORAS)",
            },
            {
              label: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
              value: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
            },
            {
              label: "ESTUDO COMPLEXO (72 HORAS)",
              value: "ESTUDO COMPLEXO (72 HORAS)",
            },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoDeLaudo: value })}
        />
        <SelectInput
          label={"TIPO DE SOLICITAÇÃO"}
          editable={true}
          value={dados.tipoDeSolicitacao}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            {
              label: "VISITA TÉCNICA REMOTA - URBANA",
              value: "VISITA TÉCNICA REMOTA - URBANA",
            },
            {
              label: "VISITA TÉCNICA REMOTA - RURAL",
              value: "VISITA TÉCNICA REMOTA - RURAL",
            },
            {
              label: "VISITA TÉCNICA IN LOCO - URBANA",
              value: "VISITA TÉCNICA IN LOCO - URBANA",
            },
            {
              label: "VISITA TÉCNICA IN LOCO - RURAL",
              value: "VISITA TÉCNICA IN LOCO - RURAL",
            },
            { label: "ALTERAÇÃO DE PROJETO", value: "ALTERAÇÃO DE PROJETO" },
            { label: "DESENHO PERSONALIZADO", value: "DESENHO PERSONALIZADO" },
            { label: "ORÇAMENTAÇÃO", value: "ORÇAMENTAÇÃO" },
          ]}
          handleChange={(value) =>
            setDados({ ...dados, tipoDeSolicitacao: value })
          }
        />
      </div>
      <div className="w-fit flex flex-col items-center self-center">
        <label
          className="ml-2 text-center text-[#15599a] font-bold"
          htmlFor="propostaComercial"
        >
          PRINT A TELA E ENVIE SUA LOCALIZAÇÃO
        </label>
        <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
          <div className="absolute">
            {images.localizacao ? (
              <div className="flex flex-col items-center">
                <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                <span className="block text-gray-400 font-normal text-center">
                  {images.localizacao.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                <span className="block text-gray-400 font-normal">
                  Adicione o arquivo aqui
                </span>
              </div>
            )}
          </div>
          <input
            onChange={(e) =>
              setImages({
                ...images,
                localizacao: e.target.files[0],
              })
            }
            className="h-full w-full opacity-0"
            type="file"
            accept=".png, .jpeg, .pdf"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <button className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded">
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaUm;
