import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiDeleteBack2Line } from "react-icons/ri";
import NumberFloatingInput from "../NumberFloatingInput";
import NumberInput from "../NumberInput";
import SelectFoatingInput from "../SelectFloatingInput";
import SelectInput from "../SelectInput";

function InfoMaterialBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showCircuitBreakers,
  circuitBreakerAddition,
}) {
  const [circuitBreakersArr, setCircuitBreakersArr] = useState(
    infoHolder.material?.disjuntores ? infoHolder.material.disjuntores : null
  );
  const [circuitBreakerInfo, setCircuitBreakerInfo] = useState({
    tipo: "NÃO DEFINIDO",
    corrente: 0,
    qtde: 0,
  });
  function addCircuitBreaker() {
    let arr = circuitBreakersArr ? circuitBreakersArr : [];
    arr.push(circuitBreakerInfo);
    setCircuitBreakerInfo({
      tipo: "NÃO DEFINIDO",
      corrente: 0,
      qtde: 0,
    });
    setInfo({
      ...infoHolder,
      material: {
        ...infoHolder.material,
        disjuntores: arr,
      },
    });
    setChanges({ ...changes, "material.disjuntores": arr });
    setCircuitBreakersArr([...arr]);
  }
  function deleteCircuitBreaker(index) {
    let arr = circuitBreakersArr ? circuitBreakersArr : [];
    arr.splice(index, 1);
    setInfo({
      ...infoHolder,
      material: {
        ...infoHolder.material,
        disjuntores: arr,
      },
    });
    setChanges({ ...changes, "material.disjuntores": arr });
    setCircuitBreakersArr(arr);
  }
  console.log(infoHolder);
  console.log(changes);
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg w-full">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        MATERIAL
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        {infoHolder.material?.formularioId && (
          <Link
            href={`/almoxarifado/pdfFormulario/${infoHolder.material.formularioId}?backTo=adm`}
          >
            <a className="cursor-pointer bg-[#15599a] text-white items-center justify-center p-2 rounded font-bold">
              VER SOLICITAÇÃO
            </a>
          </Link>
        )}
        <SelectInput
          label={"Separação do material"}
          value={
            infoHolder.material?.statusSeparacao
              ? infoHolder.material?.statusSeparacao
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            {
              label: "INICIAR SEPARAÇÃO",
              value: "INICIAR SEPARAÇÃO",
            },
            {
              label: "SEPARADO",
              value: "SEPARADO",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.statusSeparacao": value,
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                statusSeparacao: value,
              },
            });
          }}
        />
        <NumberInput
          tag={"R$"}
          label={"Previsão de custos em insumos"}
          editable={editor}
          value={
            infoHolder.material?.previsaoCustos != undefined &&
            infoHolder.material?.previsaoCustos != "#VALUE!"
              ? infoHolder.material?.previsaoCustos.toFixed(2)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.previsaoCustos": Number(value),
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                previsaoCustos: Number(value),
              },
            });
          }}
        />
        <NumberInput
          tag={"R$"}
          label={"Custos em insumos"}
          editable={editor}
          value={
            infoHolder.material?.efetivoCustos != undefined &&
            infoHolder.material?.efetivoCustos != "#VALUE!"
              ? infoHolder.material?.efetivoCustos
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.efetivoCustos": Number(value),
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                efetivoCustos: Number(value),
              },
            });
          }}
        />
      </div>
      {showCircuitBreakers ? (
        <div className="flex flex-col w-full">
          <h1 className="text-center font-bold text-[#15599a]">DISJUNTORES</h1>
          {circuitBreakerAddition ? (
            <div className="grid grid-cols-7 px-2 gap-2 mt-4">
              <div className="col-span-2">
                <SelectFoatingInput
                  label={"TIPO"}
                  editable={true}
                  width={"100%"}
                  value={circuitBreakerInfo.tipo}
                  options={[
                    { label: "NÃO DEFINIDO", color: "NÃO DEFINIDO" },
                    { label: "MONOFÁSICO", color: "MONOFÁSICO" },
                    { label: "BIFÁSICO", color: "BIFÁSICO" },
                    { label: "TRIFÁSICO", color: "TRIFÁSICO" },
                  ]}
                  handleChange={(value) =>
                    setCircuitBreakerInfo({
                      ...circuitBreakerInfo,
                      tipo: value,
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <NumberFloatingInput
                  label={"CORRENTE"}
                  editable={true}
                  width={"100%"}
                  value={circuitBreakerInfo.corrente}
                  handleChange={(value) =>
                    setCircuitBreakerInfo({
                      ...circuitBreakerInfo,
                      corrente: Number(value),
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <NumberFloatingInput
                  label={"QTDE"}
                  editable={true}
                  width={"100%"}
                  value={circuitBreakerInfo.qtde}
                  handleChange={(value) =>
                    setCircuitBreakerInfo({
                      ...circuitBreakerInfo,
                      qtde: Number(value),
                    })
                  }
                />
              </div>
              <div className="flex flex-col items-center justify-center col-span-1">
                <div
                  onClick={addCircuitBreaker}
                  className="bg-green-300 hover:bg-green-500 text-white p-1 rounded cursor-pointer"
                >
                  <MdOutlineAddCircle style={{ fontSize: "15px" }} />
                </div>
              </div>
            </div>
          ) : null}

          {circuitBreakersArr && circuitBreakersArr.length > 0 ? (
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-7 px-2 gap-2 mt-4">
                <h1 className="text-center font-semibold text-[#fead61] col-span-2">
                  TIPO
                </h1>
                <h1 className="text-center font-semibold text-[#fead61] col-span-2">
                  CORRENTE
                </h1>
                <h1 className="text-center font-semibold text-[#fead61] col-span-2">
                  QTDE
                </h1>
                <h1 className="text-center font-semibold text-[#fead61] col-span-1">
                  AÇÕES
                </h1>
              </div>
              {circuitBreakersArr?.map((circuitBreaker, index) => (
                <div key={index} className="grid grid-cols-7 px-2 gap-2 mt-4">
                  <h1 className="text-center font-semibold text-gray-500 col-span-2">
                    {circuitBreaker.tipo}
                  </h1>
                  <h1 className="text-center font-semibold text-gray-500 col-span-2">
                    {circuitBreaker.corrente}A
                  </h1>
                  <h1 className="text-center font-semibold text-gray-500 col-span-2">
                    {circuitBreaker.qtde} UN
                  </h1>
                  <div className="flex flex-col items-center justify-center col-span-1">
                    {circuitBreakerAddition ? (
                      <div
                        onClick={() => deleteCircuitBreaker(index)}
                        className="bg-red-300 hover:bg-red-500 text-black p-1 rounded cursor-pointer"
                      >
                        <RiDeleteBack2Line style={{ fontSize: "15px" }} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">-</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic text-sm">
              Sem disjuntores adicionados...
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default InfoMaterialBlock;
