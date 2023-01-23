import axios from "axios";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
function VendedorMetaCard({ vendedor, ano, getVendedoresInfo }) {
  const [infoHolder, setInfoHolder] = useState(vendedor);
  const [opConcluded, setOpConcluded] = useState(false);
  function handleChanges(id) {
    axios
      .put(`/api/stats/gestaoTimeVendas?id=${id}`, {
        year: ano,
        goalArr: infoHolder[ano],
      })
      .then((res) => {
        getVendedoresInfo();
        setOpConcluded(true);
        setTimeout(() => {
          setOpConcluded(false);
        }, 1500);
      });
  }
  return (
    <div
      className={`grid grid-cols-14 ${
        opConcluded ? "bg-green-300" : "bg-[#fff]"
      } items-center border border-gray-200 w-full`}
    >
      <div
        className={`p-1 font-bold flex items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        {infoHolder.nome}
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][0] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[0] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][1] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[1] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][2] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[2] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][3] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[3] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][4] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[4] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][5] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[5] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][6] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[6] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][7] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[7] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][8] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[8] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][9] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[9] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][10] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[10] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <input
          value={infoHolder[ano] ? infoHolder[ano][11] : 0}
          onChange={(e) => {
            var arr = infoHolder[ano]
              ? infoHolder[ano]
              : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            arr[11] = Number(e.target.value);
            setInfoHolder({ ...infoHolder, [ano]: [...arr] });
          }}
          type={"number"}
          className="w-full h-full outline-none text-center bg-transparent"
        />
      </div>
      <div
        className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
      >
        <button
          onClick={() => handleChanges(infoHolder._id)}
          className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
        >
          SALVAR <FaSave />
        </button>
      </div>
    </div>
  );
}

export default VendedorMetaCard;
