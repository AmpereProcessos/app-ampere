import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
function ConferenciaManPreventivaOS({ info, cliente, index, saveChanges }) {
  const [infoHolder, setInfo] = useState({
    testesCCeCA: info.conferencias?.testesCCeCA,
    conferenciaConectores: info.conferencias?.conferenciaConectores,
    conferenciaGrampos: info.conferencias?.conferenciaGrampos,
    revisaoMadeiramento: info.conferencias?.revisaoMadeiramento,
    anotacoes: info.conferencias?.anotacoes,
    materiais: info.materiais,
  });
  const [images, setImages] = useState({});

  const [msg, setMsg] = useState({ text: "", color: "" });

  function validateOSClosing() {
    if (!infoHolder.testesCCeCA) {
      setMsg({
        text: "Por favor, adicione preencha a execução dos testes CC e CA",
        color: "text-red-500",
      });
      return false;
    }
    if (!infoHolder.conferenciaConectores) {
      setMsg({
        text: "Por favor, adicione preencha a execução da conferência dos conectores.",
        color: "text-red-500",
      });
      return false;
    }
    if (!infoHolder.conferenciaGrampos) {
      setMsg({
        text: "Por favor, adicione preencha a execução da conferência dos grampos.",
        color: "text-red-500",
      });
      return false;
    }
    if (!infoHolder.revisaoMadeiramento) {
      setMsg({
        text: "Por favor, adicione preencha a execução da revisão do madeiramento.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.paineisPreLimpeza) {
      setMsg({
        text: "Por favor, adicione foto(s) dos painéis pré-limpeza.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.paineisPosLimpeza) {
      setMsg({
        text: "Por favor, adicione foto(s) dos painéis pós-limpeza.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.kitInversor) {
      setMsg({
        text: "Por favor, adicione foto(s) do quadro(s), string box (se houver) e inversor(res).",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.infraEletromecanica) {
      setMsg({
        text: "Por favor, adicione foto(s) da infraestrutura eletromecânica.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.sistemaLigado) {
      setMsg({
        text: "Por favor, adicione foto(s) do sistema ligado.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.termoAssinado) {
      setMsg({
        text: "Por favor, adicione foto(s) do termo assinado.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  async function closeOS() {
    if (validateOSClosing()) {
      var holder;
      var links = [];
      setMsg({ text: "Enviando imagens...", color: "text-[#15599a]" });
      try {
        if (images.paineisPreLimpeza) {
          for (let i = 0; i < images.paineisPreLimpeza.length; i++) {
            let file = images.paineisPreLimpeza.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/paineisPreLimpeza${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `PAINÉIS PRÉ-LIMPEZA (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.irregularidades) {
          for (let i = 0; i < images.irregularidades.length; i++) {
            let file = images.irregularidades.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/irregularidades${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `IRREGULARIDADES (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.paineisPosLimpeza) {
          for (let i = 0; i < images.paineisPosLimpeza.length; i++) {
            let file = images.paineisPosLimpeza.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/paineisPosLimpeza${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `PAINÉIS PÓS-LIMPEZA (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.irregularidadesCorrigidas) {
          for (let i = 0; i < images.irregularidadesCorrigidas.length; i++) {
            let file = images.irregularidadesCorrigidas.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/irregularidadesCorrigidas${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `IRREGULARIDADES CORRIGIDAS (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.kitInversor) {
          for (let i = 0; i < images.kitInversor.length; i++) {
            let file = images.kitInversor.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/kitInversor${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `KIT INVERSOR (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.infraEletromecanica) {
          for (let i = 0; i < images.infraEletromecanica.length; i++) {
            let file = images.infraEletromecanica.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/infraEletromecanica${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `INFRAELETROMECÂNICA LIMPA (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.sistemaLigado) {
          for (let i = 0; i < images.sistemaLigado.length; i++) {
            let file = images.sistemaLigado.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/sistemaLigado${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `SISTEMA LIGADO (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.termoAssinado) {
          for (let i = 0; i < images.termoAssinado.length; i++) {
            let file = images.termoAssinado.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/termoAssinado${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `TERMO ASSINADO (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        // if (images.ligacoesFeitas) {
        //   var imageRef = ref(storage, `clientes/${cliente}/ligacoesFeitas`);
        //   let res = await uploadBytes(imageRef, images.ligacoesFeitas);
        //   let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        //   links.push({
        //     title: "LIGAÇÕES FEITAS",
        //     link: url,
        //     format: fileTypes[res.metadata.contentType]
        //       ? fileTypes[res.metadata.contentType].title
        //       : "INDEFINIDO",
        //   });
        // }
        // if (images.disjuntor) {
        //   var imageRef = ref(storage, `clientes/${cliente}/disjuntorPadrao`);
        //   let res = await uploadBytes(imageRef, images.disjuntor);
        //   let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        //   links.push({
        //     title: "DISJUNTOR DO PADRÃO",
        //     link: url,
        //     format: fileTypes[res.metadata.contentType]
        //       ? fileTypes[res.metadata.contentType].title
        //       : "INDEFINIDO",
        //   });
        // }
      } catch (error) {
        setMsg({
          text: "Houve um erro com a finalização da OS. Por favor, tente novamente.",
          color: "text-green-500",
        });
        holder = "ERRO";
      }
      if (holder == undefined) {
        saveChanges({
          [`ordensDeServico.${index}.conferencias.testesCCeCA`]:
            infoHolder.testesCCeCA,
          [`ordensDeServico.${index}.conferencias.conferenciaConectores`]:
            infoHolder.conferenciaConectores,
          [`ordensDeServico.${index}.conferencias.conferenciaGrampos`]:
            infoHolder.conferenciaGrampos,
          [`ordensDeServico.${index}.conferencias.revisaoMadeiramento`]:
            infoHolder.revisaoMadeiramento,
          [`ordensDeServico.${index}.conferencias.anotacoes`]:
            infoHolder.anotacoes,
          [`ordensDeServico.${index}.dataDeFechamento`]: new Date(),
          [`links.manutencaoPreventiva`]: links,
        });
        setMsg({
          text: "Ordem de serviço finalizada !",
          color: "text-green-500",
        });
      }
    }
  }
  // function getMaterials() {
  //   axios.get("/api/almoxarifado/materiais").then((res) => {
  //     setMateriais(res.data);
  //   });
  // }
  // function addMaterial() {
  //   let arr = infoHolder.materiais ? infoHolder.materiais : [];
  //   let index = arr.findIndex((obj) => obj.id == materialHolder.id);
  //   if (index != -1) {
  //     arr[index].qtde += materialHolder.qtde;
  //   } else {
  //     arr.push(materialHolder);
  //   }
  //   setInfo({ ...infoHolder, materiais: arr });
  //   setMaterialHolder({ ...materialHolder, qtde: null });
  // }
  // useEffect(() => {
  //   getMaterials();
  // }, []);
  console.log(infoHolder);
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a]">
        CONFERÊNCIA DE FECHAMENTO DA OS
      </h1>
      <div className="flex flex-col w-full mt-3 gap-2">
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.testesCCeCA}
            onChange={(e) =>
              setInfo({ ...infoHolder, testesCCeCA: e.target.checked })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            TESTES E CONFERÊNCIAS CA E CC FEITOS ?
          </label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.conferenciaConectores}
            onChange={(e) =>
              setInfo({
                ...infoHolder,
                conferenciaConectores: e.target.checked,
              })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            CONFERÊNCIA DOS CONECTORES FEITA ?
          </label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.conferenciaGrampos}
            onChange={(e) =>
              setInfo({ ...infoHolder, conferenciaGrampos: e.target.checked })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            CONFERÊNCIA DOS GRAMPOS (FINAL E/OU INTERMEDIÁRIOS) FEITA ?
          </label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.revisaoMadeiramento}
            onChange={(e) =>
              setInfo({ ...infoHolder, revisaoMadeiramento: e.target.checked })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            REVISAO DO MADEIRAMENTO FEITA ?
          </label>
        </div>
        <div className="flex gap-2 justify-around flex-wrap">
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="padraoMontado"
            >
              FOTO DOS PAINÉIS AINDA SUJOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.paineisPreLimpeza ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.paineisPreLimpeza.length == 1
                        ? images.paineisPreLimpeza[0].name
                        : `${images.paineisPreLimpeza[0].name}...`}
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
                onChange={(e) => {
                  setImages({
                    ...images,
                    paineisPreLimpeza: e.target.files,
                  });
                }}
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="irregularidades"
            >
              FOTO DE IRREGULARIDADES, SE HOUVER
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.irregularidades ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.irregularidades.length == 1
                        ? images.irregularidades[0].name
                        : `${images.irregularidades[0].name}...`}
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
                    irregularidades: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DOS PAINEIS LIMPOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.paineisPosLimpeza ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.paineisPosLimpeza.length == 1
                        ? images.paineisPosLimpeza[0].name
                        : `${images.paineisPosLimpeza[0].name}...`}
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
                    paineisPosLimpeza: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DAS IRREGULARIDADES CORRIGIDAS, SE HOUVER
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.irregularidadesCorrigidas ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.irregularidadesCorrigidas.length == 1
                        ? images.irregularidadesCorrigidas[0].name
                        : `${images.irregularidadesCorrigidas[0].name}...`}
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
                    irregularidadesCorrigidas: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DO(S) QUADRO(S), STRING BOX (QUANDO HOUVER) E INVERSOR(ES)
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.kitInversor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.kitInversor.length == 1
                        ? images.kitInversor[0].name
                        : `${images.kitInversor[0].name}...`}
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
                    kitInversor: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DA INFRAESTRUTURA ELETROMECANICA LIMPA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.infraEletromecanica ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.infraEletromecanica.length == 1
                        ? images.infraEletromecanica[0].name
                        : `${images.infraEletromecanica[0].name}...`}
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
                    infraEletromecanica: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DO SISTEMA LIGADO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.sistemaLigado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.sistemaLigado.length == 1
                        ? images.sistemaLigado[0].name
                        : `${images.sistemaLigado[0].name}...`}
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
                    sistemaLigado: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">
              FOTO DO TERMO ASSINADO PELO CLIENTE
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.termoAssinado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.termoAssinado.length == 1
                        ? images.termoAssinado[0].name
                        : `${images.termoAssinado[0].name}...`}
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
                    termoAssinado: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-center text-[#15599a] font-bold">
            ANOTAÇÕES DA OS
          </h1>
          <textarea
            value={infoHolder.anotacoes}
            onChange={(e) =>
              setInfo({
                ...infoHolder,
                anotacoes: e.target.value.toUpperCase(),
              })
            }
            className={
              "outline-none border text-xs border-gray-200 p-2 w-full lg:w-[600px] text-center resize-none min-h-[200px]"
            }
          />
        </div>
      </div>
      {msg.text && (
        <p className={`text-center italic text-xs ${msg.color} mt-2`}>
          {msg.text}
        </p>
      )}
      <div className="my-2 flex items-center justify-center mt-6">
        <button
          onClick={closeOS}
          className="p-2 rounded font-bold border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white "
        >
          FINALIZAR OS
        </button>
      </div>
    </div>
  );
}

export default ConferenciaManPreventivaOS;
