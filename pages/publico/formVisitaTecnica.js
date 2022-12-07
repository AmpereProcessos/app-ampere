import React, { useState } from "react";
import Logo from "../../utils/whitelogoHD.png";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import { vendedores } from "../../utils/constants";
import Image from "next/image";
import FormVisitaTecnicaUm from "../../components/FormVisitaTecnicaUm";
import FormVisitaTecnicaDois from "../../components/FormVisitaTecnicaDois";
import FormVisitaTecnicaTres from "../../components/FormVisitaTecnicaTres";
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
  const [estagio, setEstagio] = useState(2);
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
    tipoDeSolicitacao: "NÃO DEFINIDO",
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
  });
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
          />
        )}
        {estagio == 1 && (
          <FormVisitaTecnicaDois
            dados={dados}
            setDados={setDados}
            images={images}
            setImages={setImages}
          />
        )}
        {estagio == 2 && (
          <FormVisitaTecnicaTres
            dados={dados}
            setDados={setDados}
            images={images}
            setImages={setImages}
          />
        )}
      </div>
    </div>
  );
}

export default FormVisitaTecnica;
