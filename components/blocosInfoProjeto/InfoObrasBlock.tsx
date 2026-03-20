import React, { type Dispatch, type SetStateAction } from "react";
import { equipesTecnicas, formatDate, statusObra } from "../../utils/constants";

import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { ServiceOrderStatus } from "@/utils/select-options";
import { HardHat } from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import ObservationsBlock from "../identificador/obras/ObservationsBlock";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Execution from "../identificador/registrosAlteracoesProjeto/secao/Execution";
import ProjectMissingMaterialInfo from "../identificador/suprimentos/MissingMaterialInfo";
import ProjectKitInfo from "../identificador/suprimentos/ProjectKitInfo";
import CheckboxInput from "../inputs/Checkbox";
import DateInput from "../inputs/Date";
import SelectInput from "../inputs/Select";
import { useEmployeesSimplified } from "@/utils/methods/query/users";
import MultipleSelectWithImages from "../inputs/MultipleSelectWithImages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type InfoObrasBlockProps = {
  editor: boolean;
  infoHolder: TProjectDTO;
  setInfo: Dispatch<SetStateAction<TProjectDTO>>;
  changes: { [key: string]: any };
  setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
  updateLogs: TProjectUpdateLogDTO[];
  project: TProjectDTO;
  showMaterialInfo: boolean;
  showDeliveryInfo: boolean;
};
function InfoObrasBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs = [],
  project,
  showMaterialInfo = false,
  showDeliveryInfo = false,
}: InfoObrasBlockProps) {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    error: employeesError,
  } = useEmployeesSimplified({});
  const responsiblesMissingValidation =
    infoHolder.obra.responsaveis?.filter((r) => !r.dataValidacao) || [];

  return (
    <div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
        <HardHat className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">
          INFORMAÇÕES SOBRE A OBRA
        </h1>
      </div>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<Execution logs={updateLogs} />} />
      {infoHolder.homologacao.vistoria.dataEfetivacao ? (
        <div className="flex items-center gap-1 self-center">
          <BsPatchCheckFill color="rgb(22,163,74)" />
          <p className="text-primary/60 text-xs tracking-tight">
            VISTORIA CONCLUÍDA EM{" "}
            {formatDateAsLocale(infoHolder.homologacao.vistoria.dataEfetivacao)}
          </p>
        </div>
      ) : null}
      <div className="my-4 flex w-full flex-col items-center justify-center gap-2 self-center px-2 lg:flex-row">
        <CheckboxInput
          labelFalse="OBRA SOLICITADA"
          labelTrue="OBRA SOLICITADA"
          checked={infoHolder.obra.statusSolicitacao === "SOLICITADA"}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              obra: {
                ...prev.obra,
                statusSolicitacao: value ? "SOLICITADA" : "NÃO SOLICITADA",
              },
            }));
            setChanges((prev) => ({
              ...prev,
              "obra.statusSolicitacao": value ? "SOLICITADA" : "NÃO SOLICITADA",
            }));
          }}
        />

        <CheckboxInput
          labelFalse="CHECKLIST DE OBRA PRONTO"
          labelTrue="CHECKLIST DE OBRA PRONTO"
          checked={infoHolder.obra.checklist === "SIM"}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              obra: {
                ...prev.obra,
                checklist: value ? "SIM" : "NÃO",
              },
            }));
            setChanges((prev) => ({
              ...prev,
              "obra.checklist": value ? "SIM" : "NÃO",
            }));
          }}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-2 px-2">
        <MultipleSelectWithImages
          label="RESPONSÁVEIS"
          selected={infoHolder.obra.responsaveis?.map((responsible) => responsible.id) || []}
          options={
            employees?.map((employee) => ({
              id: employee._id,
              label: employee.nome,
              value: employee._id,
            })) || []
          }
          handleChange={(value) => {
            const selectedResponsibles: TProjectDTO["obra"]["responsaveis"] =
              employees
                ?.filter((employee) => value.includes(employee._id))
                .map((employee) => ({
                  id: employee._id,
                  nome: employee.nome,
                  avatar_url: employee.avatar_url,
                  telefone: employee.telefone,
                  email: employee.email,
                })) || [];
            setInfo((prev) => ({
              ...prev,
              obra: {
                ...prev.obra,
                responsaveis: selectedResponsibles,
              },
            }));
            setChanges((prev) => ({
              ...prev,
              "obra.responsaveis": selectedResponsibles,
            }));
          }}
          onReset={() => {
            setInfo((prev) => ({
              ...prev,
              obra: {
                ...prev.obra,
                responsaveis: [],
              },
            }));
            setChanges((prev) => ({
              ...prev,
              "obra.responsaveis": [],
            }));
          }}
          resetOptionLabel="NÃO DEFINIDO"
          width="100%"
        />
        {responsiblesMissingValidation.length > 0 ? (
          <div className="w-full flex items-center flex flex-col lg:flex-row gap-2">
            <h3 className="text-primary/60 text-xs font-medium">
              RESPONSÁVEIS COM CONFIRMAÇÃO PENDENTE
            </h3>
            <div className="flex items-center flex-wrap gap-1.5">
              {responsiblesMissingValidation.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-100 text-red-500"
                >
                  <Avatar className="w-6 h-6 min-w-6 min-h-6">
                    <AvatarImage src={r.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {formatNameAsInitials(r.nome)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <DateInput
            label={"DATA DE ENTRADA NA OBRA"}
            editable={editor}
            value={infoHolder.obra.entrada ? formatDate(infoHolder.obra.entrada) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "obra.entrada": formatDateInputChange(value),
              }));
              setInfo((prev) => ({
                ...prev,
                obra: {
                  ...prev.obra,
                  entrada: formatDateInputChange(value) as string | null,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label={"DATA DE SAÍDA DA OBRA"}
            editable={editor}
            value={infoHolder.obra.saida ? formatDate(infoHolder.obra.saida) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "obra.saida": formatDateInputChange(value),
              }));
              setInfo((prev) => ({
                ...prev,
                obra: {
                  ...prev.obra,
                  saida: formatDateInputChange(value) as string | null,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label={"STATUS DA OBRA"}
            value={infoHolder.obra?.statusDaObra}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={ServiceOrderStatus}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "obra.statusDaObra": value,
              }));
              setInfo((prev) => ({
                ...prev,
                obra: {
                  ...prev.obra,
                  statusDaObra: value,
                },
              }));
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                "obra.statusDaObra": null,
              }));
              setInfo((prev) => ({
                ...prev,
                obra: {
                  ...prev.obra,
                  statusDaObra: null,
                },
              }));
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="my-4 w-full self-center px-2 lg:w-[80%]">
        <ObservationsBlock
          infoHolder={infoHolder}
          setInfo={setInfo}
          changes={changes}
          setChanges={setChanges}
        />
      </div>
      {showDeliveryInfo ? (
        <DeliveryInformation
          editor={editor}
          infoHolder={infoHolder}
          setInfo={setInfo}
          changes={changes}
          setChanges={setChanges}
        />
      ) : null}
      {showMaterialInfo ? (
        <MaterialInformation
          editor={editor}
          infoHolder={infoHolder}
          setInfo={setInfo}
          changes={changes}
          setChanges={setChanges}
        />
      ) : null}
    </div>
  );
}

export default InfoObrasBlock;

type DeliveryInformationProps = {
  editor: boolean;
  infoHolder: TProjectDTO;
  setInfo: Dispatch<SetStateAction<TProjectDTO>>;
  changes: { [key: string]: any };
  setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function DeliveryInformation({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}: DeliveryInformationProps) {
  return (
    <>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">ENTREGA</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <DateInput
            label={"DATA DE PREVISÃO DE ENTREGA"}
            editable={editor}
            value={
              infoHolder.compra.previsaoEntrega
                ? formatDate(infoHolder.compra.previsaoEntrega)
                : undefined
            }
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "compra.previsaoEntrega": formatDateInputChange(value),
              }));
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  previsaoEntrega: formatDateInputChange(value) as string | null,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label={"DATA DE ENTREGA"}
            editable={editor}
            value={
              infoHolder.compra.dataEntrega ? formatDate(infoHolder.compra.dataEntrega) : undefined
            }
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "compra.dataEntrega": formatDateInputChange(value),
              }));
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataEntrega: formatDateInputChange(value) as string | null,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={"STATUS DA ENTREGA"}
            editable={editor}
            value={infoHolder.compra?.statusEntrega || "NÃO DEFINIDO"}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: "AGUARDANDO COMPRA", value: "AGUARDANDO COMPRA" },
              { id: 2, label: "EM ROTA", value: "EM ROTA" },
              { id: 3, label: "ENTREGUE", value: "ENTREGUE" },
              { id: 4, label: "CANCELADO", value: "CANCELADO" },
              { id: 5, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "compra.statusEntrega": value,
              }));
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  statusEntrega: value,
                },
              }));
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                "compra.statusEntrega": undefined,
              }));
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  statusEntrega: undefined,
                },
              }));
            }}
            width="100%"
          />
        </div>
      </div>
    </>
  );
}

type MaterialInformationProps = {
  editor: boolean;
  infoHolder: TProjectDTO;
  setInfo: Dispatch<SetStateAction<TProjectDTO>>;
  changes: { [key: string]: any };
  setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function MaterialInformation({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}: MaterialInformationProps) {
  return (
    <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-x-4">
      <div className="w-[450px]">
        <ProjectKitInfo infoHolder={infoHolder} setInfoHolder={setInfo} setChanges={setChanges} />
      </div>
      <div className="w-[450px]">
        <ProjectMissingMaterialInfo
          infoHolder={infoHolder}
          setInfoHolder={setInfo}
          setChanges={setChanges}
        />
      </div>
    </div>
  );
}
