import React, { useState } from "react";

function PosVendaCard({ project }) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  return (
    <div className="w-full cursor-pointer border border-gray-200 p-3 hover:bg-blue-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <p className="text-gray-700">{infoHolder.nomedocontrato}</p>
        <div className="flex items-center grow justify-between px-12">
          <div>
            <span className="text-xxs">STATUS DO PARECER</span>
            <p className="text-xs text-gray-600">
              {infoHolder.statusobra ? infoHolder.statusobra : "-"}
            </p>
          </div>
          <div>
            <span className="text-xxs">STATUS DA COMPRA</span>
            <p className="text-xs text-center text-gray-600">
              {infoHolder.laudo ? infoHolder.laudo : "-"}
            </p>
          </div>
          <div>
            <span className="text-xxs">PREV. ENTREGA</span>
            <p className="text-xs text-gray-600 text-center">
              {infoHolder.documentacaoassinada
                ? infoHolder.documentacaoassinada
                : "-"}
            </p>
          </div>
          <div>
            <span className="text-xxs">PREV. OBRA</span>
            <p className="text-xs text-gray-600 text-center">
              {infoHolder.documentacaoassinada
                ? infoHolder.documentacaoassinada
                : "-"}
            </p>
          </div>
        </div>
        <p className="text-[#15599a]">#{infoHolder.qtde}</p>
      </div>
      <div className="mt-1">
        <h1 className="text-gray-700">JORNADA</h1>
        <div className="flex items-center flex-wrap justify-around w-full">
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
          <div className="w-[150px]">
            <input
              checked={infoHolder.jornada?.boasVindas ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
                setInfo({
                  ...infoHolder,
                  jornada: {
                    ...infoHolder.jornada,
                    boasVindas: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              BOAS VINDAS
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PosVendaCard;
