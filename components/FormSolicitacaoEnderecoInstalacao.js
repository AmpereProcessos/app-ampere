import axios from "axios";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas } from "../utils/constants";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFoatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
  return cep;
}
function FormSolicitacaoEnderecoInstalacao({
  dados,
  setDados,
  avancar,
  voltar,
}) {
  const [message, setMessage] = useState();
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
  function validarCamposObrigatorios() {
    if (dados.tipoDaInstalacao == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o tipo da instalação.");
      return false;
    }
    if (dados.cepInstalacao?.trim().length < 8) {
      setMessage("Por favor, preencha o CEP do local de instalação.");
      return false;
    }
    if (dados.enderecoInstalacao?.trim().length < 5) {
      setMessage("Por favor, preencha o endereço do local de instalação.");
      return false;
    }
    if (!dados.numeroResInstalacao || dados.numeroResInstalacao == 0) {
      setMessage(
        "Por favor, preencha um número válido para o local de instalação."
      );
      return false;
    }
    if (dados.bairroInstalacao?.trim().length < 3) {
      setMessage(
        "Por favor, preencha um bairro válido para o local de instalação."
      );
      return false;
    }
    if (dados.cidadeInstalacao == "NÃO DEFINIDO") {
      setMessage(
        "Por favor, preencha um cidade válida para o local de instalação."
      );
      return false;
    }
    if (dados.ufInstalacao?.trim().length < 2) {
      setMessage("Por favor, preencha a UF do local de instalação.");
      return false;
    }
    if (
      dados.tipoDaInstalacao == "RURAL" &&
      (!dados.latitude || !dados.longitude)
    ) {
      setMessage(
        "Por favor, preencha a latitude e longitude do local de instalação."
      );
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
  console.log(!dados.latitude || !dados.longitude);
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ENDEREÇO DA INSTALAÇAO
      </span>
      <div className="flex flex-col lg:grid grid-cols-3 gap-2 px-2">
        <div className="col-span-3 mt-2 flex items-center justify-center">
          <div className="flex items-center justify-center w-full lg:w-[50%]">
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
              width={"100%"}
            />
          </div>
        </div>
        <div className="flex items-center justify-center col-span-3">
          <div className="flex items-center justify-center w-full lg:w-[50%]">
            <SelectFoatingInput
              label={"TIPO DA INSTALAÇÃO"}
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
              width={"100%"}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-2 flex-wrap">
          <div className="grow">
            <TextFloatingInput
              editable={true}
              label={"CEP INSTALAÇÃO"}
              value={dados.cepInstalacao}
              handleChange={(value) =>
                setDados({ ...dados, cepInstalacao: formatCEP(value) })
              }
              width={"100%"}
            />
          </div>

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
            width={"100%"}
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
            width={"100%"}
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
            label={"PONTO DE REFERÊNCIA DA INSTALAÇÃO"}
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

export default FormSolicitacaoEnderecoInstalacao;
