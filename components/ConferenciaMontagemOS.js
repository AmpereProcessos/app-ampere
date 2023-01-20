import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
function ConferenciaMontagemOS({ info, cliente, index, saveChanges }) {
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
  const cidadesGoias = [
    "CALDAS NOVAS", // GO
    "PORTEIRÃO", // GO
    "SÃO SIMÃO", // GO
    "INACIOLÂNDIA", // GO
    "TRINDADE", // GO
    "ITUMBIARA", // GO
    "QUIRINÓPOLIS", // GO
    "PARANAIGUARA", // GO
    "CATALÃO", // GO
  ];
  console.log(info.cidade);
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
    if (!images.padraoComPlacaDeGeracao) {
      setMsg({
        text: "Por favor, adicione foto(s) do padrão com placa de geração.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.estruturaMontada) {
      setMsg({
        text: "Por favor, adicione foto(s) da estrutura montada.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.modulosInstalados) {
      setMsg({
        text: "Por favor, adicione foto(s) dos módulos instalados.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.datasheetModulos) {
      setMsg({
        text: "Por favor, adicione foto(s) dos datasheets dos módulos.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.datasheetInversores) {
      setMsg({
        text: "Por favor, adicione foto(s) dos datasheets dos inversores.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.inversoresInstalados) {
      setMsg({
        text: "Por favor, adicione foto(s) dos inversores instalados.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.quadroCA) {
      setMsg({
        text: "Por favor, adicione foto(s) do quadro CA.",
        color: "text-red-500",
      });
      return false;
    }
    if (cidadesGoias.includes(info.cidade)) {
      if (!images.medicoesCC) {
        setMsg({
          text: "Por favor, adicione foto(s) de medições de corrente e tensão CC de todas as strings.",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.tensaoCAEntrada) {
        setMsg({
          text: "Por favor, adicione foto(s) de tensão CA fase e linha na entrada de energia.",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.tensaoCAQuadroCAAntesDoDisjuntor) {
        setMsg({
          text: "Por favor, adicione foto(s) de tensão CA fase e linha no quadro CA antes do disjuntor",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.tensaoCAQuadroCADepoisDoDisjuntor) {
        setMsg({
          text: "Por favor, adicione foto(s) de tensão CA fase e linha no quadro CA depois do disjuntor",
          color: "text-red-500",
        });
        return false;
      }
    }
    // if (!images.paineisPosLimpeza) {
    //   setMsg({
    //     text: "Por favor, adicione foto(s) dos painéis pós-limpeza.",
    //     color: "text-red-500",
    //   });
    //   return false;
    // }
    // if (!images.kitInversor) {
    //   setMsg({
    //     text: "Por favor, adicione foto(s) do quadro(s), string box (se houver) e inversor(res).",
    //     color: "text-red-500",
    //   });
    //   return false;
    // }
    // if (!images.infraEletromecanica) {
    //   setMsg({
    //     text: "Por favor, adicione foto(s) da infraestrutura eletromecânica.",
    //     color: "text-red-500",
    //   });
    //   return false;
    // }
    // if (!images.sistemaLigado) {
    //   setMsg({
    //     text: "Por favor, adicione foto(s) do sistema ligado.",
    //     color: "text-red-500",
    //   });
    //   return false;
    // }
    // if (!images.termoAssinado) {
    //   setMsg({
    //     text: "Por favor, adicione foto(s) do termo assinado.",
    //     color: "text-red-500",
    //   });
    //   return false;
    // }
    setMsg({ text: "", color: "" });
    return true;
  }
  async function closeOS() {
    if (validateOSClosing()) {
      var holder;
      var links = [];
      setMsg({ text: "Enviando imagens...", color: "text-[#15599a]" });
      try {
        if (images.padraoComPlacaDeGeracao) {
          for (let i = 0; i < images.padraoComPlacaDeGeracao.length; i++) {
            let file = images.padraoComPlacaDeGeracao.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/padraoComPlacaDeGeracao${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `PADRÃO COM PLACA DE GERAÇÃO (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.estruturaMontada) {
          for (let i = 0; i < images.estruturaMontada.length; i++) {
            let file = images.estruturaMontada.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/estruturaMontada${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `ESTRUTURA MONTADA (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.modulosInstalados) {
          for (let i = 0; i < images.modulosInstalados.length; i++) {
            let file = images.modulosInstalados.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/modulosInstalados${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `MÓDULOS INSTALADOS (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.datasheetModulos) {
          for (let i = 0; i < images.datasheetModulos.length; i++) {
            let file = images.datasheetModulos.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/datasheetModulos${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `DATASHEETS DOS MÓDULOS (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.datasheetInversores) {
          for (let i = 0; i < images.datasheetInversores.length; i++) {
            let file = images.datasheetInversores.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/datasheetInversores${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `DATASHEETS DOS INVERSORES (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.inversoresInstalados) {
          for (let i = 0; i < images.inversoresInstalados.length; i++) {
            let file = images.inversoresInstalados.item(i);
            var imageRef = ref(
              storage,
              `clientes/${cliente}/inversoresInstalados${i + 1}`
            );
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `INVERSORES INSTALADOS (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.quadroCA) {
          for (let i = 0; i < images.quadroCA.length; i++) {
            let file = images.quadroCA.item(i);
            var imageRef = ref(storage, `clientes/${cliente}/quadroCA${i + 1}`);
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `QUADRO CA (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (images.quadroCC) {
          for (let i = 0; i < images.quadroCC.length; i++) {
            let file = images.quadroCC.item(i);
            var imageRef = ref(storage, `clientes/${cliente}/quadroCC${i + 1}`);
            let res = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `QUADRO CC (${i + 1})`,
              link: url,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            });
          }
        }
        if (cidadesGoias.includes(info.cidade)) {
          if (images.medicoesCC) {
            for (let i = 0; i < images.medicoesCC.length; i++) {
              let file = images.medicoesCC.item(i);
              var imageRef = ref(
                storage,
                `clientes/${cliente}/medicoesCC${i + 1}`
              );
              let res = await uploadBytes(imageRef, file);
              let url = await getDownloadURL(
                ref(storage, res.metadata.fullPath)
              );
              links.push({
                title: `MEDIÇÕES CC (${i + 1})`,
                link: url,
                format: fileTypes[res.metadata.contentType]
                  ? fileTypes[res.metadata.contentType].title
                  : "INDEFINIDO",
              });
            }
          }
          if (images.tensaoCAEntrada) {
            for (let i = 0; i < images.tensaoCAEntrada.length; i++) {
              let file = images.tensaoCAEntrada.item(i);
              var imageRef = ref(
                storage,
                `clientes/${cliente}/tensaoCAEntrada${i + 1}`
              );
              let res = await uploadBytes(imageRef, file);
              let url = await getDownloadURL(
                ref(storage, res.metadata.fullPath)
              );
              links.push({
                title: `TENSÃO CA (ENTRADA) (${i + 1})`,
                link: url,
                format: fileTypes[res.metadata.contentType]
                  ? fileTypes[res.metadata.contentType].title
                  : "INDEFINIDO",
              });
            }
          }
          if (images.tensaoCAQuadroCAAntesDoDisjuntor) {
            for (
              let i = 0;
              i < images.tensaoCAQuadroCAAntesDoDisjuntor.length;
              i++
            ) {
              let file = images.tensaoCAQuadroCAAntesDoDisjuntor.item(i);
              var imageRef = ref(
                storage,
                `clientes/${cliente}/tensaoCAQuadroCAAntesDoDisjuntor${i + 1}`
              );
              let res = await uploadBytes(imageRef, file);
              let url = await getDownloadURL(
                ref(storage, res.metadata.fullPath)
              );
              links.push({
                title: `TENSÃO CA (QUADRO CA - ANTES DO DISJUNTOR) (${i + 1})`,
                link: url,
                format: fileTypes[res.metadata.contentType]
                  ? fileTypes[res.metadata.contentType].title
                  : "INDEFINIDO",
              });
            }
          }
          if (images.tensaoCAQuadroCADepoisDoDisjuntor) {
            for (
              let i = 0;
              i < images.tensaoCAQuadroCADepoisDoDisjuntor.length;
              i++
            ) {
              let file = images.tensaoCAQuadroCADepoisDoDisjuntor.item(i);
              var imageRef = ref(
                storage,
                `clientes/${cliente}/tensaoCAQuadroCADepoisDoDisjuntor${i + 1}`
              );
              let res = await uploadBytes(imageRef, file);
              let url = await getDownloadURL(
                ref(storage, res.metadata.fullPath)
              );
              links.push({
                title: `TENSÃO CA (QUADRO CA - DEPOIS DO DISJUNTOR) (${i + 1})`,
                link: url,
                format: fileTypes[res.metadata.contentType]
                  ? fileTypes[res.metadata.contentType].title
                  : "INDEFINIDO",
              });
            }
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
              FOTO(S) DO PADRÃO COM PLACA DE GERAÇÃO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.padraoComPlacaDeGeracao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.padraoComPlacaDeGeracao.length == 1
                        ? images.padraoComPlacaDeGeracao[0].name
                        : `${images.padraoComPlacaDeGeracao[0].name}...`}
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
                    padraoComPlacaDeGeracao: e.target.files,
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
              htmlFor="estruturaMontada"
            >
              FOTO(S) DA ESTRUTURA MONTADA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.estruturaMontada ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.estruturaMontada.length == 1
                        ? images.estruturaMontada[0].name
                        : `${images.estruturaMontada[0].name}...`}
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
                    estruturaMontada: e.target.files,
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
              FOTO(S) DOS MÓDULOS INSTALADOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.modulosInstalados ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.modulosInstalados.length == 1
                        ? images.modulosInstalados[0].name
                        : `${images.modulosInstalados[0].name}...`}
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
                    modulosInstalados: e.target.files,
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
              FOTO(S) DOS DATASHEETS DOS MÓDULOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.datasheetModulos ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.datasheetModulos.length == 1
                        ? images.datasheetModulos[0].name
                        : `${images.datasheetModulos[0].name}...`}
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
                    datasheetModulos: e.target.files,
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
              FOTO(S) DOS DATASHEETS DOS INVERSORES
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.datasheetInversores ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.datasheetInversores.length == 1
                        ? images.datasheetInversores[0].name
                        : `${images.datasheetInversores[0].name}...`}
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
                    datasheetInversores: e.target.files,
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
              FOTO(S) DOS INVERSORES INSTALADOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.inversoresInstalados ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.inversoresInstalados.length == 1
                        ? images.inversoresInstalados[0].name
                        : `${images.inversoresInstalados[0].name}...`}
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
                    inversoresInstalados: e.target.files,
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
              FOTO(S) DO QUADRO CA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.quadroCA ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.quadroCA.length == 1
                        ? images.quadroCA[0].name
                        : `${images.quadroCA[0].name}...`}
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
                    quadroCA: e.target.files,
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
              FOTO(S) DO QUADRO CC (se houver stringbox)
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.quadroCC ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.quadroCC.length == 1
                        ? images.quadroCC[0].name
                        : `${images.quadroCC[0].name}...`}
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
                    quadroCC: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          {cidadesGoias.includes(info.cidade) && (
            <>
              <div className="w-fit flex flex-col items-center">
                <label className="ml-2 text-center text-[#15599a] font-bold">
                  FOTOS DE MEDIÇÕES DE CORRENTE E TENSÃO CC DE TODAS AS STRINGS
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.medicoesCC ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.medicoesCC.length == 1
                            ? images.medicoesCC[0].name
                            : `${images.medicoesCC[0].name}...`}
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
                        medicoesCC: e.target.files,
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
                  FOTOS DE TENSÃO CA FASE E LINHA NA ENTRADA DE ENERGIA
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.tensaoCAEntrada ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.tensaoCAEntrada.length == 1
                            ? images.tensaoCAEntrada[0].name
                            : `${images.tensaoCAEntrada[0].name}...`}
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
                        tensaoCAEntrada: e.target.files,
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
                  FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA ANTES DO
                  DISJUNTOR
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.tensaoCAQuadroCAAntesDoDisjuntor ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.tensaoCAQuadroCAAntesDoDisjuntor.length == 1
                            ? images.tensaoCAQuadroCAAntesDoDisjuntor[0].name
                            : `${images.tensaoCAQuadroCAAntesDoDisjuntor[0].name}...`}
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
                        tensaoCAQuadroCAAntesDoDisjuntor: e.target.files,
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
                  FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA DEPOIS DO
                  DISJUNTOR
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.tensaoCAQuadroCADepoisDoDisjuntor ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.tensaoCAQuadroCADepoisDoDisjuntor.length == 1
                            ? images.tensaoCAQuadroCADepoisDoDisjuntor[0].name
                            : `${images.tensaoCAQuadroCADepoisDoDisjuntor[0].name}...`}
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
                        tensaoCAQuadroCADepoisDoDisjuntor: e.target.files,
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    multiple={true}
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
              </div>
            </>
          )}
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

export default ConferenciaMontagemOS;
