import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { AiFillSave } from "react-icons/ai";
function OSBlock({ ordem, index, emAberto, categoria, info, setOs, os }) {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [osCategoria, setCategoria] = useState(ordem.categoria);
  const [servicoExecutado, setServicoExecutado] = useState(
    ordem.servicoExecutado
  );
  const [dataDeFechamento, setDataDeFechamento] = useState(
    ordem.dataDeFechamento ? ordem.dataDeFechamento : null
  );
  function handleChange(id, index, fechamento) {
    axios
      .post(`/api/projects/update/${info._id}`, {
        [`ordensDeServico.${index}.categoria`]: osCategoria,
        [`ordensDeServico.${index}.servicoExecutado`]: servicoExecutado,
        [`ordensDeServico.${index}.dataDeFechamento`]: dataDeFechamento,
      })
      .then((res) =>
        setMsg({ text: "Alterações feitas", color: "text-green-500" })
      )
      .catch((err) =>
        setMsg({
          text: "Ocorreu um erro, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  return (
    <>
      <div
        className={`grid ${
          emAberto ? (ordem.dataDeFechamento != undefined ? "hidden" : "") : ""
        } ${
          !categoria.includes(ordem.categoria) ? "hidden" : ""
        } items-center grid-cols-3 xl:grid-cols-14 border-b border-gray-200 pb-2`}
      >
        <div className="flex col-span-2 flex-col items-center">
          <p className="text-xs uppercase text-gray-500">CATEGORIA DA OS</p>
          <select
            className="text-xs outline-none text-gray-600"
            value={osCategoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value={"PADRÃO"}>PADRÃO</option>
            <option value={"ESTRUTURA"}>ESTRUTURA</option>
            <option value={"MONTAGEM"}>MONTAGEM</option>
            <option value={"MANUTENÇÃO PREVENTIVA"}>
              MANUTENÇÃO PREVENTIVA
            </option>
            <option value={"MANUTENÇÃO CORRETIVA"}>MANUTENÇÃO CORRETIVA</option>
          </select>
        </div>
        <div className="hidden xl:flex col-span-2 flex-col items-center">
          <p className="text-center text-xs uppercase text-gray-500">
            SERVIÇO PARA EXECUÇÃO
          </p>
          <input
            className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
            value={servicoExecutado}
            onChange={(e) => setServicoExecutado(e.target.value)}
          />
        </div>
        <div className="flex-col col-span-2 items-center hidden xl:flex">
          <p className="text-xs uppercase text-gray-500">REALIZAR COBRANÇA?</p>
          <p className="text-xs uppercase">
            {ordem.realizarCobranca ? "SIM" : "NÃO"}
          </p>
        </div>
        <div className="flex-col col-span-2 items-center hidden xl:flex">
          <p className="text-xs uppercase text-gray-500">VALOR DA COBRANÇA</p>
          <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
        </div>
        <div className="flex-col col-span-2 items-center hidden xl:flex">
          <p className="text-xs uppercase text-gray-500">EMISSOR DA OS</p>
          <p className="text-center text-xs uppercase">
            {ordem.usuarioEmissor}
          </p>
        </div>
        <div className="hidden xl:flex flex-col col-span-2 items-center">
          <p className="text-xs uppercase text-gray-500">DATA DE FECHAMENTO</p>

          <input
            type="date"
            value={
              dataDeFechamento
                ? new Date(dataDeFechamento).toISOString().slice(0, 10)
                : null
            }
            onChange={(e) => {
              /*
            setOs((prevState) => {
              let temp = {
                ...prevState,
                ordensDeServico: [...prevState.ordensDeServico],
              };
              temp.ordensDeServico[index].dataDeFechamento = new Date(
                e.target.value
              ).toISOString();
              return temp;
            });
            handleChange(os._id, index, new Date(e.target.value).toISOString());*/
              setDataDeFechamento(new Date(e.target.value).toISOString());
            }}
            className="text-xxs font-bold outline-none bg-[#15599a] text-white p-1 rounded"
          />
        </div>
        <div className="flex col-span-1 items-center justify-center">
          <Link href={`/ordemDeServico/pdf/${info._id}?index=${index}`}>
            <button className="p-1 bg-[#fead61] font-bold rounded w-fit">
              VER
            </button>
          </Link>
        </div>
        <div className="hidden lg:flex col-span-1 items-center justify-center">
          <button
            onClick={() => handleChange(null, index, null)}
            className="flex text-xs gap-x-2 items-center bg-blue-400 hover:bg-[#15599a] hover:text-white font-bold p-1 rounded"
          >
            SALVAR
            <AiFillSave />
          </button>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center text-sm ${msg.color}`}>{msg.text}</p>
      )}
    </>
  );
}

export default OSBlock;
