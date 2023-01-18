import React, { useState } from "react";

function ConferenciaPadraoOS({ conferencias }) {
  const [infoHolder, setInfo] = useState({
    realimentacaoFeita: conferencias?.realimentacaoFeita,
    ramalPassado: conferencias?.ramalPassado,
  });
  const [images, setImages] = useState({});
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center text-bold text-[#15599a]">
        CONFERÊNCIA DE FECHAMENTO
      </h1>
      <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
        <input
          checked={infoHolder.realimentacaoFeita}
          onChange={(e) =>
            setInfo({ ...infoHolder, realimentacaoFeita: e.target.checked })
          }
          id="bordered-checkbox-2"
          type="checkbox"
          value=""
          name="bordered-checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="bordered-checkbox-2"
          className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Realimentação feita ?
        </label>
      </div>
    </div>
  );
}

export default ConferenciaPadraoOS;
