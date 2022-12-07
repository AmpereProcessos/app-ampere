import React from "react";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

function FormVisitaTecnicaDois({ dados, setDados, images, setImages }) {
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        PADRÃO
      </span>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <SelectInput
          label={"AMPERAGEM"}
          editable={true}
          value={dados.amperagem}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "40A", value: "40A" },
            { label: "50A", value: "50A" },
            { label: "60A", value: "60A" },
            { label: "63A", value: "63A" },
            { label: "70A", value: "70A" },
            { label: "90A", value: "90A" },
            { label: "100A", value: "100A" },
            { label: "200A", value: "200A" },
            { label: "PADRÃO CONJUGADO", value: "PADRÃO CONJUGADO" },
          ]}
          handleChange={(value) => setDados({ ...dados, amperagem: value })}
        />
        <SelectInput
          label={"TIPO DO DISJUNTOR"}
          editable={true}
          value={dados.tipoDisjuntor}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "MONOFÁSICO", value: "MONOFÁSICO" },
            { label: "BIFÁSICO", value: "BIFÁSICO" },
            { label: "TRIFÁSICO", value: "TRIFÁSICO" },
            { label: "PADRÃO CONJUGADO", value: "PADRÃO CONJUGADO" },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoDisjuntor: value })}
        />
        <NumberInput
          label={"NÚMERO DO MEDIDOR"}
          editable={true}
          value={dados.numeroMedidor}
          handleChange={(value) =>
            setDados({ ...dados, numeroMedidor: Number(value) })
          }
        />
        <TextInput
          label={"PARA PADRÕES CONJUGADOS"}
          placeholder="ESCREVA: CAIXA 1 - APD1111111 - 40A MONOFÁSICO/ CAIXA 2 - APD222222 - 60A BIFÁSICO ..."
          editable={true}
          value={dados.infoPadraoConjugado}
          handleChange={(value) =>
            setDados({ ...dados, infoPadraoConjugado: value.toUpperCase() })
          }
        />
        <SelectInput
          label={"RAMAL DE ENTRADA"}
          editable={true}
          value={dados.ramalEntrada}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "AÉREO", value: "AÉREO" },
            { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalEntrada: value })}
        />
        <SelectInput
          label={"RAMAL DE SAÍDA"}
          editable={true}
          value={dados.ramalSaida}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "AÉREO", value: "AÉREO" },
            { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalSaida: value })}
        />
        <SelectInput
          label={"EM RELAÇÃO A CASA DO CLIENTE, O PADRÃO ESTÁ:"}
          editable={true}
          value={dados.tipoPadrao}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            {
              label: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
              value: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
            },
            {
              label: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
              value: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
            },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoPadrao: value })}
        />
        <NumberInput
          label={"NÚMERO DO POSTE (SOMENTE P/GOIÁS)"}
          editable={true}
          value={dados.numeroPoste ? dados.numeroPoste : ""}
          handleChange={(value) =>
            setDados({ ...dados, numeroPoste: Number(value) })
          }
        />
      </div>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DO PADRÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoPadrao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoPadrao.name}
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
                  fotoPadrao: e.target.files[0],
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
            FOTO DO DISJUNTOR
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoDisjuntor ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoDisjuntor.name}
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
                  fotoDisjuntor: e.target.files[0],
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
            FOTO DOS CABOS DO PADRÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoDisjuntor ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoDisjuntor.name}
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
                  fotoDisjuntor: e.target.files[0],
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
            FOTO DO POSTE (SOMENTE P/ GOIÁS)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoDisjuntor ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoDisjuntor.name}
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
                  fotoDisjuntor: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
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

export default FormVisitaTecnicaDois;
