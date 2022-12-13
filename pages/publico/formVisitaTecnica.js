import React, { useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";
import Logo from "../../utils/whitelogoHD.png";
import { vendedores, fileTypes } from "../../utils/constants";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import FormVisitaTecnicaUm from "../../components/FormVisitaTecnicaUm";
import FormVisitaTecnicaDois from "../../components/FormVisitaTecnicaDois";
import FormVisitaTecnicaTres from "../../components/FormVisitaTecnicaTres";
import FormVisitaTecnicaQuatro from "../../components/FormVisitaTecnicaQuatro";
import FormVisitaTecnicaRural from "../../components/FormVisitaTecnicaRural";
import axios from "axios";
function FormVisitaTecnica() {
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
  const [estagio, setEstagio] = useState(0);
  const [images, setImages] = useState({});
  const [dados, setDados] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    telefoneVendedor: "",
    nomeDoCliente: "",
    telefoneDoCliente: "",
    codigoSVB: "",
    cidade: "NÃO DEFINIDO",
    cep: "",
    bairro: "",
    logradouro: "",
    numeroResidencia: "",
    tipoInversor: "NÃO DEFINIDO",
    qtdeInversor: "",
    potInversor: "",
    marcaInversor: "",
    qtdeModulos: "",
    potModulos: "",
    marcaModulos: "",
    obsVisita: "",
    tipoDeLaudo: "NÃO DEFINIDO",
    tipoDeSolicitacao: "NÃO DEFINIDO", // RESETAR PARA NÃO DEFINIDO -  VISITA TÉCNICA REMOTA - RURAL
    amperagem: "NÃO DEFINIDO",
    tipoDisjuntor: "NÃO DEFINIDO",
    ramalEntrada: "NÃO DEFINIDO",
    ramalSaida: "NÃO DEFINIDO",
    tipoPadrao: "NÃO DEFINIDO",
    numeroMedidor: "",
    estruturaMontagem: "NÃO DEFINIDO",
    tipoEstrutura: "NÃO DEFINIDO",
    tipoTelha: "NÃO DEFINIDO",
    telhasReservas: "NÃO DEFINIDO",
    orientacaoEstrutura: "",
    distanciaSistemaQuadro: "NÃO DEFINIDO",
    distanciaInversorRoteador: "NÃO DEFINIDO",
    obsInstalacao: "",
  });
  const [msg, setMsg] = useState({ text: "", color: "" });
  var links = [];
  async function uploadImages() {
    setMsg({ text: "Processando...", color: "text-[#15599a]" });
    let arrOfImagesKeys = Object.keys(images);
    try {
      for (let i = 0; i < arrOfImagesKeys.length; i++) {
        var imageRef = ref(
          storage,
          `visitaTecnica/${dados.nomeDoCliente}/${arrOfImagesKeys[i]}${(
            Math.random() * 10000
          ).toFixed(0)}`
        );
        let res = await uploadBytes(
          imageRef,
          images[arrOfImagesKeys[i]].file
        ).catch((err) => {
          throw `ERRO AO ENVIAR ${images[arrOfImagesKeys[i]].title}`;
        });
        console.log(res.metadata);
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        console.log(url);
        links.push({
          title: images[arrOfImagesKeys[i]].title,
          link: url,
          format: fileTypes[res.metadata.contentType]
            ? fileTypes[res.metadata.contentType].title
            : "INDEFINIDO",
        });
      }
    } catch (error) {
      setMsg({ text: error, color: "text-red-500" });
    }
    return sendForm();
  }
  function sendForm() {
    axios
      .post("/api/solicitacoes/visitaTecnica", {
        ...dados,
        links: links,
        dataDeAbertura: new Date().toISOString(),
      })
      .then((res) => {
        setMsg({ text: "Solicitação enviada!", color: "text-green-500" });
        setTimeout(() => {
          location.reload();
        }, 2800);
      });
  }
  return (
    <div className="p-6 bg-gray-100 min-h-[100vh] flex flex-col">
      <div className="flex self-center items-center h-[100px] w-[100px]">
        <Image src={Logo} />
      </div>
      <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
        Formulário de Visita Técnica
      </h1>
      <div className="flex flex-col items-center gap-y-5">
        <div className="w-full flex flex-wrap justify-around border border-[#15599a] p-2 shadow-lg bg-[#fff]">
          <SelectInput
            label={"Vendedor"}
            value={dados.nomeVendedor}
            editable={true}
            options={vendedores.map((vendedor) => {
              return { label: vendedor.nome, value: vendedor.nome };
            })}
            handleChange={(value) =>
              setDados({ ...dados, nomeVendedor: value })
            }
          />
          <TextInput
            label={"Telefone"}
            editable={true}
            value={dados.telefoneVendedor}
            handleChange={(value) =>
              setDados({ ...dados, telefoneVendedor: phoneMask(value) })
            }
          />
        </div>
        {estagio == 0 && (
          <FormVisitaTecnicaUm
            dados={dados}
            setDados={setDados}
            images={images}
            setImages={setImages}
            avancar={() => setEstagio((prevStage) => prevStage + 1)}
          />
        )}
        {estagio == 1 ? (
          dados.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - RURAL" ? (
            <FormVisitaTecnicaRural
              dados={dados}
              setDados={setDados}
              images={images}
              setImages={setImages}
              uploadImages={uploadImages}
              voltar={() => setEstagio((prevStage) => prevStage - 1)}
            />
          ) : (
            <FormVisitaTecnicaDois
              dados={dados}
              setDados={setDados}
              images={images}
              setImages={setImages}
              avancar={() => setEstagio((prevStage) => prevStage + 1)}
              voltar={() => setEstagio((prevStage) => prevStage - 1)}
            />
          )
        ) : (
          false
        )}
        {estagio == 2 && (
          <FormVisitaTecnicaTres
            dados={dados}
            setDados={setDados}
            images={images}
            setImages={setImages}
            avancar={() => setEstagio((prevStage) => prevStage + 1)}
            voltar={() => setEstagio((prevStage) => prevStage - 1)}
          />
        )}
        {estagio == 3 && (
          <FormVisitaTecnicaQuatro
            dados={dados}
            setDados={setDados}
            images={images}
            setImages={setImages}
            uploadImages={uploadImages}
          />
        )}
      </div>
      {msg.text && (
        <p className={`text-center italic text-sm ${msg.color}`}>{msg.text}</p>
      )}
    </div>
  );
}

export default FormVisitaTecnica;
