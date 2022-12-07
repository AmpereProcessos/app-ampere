import React from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import TipoTelhas from "../utils/tipoTelhas.png";
import Image from "next/image";
function FormVisitaTecnicaTres({ dados, setDados, images, setImages }) {
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ESTRUTURA
      </span>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <SelectInput
          label={"ESTRUTURA DE MONTAGEM"}
          editable={true}
          value={dados.estruturaMontagem}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "TELHADO CONVENCIONAL", value: "TELHADO CONVENCIONAL" },
            { label: "ESTRUTURA DE SOLO", value: "ESTRUTURA SOLO" },
            { label: "BARRACÃO PRONTO", value: "BARRACÃO PRONTO" },
            {
              label: "CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA",
              value: "CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA",
            },
          ]}
          handleChange={(value) =>
            setDados({ ...dados, estruturaMontagem: value })
          }
        />
        <SelectInput
          label={"TIPO DA ESTRUTURA"}
          editable={true}
          value={dados.tipoEstrutura}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "MADEIRA", value: "MADEIRA" },
            { label: "FERRO", value: "FERRO" },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
        />
        <SelectInput
          label={"TIPO DA TELHA (EXEMPLO ABAIXO)"}
          editable={true}
          value={dados.tipoTelha}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "PORTUGUESA", value: "PORTUGUESA" },
            { label: "FRANCESA", value: "FRANCESA" },
            { label: "ROMANA", value: "ROMANA" },
            { label: "CIMENTO", value: "CIMENTO" },
            { label: "ETHERNIT", value: "ETHERNIT" },
            { label: "SANDUÍCHE", value: "SANDUÍCHE" },
            { label: "AMERICANA", value: "AMERICANA" },
            { label: "CAPE E BICA", value: "CAPE E BICA" },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoTelha: value })}
        />
        <SelectInput
          label={"CLIENTE POSSUI TELHAS RESERVAS"}
          editable={true}
          value={dados.telhasReservas}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "SIM", value: "SIM" },
            { label: "NÃO", value: "NÃO" },
          ]}
        />
        <TextInput
          label={"LINK FOTOS DO DRONE"}
          editable={true}
          placeholder="TENDO MAIS DE UM TELHADO APTO ESCREVER MAIS DE UMA"
          normalCase={true}
          value={dados.fotosDrone}
          handleChange={(value) => setDados({ ...dados, fotosDrone: value })}
        />
      </div>
      <div className="flex items-center justify-center border border-gray-200 py-2 w-[300px] h-[165px] lg:w-[450px] lg:h-[250px] self-center my-3">
        <Image src={TipoTelhas} />
      </div>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DA ESTRUTURA DO TELHADO
          </label>
          <p className="text-center text-xs">
            TIRAR FOTO POR BAIXO DO TELHADO OU DA PONTA DAS TELHAS PARA VER A
            ESTRUTURA, SE É MADEIRA OU FERRO
          </p>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoEstrutura ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoEstrutura.name}
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
                  fotoEstrutura: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DAS TELHAS
          </label>
          <p className="text-center text-xs">
            FOTO CLARA E EXPLICATICA PARA DESENHO TÉCNICO
          </p>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoTelhas ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoTelhas.name}
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
                  fotoTelhas: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded">
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaTres;
