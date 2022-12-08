import React from "react";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

function FormVisitaTecnicaRural({ dados, setDados, images, setImages }) {
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-md text-center font-bold text-[#15599a] uppercase py-2">
        VISITA TÉCNICA RURAL
      </span>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          PADRÃO
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
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
              FOTO LOCALIZAÇÃO PADRÃO ANTIGO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalizacaoPadraoAntigo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalizacaoPadraoAntigo.name}
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
                    fotoLocalizacaoPadraoAntigo: e.target.files[0],
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
              FOTO LOCALIZAÇÃO PADRÃO NOVO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalizacaoPadraoNovo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalizacaoPadraoNovo.name}
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
                    fotoLocalizacaoPadraoNovo: e.target.files[0],
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
              FOTO DO DISJUNTOR DO PADRÃO
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
        <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
          <SelectInput
            label={"DISJUNTOR DO PADRÃO"}
            editable={true}
            value={dados.tipoDisjuntor}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "BIFÁSICO", value: "BIFÁSICO" },
              { label: "TRIFÁSICO", value: "TRIFÁSICO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, tipoDisjuntor: value })
            }
          />
          <SelectInput
            label={"AMPERAGEM"}
            editable={true}
            value={dados.amperagem}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "30A", value: "30A" },
              { label: "40A", value: "40A" },
              { label: "50A", value: "50A" },
              { label: "60A", value: "60A" },
              { label: "70A", value: "70A" },
              { label: "80A", value: "80A" },
              { label: "90A", value: "90A" },
              { label: "100A", value: "100A" },
              { label: "125A", value: "125A" },
              { label: "150A", value: "150A" },
              { label: "175A", value: "175A" },
              { label: "200A", value: "200A" },
              {
                label: "OUTRO(DESCREVA NAS OBSERVAÇÕES)",
                value: "OUTRO(DESCREVA NAS OBSERVAÇÕES)",
              },
            ]}
            handleChange={(value) => setDados({ ...dados, amperagem: value })}
          />
          <NumberInput
            label={"NÚMERO DO MEDIDOR"}
            editable={true}
            value={dados.numeroMedidor}
            handleChange={(value) =>
              setDados({ ...dados, numeroMedidor: Number(value) })
            }
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          TRANSFORMADOR
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
          <SelectInput
            label={"PADRÃO E TRANSFORMADOR ACOPLADOS"}
            editable={true}
            value={
              dados.padraoTrafoAcoplados
                ? dados.padraoTrafoAcoplados
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "SIM", value: "SIM" },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, padraoTrafoAcoplados: value })
            }
          />
          <NumberInput
            label={"POTÊNCIA DO TRANSFORMADOR"}
            unit={"W"}
            editable={true}
            value={dados.potTrafo ? dados.potTrafo : ""}
            handleChange={(value) =>
              setDados({ ...dados, potTrafo: Number(value) })
            }
          />
        </div>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <div className="w-fit flex flex-col items-center self-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="propostaComercial"
            >
              FOTO DO TRANSFORMADOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoTrafo.name}
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
                    fotoTrafo: e.target.files[0],
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
              FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalizacaoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalizacaoTrafo.name}
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
                    fotoLocalizacaoTrafo: e.target.files[0],
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
              FOTO DO NÚMERO DO TRANSFORMADOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoNumeroTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoNumeroTrafo.name}
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
                    fotoNumeroTrafo: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          CABOS E RAMAIS
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <div className="w-fit flex flex-col items-center self-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="propostaComercial"
            >
              FOTO DO RAMAL DO TRAFO AO PADRÃO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoRamalTrafoPadrao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoRamalTrafoPadrao.name}
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
                    fotoRamalTrafoPadrao: e.target.files[0],
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
              FOTO DOS CABOS DO PADRÃO PARA RELIGAÇÃO DA FAZENDA
            </label>
            <p className="text-center text-xs">
              SÃO OS CABOS UTILIZADOS PARA LEVAR ENERGIA ATÉ A RESIDÊNCIA RURAL
              OU ATÉ ALGUMA EDIFICAÇÃO DA FAZENDA
            </p>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoCabosReligacao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoCabosReligacao.name}
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
                    fotoCabosReligacao: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          ESTRUTURA DE MONTAGEM
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <div className="w-fit flex flex-col items-center self-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="propostaComercial"
            >
              FOTO DO LOCAL DA MONTAGEM
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalMontagem ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalMontagem.name}
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
                    fotoLocalMontagem: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <SelectInput
            label={"TIPO DE ESTRUTURA - MONTAGEM DOS MÓDULOS"}
            editable={true}
            value={dados.tipoEstrutura}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "TELHADO CONVENCIONAL - TELHA BARRO",
                value: "TELHADO CONVENCIONAL - TELHA BARRO",
              },
              { label: "BARRACÃO À CONSTRUIR", value: "BARRACÃO À CONSTRUIR" },
              { label: "ESTRUTURA DE SOLO", value: "ESTRUTURA DE SOLO" },
              { label: "BEZERREIRO", value: "BEZERREIRO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, tipoEstrutura: value })
            }
          />
          <TextInput
            label={"ORIENTAÇÃO DA MONTAGEM DOS MÓDULOS"}
            editable={true}
            value={dados.orientacaoEstrutura}
            handleChange={(value) =>
              setDados({ ...dados, orientacaoEstrutura: value.toUpperCase() })
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
              { label: "ESTRUTURA DE SOLO", value: "ESTRUTURA DE SOLO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, tipoEstrutura: value })
            }
          />
          <SelectInput
            label={"TIPO DA TELHA"}
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
              { label: "ESTRUTURA DE SOLO", value: "ESTRUTURA DE SOLO" },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoTelha: value })}
          />
          <SelectInput
            label={"CLIENTE POSSUI TELHAS RESERVAS"}
            editable={true}
            value={dados.telhasReservas}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "SIM - MUITAS", value: "SIM - MUITAS" },
              { label: "SIM - POUCAS", value: "SIM - POUCAS" },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, telhasReservas: value })
            }
          />
          <TextInput
            label={"LOCAL DE MONTAGEM DO INVERSOR"}
            editable={true}
            value={dados.localInstalacaoInversor}
            handleChange={(value) =>
              setDados({
                ...dados,
                localInstalacaoInversor: value.toUpperCase(),
              })
            }
          />
          <TextInput
            label={"DISTÂNCIA DOS MÓDULOS ATÉ OS INVERSORES"}
            editable={true}
            value={
              dados.distanciaModulosInversores
                ? dados.distanciaModulosInversores
                : ""
            }
            handleChange={(value) =>
              setDados({ ...dados, distanciaModulosInversores: value })
            }
          />
          <TextInput
            label={"DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO"}
            editable={true}
            value={dados.distanciaInversoresPadrao}
            handleChange={(value) =>
              setDados({ ...dados, distanciaInversoresPadrao: value })
            }
          />
          <TextInput
            label={"DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR"}
            editable={true}
            value={dados.distanciaInversorRoteador}
            handleChange={(value) =>
              setDados({ ...dados, distanciaInversorRoteador: value })
            }
          />
          <SelectInput
            label={"TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES"}
            editable={true}
            value={
              dados.tipoFixacaoInversores
                ? dados.tipoFixacaoInversores
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "ALVENARIA", value: "ALVENARIA" },
              { label: "LANCE DE MURO", value: "LANCE DE MURO" },
              { label: "PILAR", value: "PILAR" },
              {
                label: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                value: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
              },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, tipoFixacaoInversores: value })
            }
          />
          <TextInput
            label={"LINK PARA FOTOS DO DRONE"}
            editable={true}
            value={dados.fotosDrone}
            handleChange={(value) =>
              setDados({ ...dados, fotosDrone: value.toUpperCase() })
            }
          />
        </div>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <div className="w-fit flex flex-col items-center self-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="propostaComercial"
            >
              FOTO DA LOCALIZAÇÃO DA MONTAGEM DOS MÓDULOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalMontagemModulos ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalMontagemModulos.name}
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
                    fotoLocalMontagemModulos: e.target.files[0],
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
              FOTO DO LOCAL DO INVERSOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.fotoLocalInversor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.fotoLocalInversor.name}
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
                    fotoLocalInversor: e.target.files[0],
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
              ARQUIVO DO ESTUDO DE CASO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.estudoDeCaso ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.estudoDeCaso.name}
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
                    estudoDeCaso: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          SERVIÇOS ADICIONAIS
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
          <SelectInput
            label={"CASA DE MÁQUINAS"}
            editable={true}
            value={dados.casaDeMaquinas ? dados.casaDeMaquinas : "NÃO DEFINIDO"}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, casaDeMaquinas: value })
            }
          />
          <SelectInput
            label={"ALAMBRADO"}
            editable={true}
            value={dados.alambrado ? dados.alambrado : "NÃO DEFINIDO"}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) => setDados({ ...dados, alambrado: value })}
          />
          <SelectInput
            label={"BRITAGEM"}
            editable={true}
            value={dados.britagem ? dados.britagem : "NÃO DEFINIDO"}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) => setDados({ ...dados, britagem: value })}
          />
          <SelectInput
            label={"CONSTRUÇÃO DE BARRACÃO"}
            editable={true}
            value={
              dados.construcaoBarracao
                ? dados.construcaoBarracao
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, construcaoBarracao: value })
            }
          />
          <SelectInput
            label={"INSTALAÇÃO DE ROTEADOR"}
            editable={true}
            value={
              dados.instalacaoRoteador
                ? dados.instalacaoRoteador
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, instalacaoRoteador: value })
            }
          />
          <SelectInput
            label={"REDE PARA RELIGAÇÃO DA FAZENDA"}
            editable={true}
            value={dados.redeReligacao ? dados.redeReligacao : "NÃO DEFINIDO"}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, redeReligacao: value })
            }
          />
          <SelectInput
            label={"LIMPEZA DO LOCAL DA USINA DE SOLO"}
            editable={true}
            value={
              dados.limpezaLocalUsinaSolo
                ? dados.limpezaLocalUsinaSolo
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, limpezaLocalUsinaSolo: value })
            }
          />
          <SelectInput
            label={"TERRAPLANAGEM PARA USINA DE SOLO"}
            editable={true}
            value={
              dados.terraplanagemUsinaSolo
                ? dados.terraplanagemUsinaSolo
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              {
                label: "SIM - RESPONSABILIDADE AMPÈRE",
                value: "SIM - RESPONSABILIDADE AMPÈRE",
              },
              {
                label: "SIM - RESPONSABILIDADE CLIENTE",
                value: "SIM - RESPONSABILIDADE CLIENTE",
              },
              { label: "NÃO", value: "NÃO" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, terraplanagemUsinaSolo: value })
            }
          />
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

export default FormVisitaTecnicaRural;
