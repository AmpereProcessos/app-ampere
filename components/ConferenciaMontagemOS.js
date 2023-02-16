import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
import { parseCookies } from "nookies";
import EtapaTelhado from "./etapasConferenciaMontagem/EtapaTelhado";
import EtapaMontagemMecanica from "./etapasConferenciaMontagem/EtapaMontagemMecanica";
import EtapaLancamentoCabosConexoes from "./etapasConferenciaMontagem/EtapaLancamentoCabosConexoes";
import EtapaFinalizacao from "./etapasConferenciaMontagem/EtapaFinalizacao";
function ConferenciaMontagemOS({ info, cliente, index, saveChanges }) {
  const [stage, setStage] = useState(0);

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
          [`links.montagem`]: links,
        });
        setMsg({
          text: "Ordem de serviço finalizada !",
          color: "text-green-500",
        });
      }
    }
  }
  useEffect(() => {
    let { OSClosingStage } = parseCookies(null);
    if (OSClosingStage) {
      let stageFromString = OSClosingStage.split(" - ")[1];
      let stage = Number(stageFromString) - 1;
      setStage(stage);
    }
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a]">
        CONFERÊNCIA DE FECHAMENTO DA OS
      </h1>
      {stage == 0 && (
        <EtapaTelhado
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 1 && (
        <EtapaMontagemMecanica
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 2 && (
        <EtapaLancamentoCabosConexoes
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 3 && (
        <EtapaFinalizacao
          cliente={cliente}
          index={index}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {msg.text && (
        <p className={`text-center italic text-xs ${msg.color} mt-2`}>
          {msg.text}
        </p>
      )}
      {stage == 4 && (
        <div className="my-2 flex items-center justify-center mt-6">
          <button
            onClick={closeOS}
            className="p-2 rounded font-bold border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white "
          >
            PRÓXIMO
          </button>
        </div>
      )}
    </div>
  );
}

export default ConferenciaMontagemOS;
