import React, { type Dispatch, type SetStateAction } from "react";

import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectComissionedUser, TProjectDTO } from "@/utils/schemas/projects";
import { Percent } from "lucide-react";
import { FileSignature } from "lucide-react";
import { contractStatus } from "../../utils/select-options";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Contract from "../identificador/registrosAlteracoesProjeto/secao/Contract";
import CheckboxWithDate from "../inputs/CheckboxWithDate";
import DateInput from "../inputs/Date";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import ComissionedUsersSpreadsheet from "../identificador/comissoes/ComissionedUsersSpreadsheet";
import { InfoBlockSection } from "./Utils/SectionBlock";

type InfoContratoBlockProps = {
  editor: boolean;
  infoHolder: TProjectDTO;
  setInfo: Dispatch<SetStateAction<TProjectDTO>>;
  changes: { [key: string]: any };
  setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
  project: TProjectDTO;
  updateLogs: TProjectUpdateLogDTO[];
  showPaymentInfo?: boolean;
};
function InfoContratoBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs = [],
  showPaymentInfo = false,
}: InfoContratoBlockProps) {
  function applyComissionados(updater: (current: TProjectComissionedUser[]) => TProjectComissionedUser[]) {
    setInfo((prev) => {
      const next = updater(prev.comissoes?.comissionados ?? []);
      setChanges((changesPrev) => ({
        ...changesPrev,
        "comissoes.comissionados": next,
      }));
      return {
        ...prev,
        comissoes: {
          ...(prev.comissoes || {}),
          comissionados: next,
        },
      };
    });
  }
  return (
    <div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
        <FileSignature className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">
          INFORMAÇÕES DO CONTRATO
        </h1>
      </div>
      <div className="w-full flex flex-col gap-2 px-2">
        <UpdateLogsBlock logs={updateLogs} SectionElement={<Contract logs={updateLogs} />} />
        <div className="flex w-full items-center justify-center">
          <div className="w-full lg:w-1/2">
            <SelectInput
              editable={editor}
              label="FORMA DE ASSINATURA"
              options={[
                { id: 1, label: "FISICO", value: "FISICO" },
                { id: 2, label: "DIGITAL", value: "DIGITAL" },
                { id: 3, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              value={infoHolder.contrato.formaAssinatura}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: { ...prev.contrato, formaAssinatura: value },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.formaAssinatura": value,
                }));
              }}
              onReset={() => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: { ...prev.contrato, formaAssinatura: "NÃO DEFINIDO" },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.formaAssinatura": "NÃO DEFINIDO",
                }));
              }}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <SelectInput
              editable={editor}
              label="STATUS DO CONTRATO"
              options={contractStatus}
              value={infoHolder.contrato.status}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: { ...prev.contrato, status: value },
                }));
                setChanges((prev) => ({ ...prev, "contrato.status": value }));
              }}
              onReset={() => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: { ...prev.contrato, status: "NÃO DEFINIDO" },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.status": "NÃO DEFINIDO",
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <DateInput
              label="DATA DE SOLICITAÇÃO"
              value={
                infoHolder.contrato.dataSolicitacao
                  ? formatDate(infoHolder.contrato.dataSolicitacao)
                  : undefined
              }
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: {
                    ...prev.contrato,
                    dataSolicitacao: formatDateInputChange(value, "string"),
                  },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.dataSolicitacao": formatDateInputChange(value),
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <DateInput
              label="DATA DE LIBERAÇÃO"
              value={
                infoHolder.contrato.dataLiberacao
                  ? formatDate(infoHolder.contrato.dataLiberacao)
                  : undefined
              }
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: {
                    ...prev.contrato,
                    dataLiberacao: formatDateInputChange(value, "string"),
                  },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.dataLiberacao": formatDateInputChange(value),
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <DateInput
              label="DATA DE ASSINATURA"
              value={
                infoHolder.contrato.dataAssinatura
                  ? formatDate(infoHolder.contrato.dataAssinatura)
                  : undefined
              }
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  contrato: {
                    ...prev.contrato,
                    dataAssinatura: formatDateInputChange(value, "string"),
                  },
                }));
                setChanges((prev) => ({
                  ...prev,
                  "contrato.dataAssinatura": formatDateInputChange(value),
                }));
              }}
              width="100%"
            />
          </div>
        </div>
        {showPaymentInfo ? (
          <InfoBlockSection
            headerTitle="COMISSIONAMENTO"
            headerIcon={<Percent className="h-4 w-4 min-h-4 min-w-4" />}
          >
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <DateInput
                  label="DATA DE REFERÊNCIA PARA COMISSÃO"
                  value={
                    infoHolder.comissoes?.dataReferencia
                      ? formatDate(infoHolder.comissoes?.dataReferencia)
                      : undefined
                  }
                  handleChange={(value) => {
                    setInfo((prev) => ({
                      ...prev,
                      comissoes: {
                        ...(prev.comissoes || {}),
                        dataReferencia: formatDateInputChange(value, "string"),
                      },
                    }));
                    setChanges((prev) => ({
                      ...prev,
                      "comissoes.dataReferencia": formatDateInputChange(value, "string"),
                    }));
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label="VALOR COMISSIONÁVEL"
                  placeholder="Preencha o valor comissionável..."
                  editable={editor}
                  value={infoHolder.comissoes?.valorComissionavel || null}
                  handleChange={(value) => {
                    setInfo((prev) => ({
                      ...prev,
                      comissoes: {
                        ...(prev.comissoes || {}),
                        valorComissionavel: value,
                      },
                    }));
                    setChanges((prev) => ({
                      ...prev,
                      "comissoes.valorComissionavel": value,
                    }));
                  }}
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm leading-none font-medium tracking-tight">COMISSIONADOS</p>
              <ComissionedUsersSpreadsheet
                comissioned={infoHolder.comissoes?.comissionados ?? []}
                comissionableValue={infoHolder.comissoes?.valorComissionavel || 0}
                editable={editor}
                onAdd={(row) => applyComissionados((current) => [...current, row])}
                onUpdate={(index, changes) =>
                  applyComissionados((current) =>
                    current.map((row, i) => (i === index ? { ...row, ...changes } : row)),
                  )
                }
                onRemove={(index) => applyComissionados((current) => current.filter((_, i) => i !== index))}
              />
            </div>
          </InfoBlockSection>
        ) : null}

        <div className="flex w-full items-center justify-center">
          <div className="w-fit">
            <CheckboxWithDate
              labelFalse="PROCESSO COMERCIAL CONCLUÍDO"
              labelTrue="PROCESSO COMERCIAL CONCLUÍDO"
              date={
                infoHolder.dataValidacaoComercial
                  ? new Date(infoHolder.dataValidacaoComercial)
                  : null
              }
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, dataValidacaoComercial: value }));
                setChanges((prev) => ({
                  ...prev,
                  dataValidacaoComercial: value,
                }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoContratoBlock;
