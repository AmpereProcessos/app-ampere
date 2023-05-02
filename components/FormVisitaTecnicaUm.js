import React, { useState } from "react";
import {
  cidadesAtendidas,
  tiposSolicitacaoVisitaTecnica,
} from "../utils/constants";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
function FormVisitaTecnicaUm({
  dados,
  setDados,
  images,
  setImages,
  avancar,
  uploadImages,
}) {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });

  const [dadosInversores, setDadosInvesores] = useState({
    marca: "",
    qtde: 0,
    pot: 0,
  });
  const [dadosModulos, setDadosModulos] = useState({
    marca: "",
    qtde: 0,
    pot: 0,
  });
  const [arrModulos, setArrModulos] = useState([]);
  const [arrInv, setArrInv] = useState([]);
  function formatPhone(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          console.log(res.data.erro);
          return;
        } else {
          setDados({
            ...dados,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "ITUIUTABA",
            logradouro: res.data.logradouro,
          });
        }
      });
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
    return cep;
  }
  function validateFields() {
    if (dados.nomeVendedor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.telefoneVendedor.trim().length < 9) {
      setMsg({
        text: "Por favor, preencha o telefone do vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.nomeDoCliente.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha o nome do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.telefoneDoCliente.trim().length < 9) {
      setMsg({
        text: "Por favor, preencha o telefone do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (!dados.codigoSVB) {
      setMsg({
        text: "Por favor, preencha o código SVB.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.cidade == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha a cidade do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.bairro.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha o bairro do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.logradouro.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha o logradouro do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (!dados.numeroResidencia) {
      setMsg({
        text: "Por favor, preencha o número da residência do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoDeSolicitacao != "ORÇAMENTAÇÃO") {
      if (dados.tipoInversor == "NÃO DEFINIDO") {
        setMsg({
          text: "Por favor, preencha o tipo do inversor.",
          color: "text-red-500",
        });
        return false;
      }
      if (!dados.qtdeInversor) {
        setMsg({
          text: "Por favor, preencha a quantidade de inversor(es).",
          color: "text-red-500",
        });
        return false;
      }
      if (!dados.potInversor) {
        setMsg({
          text: "Por favor, preencha a potência do(s) inversor(es).",
          color: "text-red-500",
        });
        return false;
      }
      if (dados.marcaInversor.trim().length < 2) {
        setMsg({
          text: "Por favor, preencha a marca do(s) inversor(es).",
          color: "text-red-500",
        });
        return false;
      }
      if (!dados.qtdeModulos) {
        setMsg({
          text: "Por favor, preencha a quantidade de módulos.",
          color: "text-red-500",
        });
        return false;
      }
      if (!dados.potModulos) {
        setMsg({
          text: "Por favor, preencha a potência dos módulos.",
          color: "text-red-500",
        });
        return false;
      }
      if (dados.marcaModulos.trim() < 2) {
        setMsg({
          text: "Por favor, preencha a marca dos módulos.",
          color: "text-red-500",
        });
        return false;
      }
    }

    if (dados.tipoDeLaudo == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de laudo a ser requisitado",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoDeSolicitacao == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de solicitação.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.localizacao) {
      setMsg({
        text: "Por favor, anexe um comprovante da sua localização.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  function handleConclusion() {
    if (validateFields()) {
      uploadImages();
    }
  }
  function goToNext() {
    if (validateFields()) {
      console.log(validateFields());
      avancar();
    }
  }
  function addInversor() {
    arrInv.push(dadosInversores);
    setArrInv((arrInv) => [...arrInv]);
    let marcaArr = arrInv.map((i) => i.marca);
    let qtdeArr = arrInv.map((i) => i.qtde);
    let potArr = arrInv.map((i) => i.pot);
    let joinedMarcaArr = marcaArr.join("/");
    let joinedQtdeArr = qtdeArr.join("/");
    let joinedPotArr = potArr.join("/");
    setDados({
      ...dados,
      marcaInversor: joinedMarcaArr,
      qtdeInversor: joinedQtdeArr,
      potInversor: joinedPotArr,
    });
  }
  function addModulos() {
    arrModulos.push(dadosModulos);
    setArrModulos((arrModulos) => [...arrModulos]);
    let marcaArr = arrModulos.map((i) => i.marca);
    let qtdeArr = arrModulos.map((i) => i.qtde);
    let potArr = arrModulos.map((i) => i.pot);
    let joinedMarcaArr = marcaArr.join("/");
    let joinedQtdeArr = qtdeArr.join("/");
    let joinedPotArr = potArr.join("/");
    setDados({
      ...dados,
      marcaModulos: joinedMarcaArr,
      qtdeModulos: joinedQtdeArr,
      potModulos: joinedPotArr,
    });
  }
  console.log(dados);
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 justify-around flex-wrap p-2">
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          SOBRE O CLIENTE
        </h1>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"NOME DO CLIENTE"}
            editable={true}
            width={"450px"}
            value={dados.nomeDoCliente}
            handleChange={(value) =>
              setDados({ ...dados, nomeDoCliente: value.toUpperCase() })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={"TELEFONE DO CLIENTE"}
            editable={true}
            width={"450px"}
            value={dados.telefoneDoCliente}
            handleChange={(value) =>
              setDados({ ...dados, telefoneDoCliente: formatPhone(value) })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <NumberFloatingInput
            label={"Nº DO PROJETO SVB"}
            editable={true}
            width={"450px"}
            value={dados.codigoSVB ? dados.codigoSVB : ""}
            handleChange={(value) =>
              setDados({ ...dados, codigoSVB: Number(value) })
            }
          />
        </div>
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectFloatingInput
          label={"CIDADE"}
          editable={true}
          width={"450px"}
          value={dados.cidade}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ...cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade };
            }),
          ]}
          handleChange={(value) => setDados({ ...dados, cidade: value })}
        />
        <TextFloatingInput
          label={"CEP"}
          editable={true}
          width={"450px"}
          value={dados.cep}
          handleChange={(value) =>
            setDados({ ...dados, cep: formatCEP(value) })
          }
        />
        <button
          onClick={() => findCPF()}
          className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
        >
          <AiOutlineSearch />
        </button>
        <TextFloatingInput
          label={"BAIRRO"}
          editable={true}
          width={"450px"}
          value={dados.bairro}
          handleChange={(value) =>
            setDados({ ...dados, bairro: value.toUpperCase() })
          }
        />
        <TextFloatingInput
          label={"LOGRADOURO"}
          editable={true}
          width={"450px"}
          value={dados.logradouro}
          handleChange={(value) =>
            setDados({ ...dados, logradouro: value.toUpperCase() })
          }
        />
        <NumberFloatingInput
          label={"N°RESIDÊNCIA"}
          editable={true}
          width={"450px"}
          value={dados.numeroResidencia}
          handleChange={(value) =>
            setDados({ ...dados, numeroResidencia: Number(value) })
          }
        />
      </div>
      <div className="flex flex-col mt-2">
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          EQUIPAMENTO
        </h1>
        <div className="flex items-center justify-center w-full">
          <SelectFloatingInput
            label={"TIPO DE TOPOLOGIA"}
            editable={true}
            width={"450px"}
            value={dados.tipoInversor}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
              { label: "INVERSOR", value: "INVERSOR" },
              { label: "OTIMIZADOR", value: "OTIMIZADOR" },
            ]}
            handleChange={(value) =>
              setDados({ ...dados, tipoInversor: value })
            }
          />
        </div>

        <div className="flex flex-col border-t border-gray-200 p-2">
          <h1 className="text-center text-[#15599a] text-sm font-bold mt-2">
            ADICIONE MICRO/INVERSORES
          </h1>
          <div className="flex flex-col mb-1 px-2">
            <p className="text-center italic text-xs">
              Você agora pode adicionar micro/inversores de potência e/ou marca
              diferentes.
            </p>
            <p className="text-center italic text-xs text-[#fead61] font-bold">
              Preencha as informações do micro/inversor e clique em adicionar.
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-x-2 gap-y-1 mt-3">
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"MARCA DO INVERSOR/MICRO"}
                editable={true}
                value={dadosInversores.marca}
                handleChange={(value) =>
                  setDadosInvesores({
                    ...dadosInversores,
                    marca: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                label={"QTDE INVERSOR/MICRO"}
                editable={true}
                value={dadosInversores.qtde}
                handleChange={(value) =>
                  setDadosInvesores({ ...dadosInversores, qtde: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                label={"POTÊNCIA INVERSOR/MICRO"}
                unit={"W"}
                editable={true}
                value={dadosInversores.pot}
                handleChange={(value) =>
                  setDadosInvesores({ ...dadosInversores, pot: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <div
                onClick={addInversor}
                className="bg-green-300 hover:bg-green-500 text-white flex justify-center items-center h-fit p-2 rounded cursor-pointer"
              >
                <MdOutlineAddCircle style={{ fontSize: "15px" }} />
              </div>
            </div>
          </div>
        </div>
        {arrInv.length > 0 && (
          <div className="flex flex-col mt-2 font-bold">
            <h1 className="text-center text-[#15599a] text-xs">
              INVERSORES ADICIONADOS
            </h1>
            {arrInv.map((inv, index) => (
              <div
                key={index}
                className="flex justify-around items-center my-1"
              >
                <p className="text-xs font-bold">{inv.marca}</p>
                <p className="text-xs font-bold">{inv.qtde} UN</p>
                <p className="text-xs font-bold">{inv.pot} W</p>
                <button
                  onClick={() => {
                    let arr = arrInv;
                    arr.splice(index, 1);
                    let marcaArr = arrInv.map((i) => i.marca);
                    let qtdeArr = arrInv.map((i) => i.qtde);
                    let potArr = arrInv.map((i) => i.pot);
                    let joinedMarcaArr = marcaArr.join("/");
                    let joinedQtdeArr = qtdeArr.join("/");
                    let joinedPotArr = potArr.join("/");
                    setDados({
                      ...dados,
                      marcaInversor: joinedMarcaArr,
                      qtdeInversor: joinedQtdeArr,
                      potInversor: joinedPotArr,
                    });
                    setArrInv([...arr]);
                  }}
                  className="bg-red-500 p-1 rounded"
                >
                  <FiDelete />
                </button>
              </div>
            ))}
          </div>
        )}
        {dados.tipoInversor == "OTIMIZADOR" && (
          <div className="flex gap-2 justify-around flex-wrap mt-2 p-2">
            <TextFloatingInput
              label={"MARCA DO OTIMIZADOR"}
              editable={true}
              value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
              handleChange={(value) =>
                setDados({ ...dados, marcaOtimizador: value.toUpperCase() })
              }
            />
            <NumberFloatingInput
              label={"QTDE DE OTIMIZADORES"}
              editable={true}
              value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
              handleChange={(value) =>
                setDados({ ...dados, qtdeOtimizador: Number(value) })
              }
            />
            <NumberFloatingInput
              label={"POTÊNCIA DO(S) OTIMIZADOR(ES"}
              unit={"W"}
              editable={true}
              value={dados.potOtimizador ? dados.potOtimizador : null}
              handleChange={(value) =>
                setDados({ ...dados, potOtimizador: Number(value) })
              }
            />
          </div>
        )}
        <div className="flex flex-col border-t border-gray-200 p-2">
          <h1 className="text-center text-[#15599a] text-sm font-bold mt-2">
            ADICIONE MÓDULOS
          </h1>
          <div className="flex flex-col mb-1 px-2">
            <p className="text-center italic text-xs">
              Você agora pode adicionar módulos de potência e/ou marca
              diferentes.
            </p>
            <p className="text-center italic text-xs text-[#fead61] font-bold">
              Preencha as informações do módulos e clique em adicionar.
            </p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-x-2 gap-y-1 mt-3">
            <div className="flex items-center justify-center">
              <TextFloatingInput
                label={"MARCA DOS MÓDULOS"}
                editable={true}
                value={dadosModulos.marca}
                handleChange={(value) =>
                  setDadosModulos({
                    ...dadosModulos,
                    marca: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                label={"Nº DE MÓDULOS"}
                editable={true}
                value={dadosModulos.qtde}
                handleChange={(value) =>
                  setDadosModulos({ ...dadosModulos, qtde: Number(value) })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                label={"POTÊNCIA DOS MÓDULOS"}
                unit={"W"}
                editable={true}
                value={dadosModulos.pot}
                handleChange={(value) =>
                  setDadosModulos({ ...dadosModulos, pot: Number(value) })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <div
                onClick={addModulos}
                className="bg-green-300 hover:bg-green-500 text-white flex justify-center items-center h-fit p-2 rounded cursor-pointer"
              >
                <MdOutlineAddCircle style={{ fontSize: "15px" }} />
              </div>
            </div>
          </div>
        </div>
        {arrModulos.length > 0 && (
          <div className="flex flex-col mt-2 font-bold">
            <h1 className="text-center text-[#15599a] text-xs">
              MÓDULOS ADICIONADOS
            </h1>
            {arrModulos.map((inv, index) => (
              <div
                key={index}
                className="flex flex-col lg:grid lg:grid-cols-4 gap-x-2 gap-y-1 mt-3"
              >
                <p className="text-xs font-bold text-center">{inv.marca}</p>
                <p className="text-xs font-bold text-center">{inv.qtde} UN</p>
                <p className="text-xs font-bold text-center">{inv.pot} W</p>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => {
                      let arr = arrModulos;
                      arr.splice(index, 1);
                      let marcaArr = arrModulos.map((i) => i.marca);
                      let qtdeArr = arrModulos.map((i) => i.qtde);
                      let potArr = arrModulos.map((i) => i.pot);
                      let joinedMarcaArr = marcaArr.join("/");
                      let joinedQtdeArr = qtdeArr.join("/");
                      let joinedPotArr = potArr.join("/");
                      setDados({
                        ...dados,
                        marcaModulos: joinedMarcaArr,
                        qtdeModulos: joinedQtdeArr,
                        potModulos: joinedPotArr,
                      });
                      setArrModulos([...arr]);
                    }}
                    className="bg-red-500 p-1 rounded"
                  >
                    <FiDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          OBSERVAÇÕES PARA VISITA
        </span>
        <textarea
          placeholder={"Descrição aqui.."}
          value={dados.obsVisita}
          onChange={(e) => setDados({ ...dados, obsVisita: e.target.value })}
          className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
        />
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-4">
        <SelectFloatingInput
          label={"TIPO DE LAUDO"}
          editable={true}
          width={"450px"}
          value={dados.tipoDeLaudo}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            {
              label: "ESTUDO SIMPLES (36 HORAS)",
              value: "ESTUDO SIMPLES (36 HORAS)",
            },
            {
              label: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
              value: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
            },
            {
              label: "ESTUDO COMPLEXO (72 HORAS)",
              value: "ESTUDO COMPLEXO (72 HORAS)",
            },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoDeLaudo: value })}
        />
        <SelectFloatingInput
          label={"TIPO DE SOLICITAÇÃO"}
          editable={true}
          width={"450px"}
          value={dados.tipoDeSolicitacao}
          options={tiposSolicitacaoVisitaTecnica}
          handleChange={(value) =>
            setDados({ ...dados, tipoDeSolicitacao: value })
          }
        />
      </div>
      <div className="w-fit flex flex-col items-center self-center">
        <label
          className="ml-2 text-center text-[#15599a] font-bold"
          htmlFor="propostaComercial"
        >
          PRINT A TELA E ENVIE SUA LOCALIZAÇÃO
        </label>
        <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
          <div className="absolute">
            {images.localizacao ? (
              <div className="flex flex-col items-center">
                <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                <span className="block text-gray-400 font-normal text-center">
                  {images.localizacao.file.name}
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
                localizacao: {
                  title: "LOCALIZAÇÃO",
                  file: e.target.files[0],
                },
              })
            }
            className="h-full w-full opacity-0"
            type="file"
            accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
          />
        </div>
      </div>
      {msg.text && (
        <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>
      )}
      {[
        "VISITA TÉCNICA IN LOCO - URBANA",
        "ALTERAÇÃO DE PROJETO",
        "AUMENTO DE SISTEMA AMPÈRE",
        "VISITA TÉCNICA IN LOCO - RURAL",
      ].includes(dados.tipoDeSolicitacao) ? (
        <div className="flex justify-center items-center mt-3">
          <button
            onClick={handleConclusion}
            className="bg-[#fead61] hover:bg-[#15599a] text-center hover:text-white font-bold p-2 rounded w-fit"
          >
            ENVIAR FORMULÁRIO
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-3">
          <button
            onClick={goToNext}
            className="bg-[#fead61] hover:bg-[#15599a] text-center hover:text-white font-bold p-2 rounded w-fit"
          >
            PRÓXIMA ETAPA
          </button>
        </div>
      )}
    </div>
  );
}

export default FormVisitaTecnicaUm;
