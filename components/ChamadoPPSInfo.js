import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { cidadesAtendidas } from "../utils/constants";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import dayjs from "dayjs";
function ChamadosExternoPPSInfo({ dados, setDados, setStage }) {
  const [images, setImages] = useState({});
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
  console.log(dados);
  console.log(images);
  return (
    <div className="mt-12 w-full self-center lg:w-[75%] min-h-[275px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] p-2 shadow-lg bg-[#fff]">
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
      <SelectInput
        label={"CPF ou CNPJ?"}
        editable={true}
        value={dados.tipoDoCliente}
        options={[
          { label: "CPF", value: "CPF" },
          { label: "CNPJ", value: "CNPJ" },
          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
        ]}
        handleChange={(value) => setDados({ ...dados, tipoDoCliente: value })}
      />
      <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          OBSERVAÇÕES
        </span>
        <textarea
          placeholder={"Descrição da solicitação aqui.."}
          value={dados.observacoes}
          onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
          className="w-full text-center h-[80px] bg-gray-100 resize-none p-2 outline-none border border-gray-600"
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
            label={"CPF/CPNJ"}
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
      {dados.tipoDoCliente == "CPF" && (
        <>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="comprovanteDeEndereco"
            >
              COMPROVANTE DE ENDEREÇO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.comprovanteDeEndereco ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.comprovanteDeEndereco.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    comprovanteDeEndereco: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="comprovanteDeRenda"
            >
              COMPROVANTE DE RENDA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.comprovanteDeRenda ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.comprovanteDeRenda.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    comprovanteDeRenda: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="documentoPessoal"
            >
              DOCUMENTO COM CPF E RG
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.documentoPessoal ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.documentoPessoal.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    documentoPessoal: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </>
      )}
      {dados.tipoDoCliente == "CNPJ" && (
        <>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="cartaoCNPJ"
            >
              CARTÃO CNPJ
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.cartaoCNPJ ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.cartaoCNPJ.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    cartaoCNPJ: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="contratoSocial"
            >
              CONTRATO SOCIAL
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.contratoSocial ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.contratoSocial.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    contratoSocial: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="comprovanteDeEndereco"
            >
              COMPROVANTE DE ENDEREÇO DA INSTALAÇÃO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.comprovanteDeEndereco ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.comprovanteDeEndereco.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    comprovanteDeEndereco: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="comprovanteDeRenda"
            >
              COMPROVANTE DE RENDA (REPRESENTANTE LEGAL)
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.comprovanteDeRenda ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.comprovanteDeRenda.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    comprovanteDeRenda: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="declaracaoDeFaturamento"
            >
              DECLARAÇÃO DE FATURAMENTO DA EMPRESA(12 MESES)
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.declaracaoDeFaturamento ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.declaracaoDeFaturamento.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    declaracaoDeFaturamento: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="documentoPessoal"
            >
              DOCUMENTO PESSOAL DO REPRESENTANTE LEGAL
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.documentoPessoal ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.documentoPessoal.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    documentoPessoal: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setStage(0)}
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
