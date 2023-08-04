import React from "react";
import { equipesTecnicas, statusObra } from "../../utils/constants";
import DateInput from "../DateInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";

function InfoObrasBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  project,
  showMaterialInfo = false,
  showDeliveryInfo = false,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        INFORMAÇÕES SOBRE A OBRA
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        <SelectInput
          label={"Laudo"}
          value={
            infoHolder.obra?.laudo ? infoHolder.obra?.laudo : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            { label: "EM ESTUDO", value: "EM ESTUDO" },
            { label: "EMITIDO", value: "EMITIDO" },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "obra.laudo": value,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                laudo: value,
              },
            });
          }}
        />
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            SOLICITAÇÃO DA OBRA
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={
                infoHolder.obra?.statusSolicitacao === "SOLICITADA"
                  ? true
                  : false
              }
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "obra.statusSolicitacao": e.target.checked
                    ? "SOLICITADA"
                    : "NÃO SOLICITADA",
                });
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    statusSolicitacao: e.target.checked
                      ? "SOLICITADA"
                      : "NÃO SOLICITADA",
                  },
                });
              }}
              type="checkbox"
              name="solicitacaoobra"
              id="solicitacaoobra"
            />
            <label className="ml-2" htmlFor="solicitacaoobra">
              {infoHolder.obra?.statusSolicitacao == "SOLICITADA"
                ? "SOLICITADA"
                : "NÃO SOLICITADA"}
            </label>
          </div>
        </div>
        {showDeliveryInfo ? (
          <>
            <TextInput
              label={"Status entrega dos equipamentos"}
              editable={false}
              value={
                infoHolder.compra.statusEntrega
                  ? infoHolder.compra.statusEntrega
                  : "-"
              }
            />
            <DateInput
              label={"PREVISÃO/ENTREGA DOS EQUIPAMENTOS"}
              editable={false}
              value={
                infoHolder.compra.previsaoEntrega != undefined &&
                infoHolder.compra.previsaoEntrega != "-"
                  ? new Date(infoHolder.compra.previsaoEntrega)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
            />
            <DateInput
              label={"ENTREGA DOS EQUIPAMENTOS"}
              editable={false}
              value={
                infoHolder.compra.dataEntrega != undefined &&
                infoHolder.compra.dataEntrega != "-"
                  ? new Date(infoHolder.compra.dataEntrega)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
            />
          </>
        ) : null}

        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            TRAFO
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.obra?.trafo === "SIM" ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "obra.trafo": e.target.checked ? "SIM" : "NÃO",
                });
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    trafo: e.target.checked ? "SIM" : "NÃO",
                  },
                });
              }}
              type="checkbox"
              name="trafo"
              id="trafo"
            />
            <label className="ml-2" htmlFor="trafo">
              APLICÁVEL ?
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center flex-wrap mt-2">
        <DateInput
          label={"ENTRADA NA OBRA"}
          editable={editor}
          value={
            infoHolder.obra?.entrada != undefined &&
            infoHolder.obra?.entrada != "-"
              ? new Date(infoHolder.obra?.entrada).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "obra.entrada": isNaN(value)
                ? new Date(value).toISOString()
                : null,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                entrada: isNaN(value) ? new Date(value).toISOString() : null,
              },
            });
          }}
        />
        <DateInput
          label={"SAIDA DE OBRA"}
          editable={editor}
          value={
            infoHolder.obra?.saida != undefined && infoHolder.obra?.saida != "-"
              ? new Date(infoHolder.obra?.saida).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "obra.saida": isNaN(value) ? new Date(value).toISOString() : null,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                saida: isNaN(value) ? new Date(value).toISOString() : null,
              },
            });
          }}
        />
        <SelectInput
          label={"EQUIPE RESPONSÁVEL"}
          editable={editor}
          value={
            infoHolder.obra?.equipeResp != undefined &&
            infoHolder.obra?.equipeResp != "-"
              ? infoHolder.obra?.equipeResp == "TERCEIROS" ||
                infoHolder.obra?.equipeResp == "TERCERIZADOS" ||
                infoHolder.obra?.equipeResp == "OUTROS"
                ? "OUTROS"
                : infoHolder.obra?.equipeResp
              : "NÃO DEFINIDO"
          }
          options={equipesTecnicas.map((equipe) => equipe)}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "obra.equipeResp": value,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                equipeResp: value,
              },
            });
          }}
        />
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            CHECKLIST OBRA
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.obra?.checklist === "SIM" ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "obra.checklist": e.target.checked ? "SIM" : "NÃO",
                });
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    checklist: e.target.checked ? "SIM" : "NÃO",
                  },
                });
              }}
              type="checkbox"
              name="checklistobra"
              id="checklistobra"
            />
            <label className="ml-2" htmlFor="checklistobra">
              SIM
            </label>
          </div>
        </div>
        <SelectInput
          label={"STATUS DA OBRA"}
          value={
            infoHolder.obra?.statusDaObra
              ? infoHolder.obra?.statusDaObra
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={statusObra.map((status) => status)}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "obra.statusDaObra": value,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                statusDaObra: value,
              },
            });
          }}
        />
      </div>
      <div className="flex flex-col w-full  lg:w-[450px] self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          OBSERVAÇÕES
        </span>
        <textarea
          readOnly={!editor}
          value={infoHolder.obra.observacoes ? infoHolder.obra.observacoes : ""}
          placeholder={"Observações da obra aqui..."}
          onChange={(e) => {
            setChanges({
              ...changes,
              "obra.observacoes": e.target.value,
            });
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                observacoes: e.target.value,
              },
            });
          }}
          className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
        />
      </div>
      {showMaterialInfo ? (
        <div className="w-full flex items-center justify-center gap-x-4">
          <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              INFORMAÇÕES DO KIT
            </span>
            <textarea
              readOnly={!editor}
              value={infoHolder.compra.kitInfo ? infoHolder.compra.kitInfo : ""}
              placeholder={"Observações do material aqui..."}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "compra.kitInfo": e.target.value,
                });
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    kitInfo: e.target.value,
                  },
                });
              }}
              className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
          <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              MATERIAL FALTANTE
            </span>
            <textarea
              readOnly={!editor}
              value={
                infoHolder.material.materialFaltante
                  ? infoHolder.material.materialFaltante
                  : ""
              }
              placeholder={"Observações do material aqui..."}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "material.materialFaltante": e.target.value,
                });
                setInfo({
                  ...infoHolder,
                  material: {
                    ...infoHolder.material,
                    materialFaltante: e.target.value,
                  },
                });
              }}
              className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default InfoObrasBlock;
