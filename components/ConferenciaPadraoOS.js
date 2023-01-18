import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
import Select from "react-select";
import { MdOutlineAddCircle } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import axios from "axios";
function ConferenciaPadraoOS({ info, cliente, index, saveChanges }) {
  const [infoHolder, setInfo] = useState({
    realimentacaoFeita: info.conferencias?.realimentacaoFeita,
    ramalPassado: info.conferencias?.ramalPassado,
    anotacoes: info.conferencias?.anotacoes,
    materiais: info.materiais,
  });
  const [materiais, setMateriais] = useState([]);
  const [materialHolder, setMaterialHolder] = useState({
    nome: null,
    id: null,
    qtde: null,
  });
  const [images, setImages] = useState({});

  const [msg, setMsg] = useState({ text: "", color: "" });

  function validateOSClosing() {
    if (!infoHolder.anotacoes || infoHolder.anotacoes?.trim().length < 5) {
      setMsg({
        text: "Por favor, adicione anotações acerca da OS, dificultades encontradas, se o ramal não foi passado, o tamanho de ramal a ser levado e afins.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.padraoMontado) {
      setMsg({
        text: "Por favor, adicione uma foto do padrão montado",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.ligacoesFeitas) {
      setMsg({
        text: "Por favor, adicione uma foto das ligações feitas",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.disjuntor) {
      setMsg({
        text: "Por favor, adicione uma foto do disjuntor do padrão pós-montagem",
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
        if (images.padraoMontado) {
          var imageRef = ref(storage, `clientes/${cliente}/padraoMontado`);
          let res = await uploadBytes(imageRef, images.padraoMontado);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: "PADRÃO MONTADO",
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
        if (images.ligacoesFeitas) {
          var imageRef = ref(storage, `clientes/${cliente}/ligacoesFeitas`);
          let res = await uploadBytes(imageRef, images.ligacoesFeitas);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: "LIGAÇÕES FEITAS",
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
        if (images.disjuntor) {
          var imageRef = ref(storage, `clientes/${cliente}/disjuntorPadrao`);
          let res = await uploadBytes(imageRef, images.disjuntor);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: "DISJUNTOR DO PADRÃO",
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      } catch (error) {
        setMsg({
          text: "Houve um erro com a finalização da OS. Por favor, tente novamente.",
          color: "text-green-500",
        });
        holder = "ERRO";
      }
      if (holder == undefined) {
        saveChanges({
          [`ordensDeServico.${index}.conferencias.realimentacaoFeita`]:
            infoHolder.realimentacaoFeita,
          [`ordensDeServico.${index}.conferencias.ramalPassado`]:
            infoHolder.ramalPassado,
          [`ordensDeServico.${index}.conferencias.anotacoes`]:
            infoHolder.anotacoes,
          [`ordensDeServico.${index}.dataDeFechamento`]: new Date(),
          [`links.padrao`]: links,
        });
        setMsg({
          text: "Ordem de serviço finalizada !",
          color: "text-green-500",
        });
      }
    }
  }
  function getMaterials() {
    axios.get("/api/almoxarifado/materiais").then((res) => {
      setMateriais(res.data);
    });
  }
  function addMaterial() {
    let arr = infoHolder.materiais ? infoHolder.materiais : [];
    let index = arr.findIndex((obj) => obj.id == materialHolder.id);
    if (index != -1) {
      arr[index].qtde += materialHolder.qtde;
    } else {
      arr.push(materialHolder);
    }
    setInfo({ ...infoHolder, materiais: arr });
    setMaterialHolder({ ...materialHolder, qtde: null });
  }
  useEffect(() => {
    getMaterials();
  }, []);
  console.log(infoHolder);
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a]">
        CONFERÊNCIA DE FECHAMENTO DA OS
      </h1>
      <div className="flex flex-col w-full mt-3 gap-2">
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.realimentacaoFeita}
            onChange={(e) =>
              setInfo({ ...infoHolder, realimentacaoFeita: e.target.checked })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            REALIMENTAÇÃO FEITA ?
          </label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.ramalPassado}
            onChange={(e) =>
              setInfo({ ...infoHolder, ramalPassado: e.target.checked })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            RAMAL PASSADO ?
          </label>
        </div>
        <div className="flex gap-2 justify-around flex-wrap">
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="padraoMontado"
            >
              FOTO DO PADRÃO MONTADO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.padraoMontado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.padraoMontado.name}
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
                    padraoMontado: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="ligacoesFeitas"
            >
              FOTO DAS LIGAÇÕES FEITAS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.ligacoesFeitas ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.ligacoesFeitas.name}
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
                    ligacoesFeitas: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="ligacoesFeitas"
            >
              FOTO DO DISJUNTOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.disjuntor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.disjuntor.name}
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
                    disjuntor: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-2 border border-gray-200 p-2 w-full">
          <h1 className="text-center font-bold text-[#15599a] ">
            ADICIONE MATERIAIS GASTOS
          </h1>
          <div className="flex flex-col lg:items-center lg:flex-row gap-x-2  p-2 mt-4 w-full">
            <span className="text-center uppercase font-bold">ADICIONAR</span>
            <div className="grid grid-rows-3 gap-2 grid-cols-1 lg:grid-cols-7 lg:grid-rows-1 gap-x-2">
              <div className="grow row-span-1 lg:col-span-5">
                <Select
                  isMulti={false}
                  placeholder="MATERIAL"
                  onChange={(e) =>
                    setMaterialHolder({
                      ...materialHolder,
                      nome: e.value.nome,
                      id: e.value.id,
                    })
                  }
                  options={materiais.map((material) => {
                    return {
                      label: material.nome,
                      value: {
                        id: material._id,
                        nome: material.nome,
                      },
                    };
                  })}
                />
              </div>
              <input
                placeholder="QTDE"
                type="number"
                value={materialHolder.qtdeSaida}
                className="row-span-1 lg:col-span-1 outline-none text-center border border-gray-200"
                onChange={(e) =>
                  setMaterialHolder({
                    ...materialHolder,
                    qtde: Number(e.target.value),
                  })
                }
              />
              <div
                onClick={addMaterial}
                className="cursor-pointer flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold row-span-1 lg:col-span-1"
              >
                <MdOutlineAddCircle style={{ fontSize: "25px" }} />
              </div>
            </div>
          </div>
          {infoHolder.materiais?.length > 0 && (
            <div className="flex flex-col items-center w-full">
              <h1 className="text-center text-[#fead41] font-bold">
                LISTA DE MATERIAIS
              </h1>
              <div className="lg:grid hidden grid-cols-7 w-full">
                <p className="text-[#15599a] font-bold :col-span-4 text-center text-xs lg:text-base">
                  NOME
                </p>
                <p className="text-[#15599a] font-bold col-span-2 text-center text-xs lg:text-base">
                  QTDE USADA
                </p>
                <p className="text-[#15599a] font-bold col-span-1 text-center text-xs lg:text-base">
                  EXCLUIR
                </p>
              </div>
              {infoHolder.materiais.map((x, index) => (
                <div key={index} className="grid grid-cols-7 w-full">
                  <p className="text-[#15599a] font-bold col-span-4 text-center text-xs lg:text-base">
                    {x.nome}
                  </p>
                  <p className="text-[#15599a] font-bold col-span-2 text-center text-xs lg:text-base">
                    {x.qtde}
                  </p>
                  <div className="flex justify-center col-span-1">
                    <button
                      className="col-span-1 self-center"
                      onClick={() => {
                        let infoMaterial = infoHolder.materiais;
                        infoMaterial.splice(index, 1);
                        setInfo({ ...infoHolder, materiais: infoMaterial });
                      }}
                    >
                      <VscChromeClose
                        style={{ color: "red", fontSize: "15px" }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

export default ConferenciaPadraoOS;
