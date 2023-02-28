import React, { useState } from "react";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";

function FormVisitaTecnicaRural({
  dados,
  setDados,
  images,
  setImages,
  uploadImages,
}) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  function validateFields() {
    if (!images.fotoPadrao) {
      setMsg({
        text: "Por favor, anexe a foto do padrão.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoLocalizacaoPadraoAntigo) {
      setMsg({
        text: "Por favor, anexe a foto da localização do padrão antigo.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoDisjuntor) {
      setMsg({
        text: "Por favor, anexe a foto do disjuntor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoDisjuntor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo do disjuntor",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.amperagem == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha a amperagem.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.numeroMedidor.trim().length < 5) {
      setMsg({
        text: "Por favor, preencha o número do medidor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.padraoTrafoAcoplados == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha se o trafo e o padrão são acoplados.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.potTrafo == 0 || dados.potTrafo == "") {
      setMsg({
        text: "Por favor, preencha a potência do transformador.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoTrafo) {
      setMsg({
        text: "Por favor, anexe a foto do transformador.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoLocalizacaoTrafo) {
      setMsg({
        text: "Por favor, anexe a foto da localização do transformador.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoNumeroTrafo) {
      setMsg({
        text: "Por favor, anexe a foto do número do transformador.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoLocalMontagem) {
      setMsg({
        text: "Por favor, anexe a foto do local de montagem.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.estruturaMontagem == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo da estrutura.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoLocalMontagemModulos) {
      setMsg({
        text: "Por favor, anexe a foto do local de montagem dos módulos.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.orientacaoEstrutura.trim().length < 5) {
      setMsg({
        text: "Por favor, preencha a orientação da montagem dos módulos.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoEstrutura == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de estrutura.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoTelha == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de telha.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.localInstalacaoInversor.trim().length < 4) {
      setMsg({
        text: "Por favor, preencha o local de instalação do inversor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.distanciaModulosInversores.trim().length < 1) {
      setMsg({
        text: "Por favor, preencha a distância dos módulos aos inversores.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.distanciaInversorPadrao.trim().length < 1) {
      setMsg({
        text: "Por favor, preencha a distância dos inversores ao padrão.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.distanciaInversorRoteador.trim().length < 1) {
      setMsg({
        text: "Por favor, preencha a distância dos inversores ao roteador.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.estudoDeCaso) {
      setMsg({
        text: "Por favor, anexe o estudo de caso.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.casaDeMaquinas == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de casa de máquinas.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.alambrado == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de alambrado.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.britagem == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de britagem.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.construcaoBarracao == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de construção de barracão.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.instalacaoRoteador == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de instalação de roteador.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.redeReligacao == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha sobre a necessidade de rede para religação da fazenda.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
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
                      {images.fotoPadrao.file.name}
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
                    fotoPadrao: {
                      title: "FOTO DO PADRÃO",
                      file: e.target.files[0],
                    },
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
                      {images.fotoLocalizacaoPadraoAntigo.file.name}
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
                    fotoLocalizacaoPadraoAntigo: {
                      title: "FOTO lOCALIZAÇÃO DO PADRÃO ANTIGO",
                      file: e.target.files[0],
                    },
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
                      {images.fotoLocalizacaoPadraoNovo.file.name}
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
                    fotoLocalizacaoPadraoNovo: {
                      title: "FOTO DA LOCALIZAÇÃO DO PADRÃO NOVO",
                      file: e.target.files[0],
                    },
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
                      {images.fotoDisjuntor.file.name}
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
                    fotoDisjuntor: {
                      title: "FOTO DO DISJUNTOR DO PADRÃO",
                      file: e.target.files[0],
                    },
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
          <SelectFloatingInput
            label={"DISJUNTOR DO PADRÃO"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"AMPERAGEM"}
            editable={true}
            width={"450px"}
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
          <TextFloatingInput
            label={"NÚMERO DO MEDIDOR"}
            editable={true}
            width={"450px"}
            value={dados.numeroMedidor}
            handleChange={(value) =>
              setDados({ ...dados, numeroMedidor: value })
            }
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
          TRANSFORMADOR
        </span>
        <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
          <SelectFloatingInput
            label={"PADRÃO E TRANSFORMADOR ACOPLADOS"}
            editable={true}
            width={"450px"}
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
          <NumberFloatingInput
            label={"POTÊNCIA DO TRANSFORMADOR"}
            unit={"kVA"}
            editable={true}
            width={"450px"}
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
                      {images.fotoTrafo.file.name}
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
                    fotoTrafo: {
                      title: "FOTO DO TRANSFORMADOR",
                      file: e.target.files[0],
                    },
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
                      {images.fotoLocalizacaoTrafo.file.name}
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
                    fotoLocalizacaoTrafo: {
                      title: "FOTO DA LOCALIZAÇÃO DO TRAFO",
                      file: e.target.files[0],
                    },
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
                      {images.fotoNumeroTrafo.file.name}
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
                    fotoNumeroTrafo: {
                      title: "FOTO DO NÚMERO DO TRANSFORMADOR",
                      file: e.target.files[0],
                    },
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
                      {images.fotoRamalTrafoPadrao.file.name}
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
                    fotoRamalTrafoPadrao: {
                      title: "FOTO DO RAMAL DO TRAFO AO PADRÃO",
                      file: e.target.files[0],
                    },
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
                      {images.fotoCabosReligacao.file.name}
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
                    fotoCabosReligacao: {
                      title:
                        "FOTO DOS CABOS DO PADRÃO PARA RELIGAÇÃO DA FAZENDA",
                      file: e.target.files[0],
                    },
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
                      {images.fotoLocalMontagem.file.name}
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
                    fotoLocalMontagem: {
                      title: "FOTO DO LOCAL DA MONTAGEM",
                      file: e.target.files[0],
                    },
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
          <SelectFloatingInput
            label={"TIPO DE ESTRUTURA - MONTAGEM DOS MÓDULOS"}
            editable={true}
            width={"450px"}
            value={dados.estruturaMontagem}
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
              setDados({ ...dados, estruturaMontagem: value })
            }
          />
          <TextFloatingInput
            label={"ORIENTAÇÃO DA MONTAGEM DOS MÓDULOS"}
            editable={true}
            width={"450px"}
            value={dados.orientacaoEstrutura}
            handleChange={(value) =>
              setDados({ ...dados, orientacaoEstrutura: value.toUpperCase() })
            }
          />
          <SelectFloatingInput
            label={"TIPO DA ESTRUTURA"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"TIPO DA TELHA"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"CLIENTE POSSUI TELHAS RESERVAS"}
            editable={true}
            width={"450px"}
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
          <TextFloatingInput
            label={"LOCAL DE MONTAGEM DO INVERSOR"}
            editable={true}
            width={"450px"}
            value={dados.localInstalacaoInversor}
            handleChange={(value) =>
              setDados({
                ...dados,
                localInstalacaoInversor: value.toUpperCase(),
              })
            }
          />
          <TextFloatingInput
            label={"DISTÂNCIA DOS MÓDULOS ATÉ OS INVERSORES"}
            editable={true}
            width={"450px"}
            value={
              dados.distanciaModulosInversores
                ? dados.distanciaModulosInversores
                : ""
            }
            handleChange={(value) =>
              setDados({ ...dados, distanciaModulosInversores: value })
            }
          />
          <TextFloatingInput
            label={"DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO"}
            editable={true}
            width={"450px"}
            value={dados.distanciaInversorPadrao}
            handleChange={(value) =>
              setDados({ ...dados, distanciaInversorPadrao: value })
            }
          />
          <TextFloatingInput
            label={"DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR"}
            editable={true}
            width={"450px"}
            value={dados.distanciaInversorRoteador}
            handleChange={(value) =>
              setDados({ ...dados, distanciaInversorRoteador: value })
            }
          />
          <SelectFloatingInput
            label={"TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES"}
            editable={true}
            width={"450px"}
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
          <TextFloatingInput
            label={"LINK PARA FOTOS DO DRONE"}
            editable={true}
            width={"450px"}
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
                      {images.fotoLocalMontagemModulos.file.name}
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
                    fotoLocalMontagemModulos: {
                      title: "FOTO DA LOCALIZAÇÃO DA MONTAGEM DOS MÓDULOS",
                      file: e.target.files[0],
                    },
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
                      {images.fotoLocalInversor.file.name}
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
                    fotoLocalInversor: {
                      title: "FOTO DO LOCAL DO INVERSOR",
                      file: e.target.files[0],
                    },
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
                      {images.estudoDeCaso.file.name}
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
                    estudoDeCaso: {
                      title: "ESTUDO DE CASO",
                      file: e.target.files[0],
                    },
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
          <SelectFloatingInput
            label={"CASA DE MÁQUINAS"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"ALAMBRADO"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"BRITAGEM"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"CONSTRUÇÃO DE BARRACÃO"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"INSTALAÇÃO DE ROTEADOR"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"REDE PARA RELIGAÇÃO DA FAZENDA"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"LIMPEZA DO LOCAL DA USINA DE SOLO"}
            editable={true}
            width={"450px"}
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
          <SelectFloatingInput
            label={"TERRAPLANAGEM PARA USINA DE SOLO"}
            editable={true}
            width={"450px"}
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
        <button
          onClick={uploadImages}
          className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded"
        >
          ENVIAR FORMULÁRIO
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaRural;
