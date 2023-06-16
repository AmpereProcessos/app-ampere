import React, { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas, vendedores } from "../utils/constants";
import axios from "axios";
import SelectFoatingInput from "./SelectFloatingInput";
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
function FormSolicitacaoDadosInstalacaoRemontagem({
  avancar,
  setDados,
  dados,
  voltar,
}) {
  const [message, setMessage] = useState("");
  async function findCPF(field) {
    axios
      .get(
        `https://viacep.com.br/ws/${dados.cepInstalacao.replace("-", "")}/json/`
      )
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          setDados({
            ...dados,
            bairroInstalacao: res.data.bairro,
            cidadeInstalacao: cidadesAtendidas.includes(
              res.data.localidade.toUpperCase()
            )
              ? res.data.localidade.toUpperCase()
              : "ITUIUTABA",
            enderecoInstalacao: res.data.logradouro,
            ufInstalacao: res.data.uf,
          });
        }
      });
  }
  async function findCPFRemontagem() {
    axios
      .get(
        `https://viacep.com.br/ws/${dados.cepInstalacaoRemontagem.replace(
          "-",
          ""
        )}/json/`
      )
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          setDados({
            ...dados,
            bairroInstalacaoRemontagem: res.data.bairro,
            cidadeInstalacaoRemontagem: cidadesAtendidas.includes(
              res.data.localidade.toUpperCase()
            )
              ? res.data.localidade.toUpperCase()
              : "ITUIUTABA",
            enderecoInstalacaoRemontagem: res.data.logradouro,
            ufInstalacaoRemontagem: res.data.uf,
          });
        }
      });
  }
  function validarCamposObrigatorios() {
    if (dados.nomeTitularProjeto.trim().length < 5) {
      setMessage("Por favor, preencha um nome do titular válido.");
      return false;
    }
    if (dados.tipoDoTitular == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o tipo do titular.");
      return false;
    }
    if (dados.tipoDaInstalacao == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o tipo da instalação.");
      return false;
    }
    if (dados.cidadeInstalacao == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha uma cidade válida.");
      return false;
    }
    if (dados.enderecoInstalacao.trim().length < 3) {
      setMessage("Por favor, preencha um endereço válido");
      return false;
    }
    if (dados.bairroInstalacao.trim().length < 3) {
      setMessage("Por favor, preencha um bairro válido");
      return false;
    }
    if (dados.numeroResInstalacao == null) {
      setMessage("Por favor, preencha o número da residência.");
      return false;
    }
    if (
      dados.numeroInstalacao == null ||
      dados.numeroInstalacao.trim().length < 7
    ) {
      setMessage("Por favor, preencha um número de instalação válido.");
      return false;
    }
    if (
      dados.tipoDaInstalacao == "RURAL" &&
      dados.longitude.trim().length < 6
    ) {
      setMessage("Por favor, preencha uma longitude válida.");
      return false;
    }
    if (dados.tipoDaInstalacao == "RURAL" && dados.latitude.trim().length < 6) {
      setMessage("Por favor, preencha uma latitude válida.");
      return false;
    }
    if (dados.potPico == null) {
      setMessage("Por favor, preencha uma potência pico válida.");
      return false;
    }

    // Mudança de local
    if (dados.mudancaLocal == "SIM") {
      if (dados.tipoDaLigacao == "NÃO DEFINIDO") {
        setMessage("Por favor, preencha o tipo da ligação do novo local.");
        return false;
      }
      if (
        dados.tipoDaInstalacaoRemontagem == null ||
        dados.tipoDaInstalacaoRemontagem == "NÃO DEFINIDO"
      ) {
        setMessage("Por favor, preencha o tipo da instalação do novo local.");
        return false;
      }
      if (dados.cidadeInstalacaoRemontagem == "NÃO DEFINIDO") {
        setMessage("Por favor, preencha uma cidade válida para o novo local.");
        return false;
      }
      if (dados.enderecoInstalacaoRemontagem?.trim().length < 3) {
        setMessage("Por favor, preencha um endereço válido para o novo loca.");
        return false;
      }
      if (dados.bairroInstalacaoRemontagem?.trim().length < 3) {
        setMessage("Por favor, preencha um bairro válido para o novo local");
        return false;
      }
      if (dados.numeroResInstalacaoRemontagem == null) {
        setMessage(
          "Por favor, preencha o número da residência para o novo local."
        );
        return false;
      }
      if (
        dados.tipoDaLigacao == "EXISTENTE" &&
        (dados.numeroInstalacaoRemontagem == null ||
          dados.numeroInstalacao.trim().length < 7)
      ) {
        setMessage(
          "Por favor, preencha um número de instalação válido para o novo local."
        );
        return false;
      }
      if (
        dados.tipoDaInstalacaoRemontagem == "RURAL" &&
        dados.longitudeRemontagem?.trim().length < 6
      ) {
        setMessage(
          "Por favor, preencha uma longitude válida para o novo local."
        );
        return false;
      }
      if (
        dados.tipoDaInstalacaoRemontagem == "RURAL" &&
        dados.latitudeRemontagem?.trim().length < 6
      ) {
        setMessage(
          "Por favor, preencha uma latitude válida para o novo local."
        );
        return false;
      }
    }
    setMessage("");
    return true;
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  console.log(dados.numeroInstalacao);
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS DA INSTALAÇÃO
      </span>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 p-2">
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          INFORMAÇÕES DA INSTALAÇÃO DO CLIENTE
        </h1>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"NOME DO TITULAR DO PROJETO"}
            value={dados.nomeTitularProjeto}
            editable={true}
            handleChange={(value) =>
              setDados({
                ...dados,
                nomeTitularProjeto: value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={"TIPO DO TITULAR"}
            editable={true}
            value={dados.tipoDoTitular}
            handleChange={(value) =>
              setDados({ ...dados, tipoDoTitular: value })
            }
            options={[
              {
                label: "PESSOA FISICA",
                value: "PESSOA FISICA",
              },
              {
                label: "PESSOA JURIDICA",
                value: "PESSOA JURIDICA",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={"TIPO DA INSTALAÇÃO (ATUAL)"}
            editable={true}
            value={dados.tipoDaInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, tipoDaInstalacao: value })
            }
            options={[
              {
                label: "RURAL",
                value: "RURAL",
              },
              {
                label: "URBANO",
                value: "URBANO",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
        </div>
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          ENDEREÇO DA INSTALAÇÃO ATUAL
        </h1>
        <div className="flex items-center justify-center gap-x-2 flex-wrap">
          <TextFloatingInput
            editable={true}
            label={"CEP INSTALAÇÃO"}
            value={dados.cepInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, cepInstalacao: formatCEP(value) })
            }
          />
          <button
            onClick={() => findCPF("enderecoInstalacao")}
            className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
          >
            <AiOutlineSearch />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"ENDEREÇO DE INSTALAÇÃO"}
            editable={true}
            value={dados.enderecoInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, enderecoInstalacao: value.toUpperCase() })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"Nº"}
            editable={true}
            value={dados.numeroResInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, numeroResInstalacao: value })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <NumberFloatingInput
            label={"Nº DA INSTALAÇÃO"}
            editable={true}
            value={dados.numeroInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, numeroInstalacao: value })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"BAIRRO"}
            editable={true}
            value={dados.bairroInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, bairroInstalacao: value.toUpperCase() })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={"CIDADE"}
            editable={true}
            value={dados.cidadeInstalacao}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ...cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade };
              }),
            ]}
            handleChange={(value) =>
              setDados({ ...dados, cidadeInstalacao: value })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"UF"}
            editable={true}
            value={dados.ufInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, ufInstalacao: value })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"PONTO DE REFERÊNCIA"}
            editable={true}
            value={dados.pontoDeReferenciaInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, pontoDeReferenciaInstalacao: value })
            }
          />
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap col-span-3">
          <TextFloatingInput
            label={"LATITUDE"}
            value={dados.latitude}
            editable={true}
            handleChange={(value) => setDados({ ...dados, latitude: value })}
          />
          <TextFloatingInput
            label={"LONGITUDE"}
            editable={true}
            value={dados.longitude}
            handleChange={(value) => setDados({ ...dados, longitude: value })}
          />
        </div>
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          ENDEREÇO DA INSTALAÇÃO REMONTAGEM
        </h1>
        <div className="flex items-center justify-center col-span-3">
          <SelectFoatingInput
            label={"HAVERÁ MUDANÇA DE LOCAL"}
            editable={true}
            value={dados.mudancaLocal}
            options={[
              {
                label: "SIM",
                value: "SIM",
              },
              {
                label: "NÃO",
                value: "NÃO",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
            handleChange={(value) => {
              if (value == "NÃO") {
                setDados({
                  ...dados,
                  mudancaLocal: value.toUpperCase(),
                  tipoDaLigacao: "NÃO DEFINIDO",
                  tipoDaInstalacaoRemontagem: "NÃO DEFINIDO",
                  cepInstalacaoRemontagem: "",
                  enderecoInstalacaoRemontagem: "",
                  numeroInstalacaoRemontagem: "",
                  numeroResInstalacaoRemontagem: "",
                  bairroInstalacaoRemontagem: "",
                  cidadeInstalacaoRemontagem: "",
                  ufInstalacaoRemontagem: "",
                  latitudeRemontagem: "",
                  longitudeRemontagem: "",
                  pontoDeReferenciaInstalacaoRemontagem: "",
                });
              } else {
                setDados({ ...dados, mudancaLocal: value.toUpperCase() });
              }
            }}
          />
        </div>
        {dados.mudancaLocal == "SIM" ? (
          <>
            <div className="flex items-center justify-center">
              <SelectFoatingInput
                label={"TIPO DA LIGAÇÃO (NOVO LOCAL)"}
                editable={true}
                value={dados.tipoDaLigacao}
                handleChange={(value) =>
                  setDados({ ...dados, tipoDaLigacao: value })
                }
                options={[
                  {
                    label: "NOVA",
                    value: "NOVA",
                  },
                  {
                    label: "EXISTENTE",
                    value: "EXISTENTE",
                  },
                  {
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFoatingInput
                label={"TIPO DA INSTALAÇÃO (NOVO LOCAL)"}
                editable={true}
                value={
                  dados.tipoDaInstalacaoRemontagem
                    ? dados.tipoDaInstalacaoRemontagem
                    : "NÃO DEFINIDO"
                }
                handleChange={(value) =>
                  setDados({ ...dados, tipoDaInstalacaoRemontagem: value })
                }
                options={[
                  {
                    label: "RURAL",
                    value: "RURAL",
                  },
                  {
                    label: "URBANO",
                    value: "URBANO",
                  },
                  {
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]}
              />
            </div>
            <div className="flex items-center justify-center gap-x-2 flex-wrap">
              <TextFloatingInput
                editable={true}
                label={"CEP INSTALAÇÃO (NOVO LOCAL)"}
                value={dados.cepInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    cepInstalacaoRemontagem: formatCEP(value),
                  })
                }
              />
              <button
                onClick={() => findCPFRemontagem("enderecoInstalacao")}
                className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
              >
                <AiOutlineSearch />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"ENDEREÇO DE INSTALAÇÃO (NOVO LOCAL)"}
                editable={true}
                value={dados.enderecoInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    enderecoInstalacaoRemontagem: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"Nº (NOVO LOCAL)"}
                editable={true}
                value={dados.numeroResInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({ ...dados, numeroResInstalacaoRemontagem: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                label={"Nº DA INSTALAÇÃO (NOVO LOCAL)"}
                editable={true}
                value={dados.numeroInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({ ...dados, numeroInstalacaoRemontagem: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"BAIRRO (NOVO LOCAL)"}
                editable={true}
                value={dados.bairroInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    bairroInstalacaoRemontagem: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFoatingInput
                label={"CIDADE (NOVO LOCAL)"}
                editable={true}
                value={dados.cidadeInstalacaoRemontagem}
                options={[
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ...cidadesAtendidas.map((cidade) => {
                    return { label: cidade, value: cidade };
                  }),
                ]}
                handleChange={(value) =>
                  setDados({ ...dados, cidadeInstalacaoRemontagem: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"UF (NOVO LOCAL)"}
                editable={true}
                value={dados.ufInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({ ...dados, ufInstalacaoRemontagem: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"PONTO DE REFERÊNCIA (NOVO LOCAL)"}
                editable={true}
                value={dados.pontoDeReferenciaInstalacaoRemontagem}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    pontoDeReferenciaInstalacaoRemontagem: value,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap col-span-3">
              <TextFloatingInput
                label={"LATITUDE (NOVO LOCAL)"}
                value={dados.latitudeRemontagem}
                editable={true}
                handleChange={(value) =>
                  setDados({ ...dados, latitudeRemontagem: value })
                }
              />
              <TextFloatingInput
                label={"LONGITUDE (NOVO LOCAL)"}
                editable={true}
                value={dados.longitudeRemontagem}
                handleChange={(value) =>
                  setDados({ ...dados, longitudeRemontagem: value })
                }
              />
            </div>
          </>
        ) : null}
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          DADOS DO SISTEMA
        </h1>
        <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
          <NumberFloatingInput
            label={"POTÊNCIA PICO"}
            editable={true}
            value={dados.potPico}
            handleChange={(value) =>
              setDados({
                ...dados,
                potPico: Number(value),
                geracaoPrevista: Number(value) * 126,
              })
            }
          />
        </div>
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

export default FormSolicitacaoDadosInstalacaoRemontagem;
