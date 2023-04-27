import React, { useState } from "react";
import Logo from "../../utils/whitelogoHD.png";
import TextFloatingInput from "../../components/TextFloatingInput";
import SelectFoatingInput from "../../components/SelectFloatingInput";
import {
  fileTypes,
  formatCPFCpnj,
  formatToPhone,
  vendedores,
} from "../../utils/constants";
import NumberFloatingInput from "../../components/NumberFloatingInput";
import Image from "next/image";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import { MdSmsFailed } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";

function CadastroFenesc() {
  const [registerInfo, setRegisterInfo] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    emailVendedor: "",
    codigoSVB: 0,
    potPico: 0,
    valorProjeto: 0,
    nomeGerente: "",
    telefoneGerente: "",
    cpfCnpj: "",
    pontoAtendimento: "NÃO DEFINIDO",
    qtdeParcelas: 0,
    carenciaDesejada: 0,
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState({ status: null, text: "", color: "" });
  function validateFields() {
    if (registerInfo.nomeVendedor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha um vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.emailVendedor.trim().length < 10) {
      setMsg({
        text: "Por favor, preencha o email do vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.codigoSVB <= 0) {
      setMsg({
        text: "Por favor, preencha um código SVB válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.potPico <= 0) {
      setMsg({
        text: "Por favor, preencha uma potência pico válida.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.valorProjeto <= 0) {
      setMsg({
        text: "Por favor, preencha um valor de projeto válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.nomeGerente.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha um nome válido para o gerente.",
        color: "text-red-500",
      });
    }
    if (registerInfo.telefoneGerente.trim().length < 11) {
      setMsg({
        text: "Por favor, preencha um telefone válido para o gerente.",
        color: "text-red-500",
      });
    }
    if (registerInfo.cpfCnpj.trim().length < 11) {
      setMsg({
        text: "Por favor, preencha um telefone válido para o gerente.",
        color: "text-red-500",
      });
    }
    if (registerInfo.pontoAtendimento == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha um ponto de atendimento.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.qtdeParcelas <= 0) {
      setMsg({
        text: "Por favor, preencha um número de parcelas válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (registerInfo.carenciaDesejada <= 0) {
      setMsg({
        text: "Por favor, preencha um carência válida.",
        color: "text-red-500",
      });
      return false;
    }
    if (!image) {
      setMsg({
        text: "Por favor, adicione uma proposta comercial.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  async function addRegister() {
    setMsg({ text: "Validando preenchimento...", color: "text-[#15599a]" });
    console.log("VALIDADOS");
    if (validateFields()) {
      setMsg({
        status: "loading",
        text: "Enviando...",
        color: "text-[#15599a]",
      });
      try {
        var imageRef = ref(
          storage,
          `fenesc/${registerInfo.codigoSVB}/propostaComercial${(
            Math.random() * 10000
          ).toFixed(0)}`
        );
        console.log(imageRef);
        const res = await uploadBytes(imageRef, image);
        console.log("RES", res);
        const url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        const proposta = {
          link: url,
          format: fileTypes[res.metadata.contentType]
            ? fileTypes[res.metadata.contentType].title
            : "INDEFINIDO",
        };
        console.log("URL", url);
        const obj = {
          ...registerInfo,
          proposta,
          dataRegistro: new Date().toISOString(),
        };
        let { data } = await axios.post("/api/auxiliares/cadastroFenesc", obj);
        console.log(data);
        if (data.acknowledged)
          setMsg({
            status: "success",
            text: "Cadastro efetivado!",
            color: "text-green-500",
          });
        else throw "Erro ao adicionar cadastro no banco de dados.";
      } catch (error) {
        console.log(error);
        setMsg({
          status: "failure",
          text: "Parece que algo deu errado na efetivação do cadastro. Por favor, tente novamente.",
          color: "text-red-500",
        });
      }
    }
  }
  function reset() {
    setRegisterInfo({
      nomeVendedor: "NÃO DEFINIDO",
      codigoSVB: 0,
      potPico: 0,
      valorProjeto: 0,
      nomeGerente: "",
      telefoneGerente: "",
      pontoAtendimento: "NÃO DEFINIDO",
      qtdeParcelas: 0,
      carenciaDesejada: 0,
    });
    setImage(null);
    setMsg({ text: "", color: "" });
    return;
  }

  return (
    <div className="p-6 grow flex flex-col bg-[#15599a] items-center">
      {msg.status ? (
        <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col justify-center border border-gray-300 shadow-lg p-2 items-center">
          {msg.status == "loading" ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : null}
          {msg.status == "failure" ? (
            <MdSmsFailed style={{ fontSize: "45px", color: "red" }} />
          ) : null}
          {msg.status == "success" ? (
            <FiCheckCircle style={{ fontSize: "45px", color: "green" }} />
          ) : null}
          <h1
            className={`text-lg text-center italic ${msg.color} font-medium mt-2`}
          >
            {msg.text}
          </h1>
          {msg.status != "loading" ? (
            <button
              onClick={reset}
              className="text-[#15559a] border border-[#15599a] font-medium p-2 rounded-md mt-4 hover:bg-[#15599a] hover:text-white"
            >
              NOVO CADASTRO
            </button>
          ) : null}
        </div>
      ) : (
        <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col border border-gray-300 shadow-lg p-2 items-center">
          <div className="flex items-center justify-center h-[80px]">
            <Image height={"80px"} width={"80px"} src={Logo} objectFit="fill" />
          </div>
          <h1 className="w-full text-center text-[#15599a] text-2xl font-bold">
            CADASTRO DE CLIENTES FENESC
          </h1>
          <div className="grow w-full flex flex-col items-center">
            <h1 className="text-[#fead61] font-bold text-center my-4">
              INFORMAÇÕES GERAIS
            </h1>
            <SelectFoatingInput
              label={"VENDEDOR"}
              editable={true}
              width={"50%"}
              value={registerInfo.nomeVendedor}
              options={vendedores.map((seller) => {
                return {
                  label: seller.nome,
                  value: seller.nome,
                };
              })}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({ ...prev, nomeVendedor: value }))
              }
            />
            <TextFloatingInput
              label={"EMAIL DO VENDEDOR"}
              editable={true}
              width={"50%"}
              value={registerInfo.emailVendedor}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({ ...prev, emailVendedor: value }))
              }
            />
            <NumberFloatingInput
              label={"CÓDIGO SVB"}
              editable={true}
              width={"50%"}
              value={
                registerInfo.codigoSVB
                  ? registerInfo.codigoSVB.toString()
                  : null
              }
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  codigoSVB: Number(value),
                }))
              }
            />
            <h1 className="text-[#fead61] font-bold text-center my-4">
              SISTEMA
            </h1>
            <NumberFloatingInput
              label={"POTÊNCIA EM kWp"}
              editable={true}
              width={"50%"}
              value={registerInfo.potPico ? registerInfo.potPico : null}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  potPico: Number(value),
                }))
              }
              toString={false}
            />
            <NumberFloatingInput
              label={"VALOR DO SISTEMA"}
              editable={true}
              width={"50%"}
              value={
                registerInfo.valorProjeto ? registerInfo.valorProjeto : null
              }
              handleChange={(value) => {
                setRegisterInfo((prev) => ({
                  ...prev,
                  valorProjeto: Number(value),
                }));
              }}
              toString={false}
            />
            <h1 className="text-[#fead61] font-bold text-center my-4">
              FINANCIAMENTO
            </h1>
            <TextFloatingInput
              label={"NOME DO GERENTE"}
              editable={true}
              width={"50%"}
              value={registerInfo.nomeGerente}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  nomeGerente: value.toUpperCase(),
                }))
              }
            />
            <TextFloatingInput
              label={"TELEFONE DO GERENTE"}
              editable={true}
              width={"50%"}
              value={registerInfo.telefoneGerente}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  telefoneGerente: formatToPhone(value),
                }))
              }
            />
            <TextFloatingInput
              label={"CPF/CNPJ DO CLIENTE"}
              editable={true}
              value={registerInfo.cpfCnpj}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  cpfCnpj: formatCPFCpnj(value),
                }))
              }
              width={"50%"}
            />
            <SelectFoatingInput
              label={"PONTO DE ATENDIMENTO DO CLIENTE"}
              editable={true}
              width={"50%"}
              value={registerInfo.pontoAtendimento}
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  pontoAtendimento: value.toUpperCase(),
                }))
              }
              options={[
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                { label: "SICOOB 36", value: "PA 00 - ITUIUTABA - 36" },
                { label: "SICOOB 26", value: "PA 01 - CENTRO - 26" },
                { label: "SICOOB CAPINÓPOLIS", value: "PA 02 - CAPINÓPOLIS" },
                {
                  label: "SICOOB SANTA VITÓRIA",
                  value: "PA 03 - SANTA VITÓRIA",
                },
                {
                  label: "SICOOB GURINHATÃ",
                  value: "PA 04 - GURINHATÃ",
                },
                { label: "SICOOB IPIAÇU", value: "PA 05 - IPIAÇU" },
                {
                  label: "SICOOB MONTE ALEGRE",
                  value: "PA 06 - MONTE ALEGRE DE MINAS",
                },
                { label: "SICOOB GARDÊNIA", value: "PA 07 - GARDÊNIA" },
                { label: "SICOOB CANÁPOLIS", value: "PA 08 - CANÁPOLIS" },
                { label: "SICOOB SETOR SUL", value: "PA 09 - SETOR SUL" },
                { label: "SICOOB UBERLAÂNDIA", value: "PA 10 - UBERLÂNDIA" },
                { label: "SICOOB MATRIZ", value: "PA 88 - MATRIZ" },
              ]}
            />
            <NumberFloatingInput
              label={"VALOR FINANCIADO"}
              editable={true}
              width={"50%"}
              value={
                registerInfo.valorFinanciado
                  ? registerInfo.valorFinanciado.toString()
                  : null
              }
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  valorFinanciado: Number(value),
                }))
              }
            />
            <NumberFloatingInput
              label={"QUANTIDADE DE PARCELAS"}
              editable={true}
              width={"50%"}
              value={
                registerInfo.qtdeParcelas
                  ? registerInfo.qtdeParcelas.toString()
                  : null
              }
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  qtdeParcelas: Number(value),
                }))
              }
            />
            <NumberFloatingInput
              label={"CARÊNCIA DESEJADA"}
              editable={true}
              width={"50%"}
              value={
                registerInfo.carenciaDesejada
                  ? registerInfo.carenciaDesejada.toString()
                  : null
              }
              handleChange={(value) =>
                setRegisterInfo((prev) => ({
                  ...prev,
                  carenciaDesejada: Number(value),
                }))
              }
            />
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                PROPOSTA COMERCIAL
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {image ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {image.name}
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
                  onChange={(e) => setImage(e.target.files[0])}
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-2">
            {msg.text ? (
              <p className={`text-sm italic ${msg.color}`}>{msg.text}</p>
            ) : null}
            <button
              onClick={addRegister}
              className="p-2 bg-green-500 text-white rounded font-bold"
            >
              ENVIAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroFenesc;
