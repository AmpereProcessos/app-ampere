import React, { useState } from "react";
import axios from "axios";
function ComissionamentoCard({ info, credentials, getProjects }) {
  const [infoHolder, setInfo] = useState(info);
  const [msg, setMsg] = useState("");
  const [changes, setChanges] = useState({});
  const editor = true;
  async function handleChanges() {
    axios.post(`/api/projects/update/${info._id}`, changes).then((res) => {
      setMsg("Alterações concluidas");
      getProjects();
    });
  }
  return (
    <div className="flex flex-col w-full border border-gray-200 p-2">
      <p className="font-bold font-raleway border-b pb-1 border-gray-200">
        {infoHolder.qtde} - {infoHolder.nomeDoContrato}
      </p>
      <div className="flex gap-2 mt-2 justify-center flex-wrap">
        <div className="flex flex-col w-[150px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            COMISSIONAMENTO COMERCIAL
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.comercial ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "comissionamento.comercial": e.target.checked,
                });
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    comercial: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="comissionamentoComercial"
              id="comissionamentoComercial"
            />
            <label className="ml-2" htmlFor="comissionamentoComercial">
              OK
            </label>
          </div>
        </div>
        <div className="flex flex-col w-[150px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            COMISSIONAMENTO DE SUPRIMENTOS
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.suprimentos ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "comissionamento.suprimentos": e.target.checked,
                });
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    suprimentos: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="comissionamentoSuprimentos"
              id="comissionamentoSuprimentos"
            />
            <label className="ml-2" htmlFor="comissionamentoSuprimentos">
              OK
            </label>
          </div>
        </div>
        <div className="flex flex-col w-[150px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            COMISSIONAMENTO PROJETOS
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.projetos ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "comissionamento.projetos": e.target.checked,
                });
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    projetos: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="comissionamentoProjetos"
              id="comissionamentoProjetos"
            />
            <label className="ml-2" htmlFor="comissionamentoProjetos">
              OK
            </label>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-2">
        {msg && <p className="mt-1 text-center text-green-400">{msg}</p>}
        <button
          onClick={handleChanges}
          className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
        >
          SALVAR
        </button>
      </div>
    </div>
  );
}

export default ComissionamentoCard;
