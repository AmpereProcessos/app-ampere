import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
function FormSolicitacaoQuatro({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState("");
  const [dadosInversores, setDadosInvesores] = useState({
    marca: "",
    qtde: 0,
    pot: 0,
  });
  const [arrInv, setArrInv] = useState([]);
  function validarCamposObrigatorios() {
    if (dados.topologia == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha uma topologia válida.");
      return false;
    }
    if (dados.marcaInversor.trim().length == 0) {
      setMessage("Por favor, preencha uma marca de inversor válida.");
      return false;
    }
    if (dados.qtdeInversor == null || dados.qtdeInversor <= 0) {
      setMessage("Por favor, preencha uma quantidade de inversor(es) válida");
      return false;
    }
    if (dados.potInversor == null || dados.potInversor <= 0) {
      setMessage("Por favor, preencha uma potência de inversor válida.");
      return false;
    }
    if (
      dados.topologia == "OTIMIZADOR" &&
      (dados.marcaOtimizador == null ||
        dados.marcaOtimizador.trim().length == 0)
    ) {
      setMessage("Por favor, preencha uma marca de otimizador válida");
      return false;
    }
    if (
      dados.topologia == "OTIMIZADOR" &&
      (dados.qtdeOtimizador == 0 || dados.qtdeOtimizador == null)
    ) {
      setMessage("Por favor, preencha uma quantidade de otimizador válida");
      return false;
    }
    if (
      dados.topologia == "OTIMIZADOR" &&
      (dados.potOtimizador == 0 || dados.potOtimizador == null)
    ) {
      setMessage("Por favor, preencha uma potência de otimizador válida");
      return false;
    }
    if (dados.marcaModulos.trim().length < 3) {
      setMessage("Por favor,preencha uma marca de módulos válida");
      return false;
    }
    if (dados.qtdeModulos == null || dados.qtdeModulos <= 0) {
      setMessage("Por favor, preencha uma quantidade módulos válida");
      return false;
    }
    if (dados.potModulos == null || dados.potModulos <= 0) {
      setMessage("Por favor, preencha uma potência de módulos válida");
      return false;
    }
    setMessage("");
    return true;
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
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  console.log(dados.marcaInversor);
  console.log(dados.qtdeInversor);
  console.log(dados.potInversor);
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS DO SISTEMA
      </span>
      <div className="flex justify-center">
        <SelectInput
          label={"TOPOLOGIA"}
          editable={true}
          value={dados.topologia}
          handleChange={(value) => setDados({ ...dados, topologia: value })}
          options={[
            {
              label: "MICRO-INVERSOR",
              value: "MICRO",
            },
            {
              label: "INVERSOR",
              value: "INVERSOR",
            },
            {
              label: "OTIMIZADOR",
              value: "OTIMIZADOR",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
        />
      </div>
      <div className="flex gap-2 justify-around items-center flex-wrap">
        {dados.topologia != "NÃO DEFINIDO" && (
          <>
            <TextInput
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
            <NumberInput
              label={"QTDE INVERSOR/MICRO"}
              editable={true}
              value={dadosInversores.qtde}
              handleChange={(value) =>
                setDadosInvesores({ ...dadosInversores, qtde: value })
              }
            />
            <NumberInput
              label={"POTÊNCIA INVERSOR/MICRO"}
              unit={"W"}
              editable={true}
              value={dadosInversores.pot}
              handleChange={(value) =>
                setDadosInvesores({ ...dadosInversores, pot: value })
              }
            />
            <div
              onClick={addInversor}
              className="bg-green-300 hover:bg-green-500 text-white flex justify-center items-center h-fit p-2 rounded cursor-pointer"
            >
              <MdOutlineAddCircle style={{ fontSize: "15px" }} />
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col mt-2 font-bold">
        <h1 className="text-center text-[#15599a] text-xs">
          INVERSORES ADICIONADOS
        </h1>
        {arrInv.map((inv, index) => (
          <div key={index} className="flex justify-around items-center my-1">
            <p className="text-xs font-bold">{inv.marca}</p>
            <p className="text-xs font-bold">{inv.qtde}</p>
            <p className="text-xs font-bold">{inv.pot}</p>
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
      {dados.topologia == "OTIMIZADOR" && (
        <div className="flex gap-2 justify-around flex-wrap mt-2">
          <TextInput
            label={"MARCA DO OTIMIZADOR"}
            editable={true}
            value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
            handleChange={(value) =>
              setDados({ ...dados, marcaOtimizador: value.toUpperCase() })
            }
          />
          <NumberInput
            label={"QTDE DO OTIMIZADOR"}
            editable={true}
            value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
            handleChange={(value) =>
              setDados({ ...dados, qtdeOtimizador: Number(value) })
            }
          />
          <NumberInput
            label={"POTÊNCIA DO OTIMIZADOR"}
            unit={"W"}
            editable={true}
            value={dados.potOtimizador ? dados.potOtimizador : null}
            handleChange={(value) =>
              setDados({ ...dados, potOtimizador: Number(value) })
            }
          />
        </div>
      )}
      <div className="flex gap-2 justify-around flex-wrap mt-2 pt-2 border-t border-gray-200 mx-2">
        <TextInput
          label={"MARCA DOS MÓDULOS"}
          editable={true}
          value={dados.marcaModulos}
          handleChange={(value) =>
            setDados({ ...dados, marcaModulos: value.toUpperCase() })
          }
        />
        <NumberInput
          label={"Nº DE MÓDULOS"}
          editable={true}
          value={dados.qtdeModulos}
          handleChange={(value) =>
            setDados({ ...dados, qtdeModulos: Number(value) })
          }
        />
        <NumberInput
          label={"POTÊNCIA DOS MÓDULOS"}
          unit={"W"}
          editable={true}
          value={dados.potModulos}
          handleChange={(value) =>
            setDados({ ...dados, potModulos: Number(value) })
          }
        />
      </div>
      {message && <p className="text-red-400 italic text-center">{message}</p>}
      <div className="flex w-full justify-center gap-2 flex-wrap mt-2">
        <button
          onClick={voltar}
          className="bg-[#15599a] rounded p-2 font-bold text-white"
        >
          VOLTAR
        </button>
        <button
          onClick={proximaEtapa}
          className="w-fit text-center p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold "
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormSolicitacaoQuatro;
