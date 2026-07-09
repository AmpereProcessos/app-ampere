import dayjs from "dayjs";
import React, { useState, type Dispatch, type SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { formatDate, formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectComissionedUser, TProjectDTO } from "@/utils/schemas/projects";
import { BadgeCheck, BadgeDollarSign, Pencil, Percent } from "lucide-react";
import { FileSignature } from "lucide-react";
import { FaPercent } from "react-icons/fa";
import { contractStatus } from "../../utils/select-options";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Contract from "../identificador/registrosAlteracoesProjeto/secao/Contract";
import CheckboxInput from "../inputs/Checkbox";
import CheckboxWithDate from "../inputs/CheckboxWithDate";
import DateInput from "../inputs/Date";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import ResponsiveDialogDrawer from "../utils/ResponsiveDialogDrawer";
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
  function updateComissionedUser({
    index,
    changes,
  }: {
    index: number;
    changes: Partial<TProjectComissionedUser>;
  }) {
    setInfo((prev) => ({
      ...prev,
      comissoes: {
        ...(prev.comissoes || {}),
        comissionados: prev.comissoes?.comissionados?.map((comissionedUser, i) =>
          i === index ? { ...comissionedUser, ...changes } : comissionedUser,
        ),
      },
    }));
    setChanges((prev) => ({
      ...prev,
      "comissoes.comissionados": infoHolder.comissoes?.comissionados?.map((comissionedUser, i) =>
        i === index ? { ...comissionedUser, ...changes } : comissionedUser,
      ),
    }));
  }
  function removeComissionedUser(index: number) {
    setInfo((prev) => ({
      ...prev,
      comissoes: {
        ...(prev.comissoes || {}),
        comissionados: prev.comissoes?.comissionados?.filter((_, i) => i !== index),
      },
    }));
    setChanges((prev) => ({
      ...prev,
      "comissoes.comissionados": infoHolder.comissoes?.comissionados?.filter((_, i) => i !== index),
    }));
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
              {infoHolder.comissoes?.comissionados &&
              infoHolder.comissoes?.comissionados.length > 0 ? (
                infoHolder.comissoes?.comissionados.map((comissionedUser, index) => (
                  <ComissionableUsersCard
                    key={`${comissionedUser.idCrm}-${index}`}
                    comissionedUser={comissionedUser}
                    comissionableValue={infoHolder.comissoes?.valorComissionavel || 0}
                    updateComissionedUser={(changes) => updateComissionedUser({ index, changes })}
                    removeComissionedUser={() => removeComissionedUser(index)}
                  />
                ))
              ) : (
                <h1 className="text-foreground w-full py-1 text-center text-sm italic">
                  Nenhum comissionado cadastrado...
                </h1>
              )}
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

type ComissionableUsersCardProps = {
  comissionedUser: TProjectComissionedUser;
  comissionableValue: number;
  updateComissionedUser: (changes: Partial<TProjectComissionedUser>) => void;
  removeComissionedUser: () => void;
};
function ComissionableUsersCard({
  comissionedUser,
  comissionableValue,
  updateComissionedUser,
  removeComissionedUser,
}: ComissionableUsersCardProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 min-h-5 w-5 min-w-5">
            <AvatarImage src={comissionedUser.avatar_url || undefined} alt={comissionedUser.nome} />
            <AvatarFallback>{formatNameAsInitials(comissionedUser.nome || "NA")}</AvatarFallback>
          </Avatar>
          <p className="text-sm leading-none font-bold tracking-tight">{comissionedUser.nome}</p>
          <Button
            size="fit"
            variant="ghost"
            className="flex items-center gap-1.5 px-2 py-1 text-xs"
            onClick={() => setEditMenuIsOpen(true)}
          >
            <Pencil className="h-4 w-4 min-h-4 min-w-4" />
            <p>EDITAR</p>
          </Button>
        </div>
        <div className="flex grow flex-wrap items-center justify-start gap-2">
          <div className="bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic">
            <BadgeDollarSign className={cn("h-3 min-h-3 w-3 min-w-3")} />
            <p className="text-[0.57rem] font-black">
              {formatToMoney(
                comissionedUser.valor || (comissionedUser.porcentagem * comissionableValue) / 100,
              )}
            </p>
          </div>
          <div className="bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic">
            <FaPercent className={cn("h-3 min-h-3 w-3 min-w-3")} />
            <p className="text-[0.57rem] font-black">
              {formatDecimalPlaces(comissionedUser.porcentagem)}%
            </p>
          </div>
          <div
            className={cn(
              "bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic",
              {
                "bg-orange-100 text-orange-700": !comissionedUser.dataEfetivacao,
                "bg-green-100 text-green-700": comissionedUser.dataEfetivacao,
              },
            )}
          >
            <BadgeCheck className={cn("h-3 min-h-3 w-3 min-w-3")} />
            <p className={cn("text-[0.57rem] font-medium")}>
              {comissionedUser.dataEfetivacao ? "COMISSÕES EFETIVADAS" : "VALORES NÃO EFETIVADOS"}
            </p>
          </div>
          <div
            className={cn(
              "bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic",
              {
                "bg-orange-100 text-orange-700": !comissionedUser.dataPagamento,
                "bg-green-100 text-green-700": comissionedUser.dataPagamento,
              },
            )}
          >
            <BadgeDollarSign className={cn("h-3 min-h-3 w-3 min-w-3")} />
            <p className={cn("text-[0.57rem] font-medium")}>
              {comissionedUser.dataPagamento
                ? "PAGAMENTO DE COMISSÕES REALIZADO"
                : "PAGAMENTO DE COMISSÕES NÃO REALIZADO"}
            </p>
          </div>
          <div
            className={cn(
              "bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic",
              {
                "bg-orange-100 text-orange-700": !comissionedUser.dataValidacao,
                "bg-green-100 text-green-700": comissionedUser.dataValidacao,
              },
            )}
          >
            <BadgeCheck className={cn("h-3 min-h-3 w-3 min-w-3")} />
            <p className={cn("text-[0.57rem] font-medium")}>
              {comissionedUser.dataValidacao ? "VALIDAÇÕES RELIZADAS" : "VALIDAÇÕES PENDENTES"}
            </p>
          </div>
        </div>
      </div>
      {editMenuIsOpen ? (
        <EditComissionedUserMenu
          comissionedUser={comissionedUser}
          comissionableValue={comissionableValue}
          updateComissionedUser={(changes) => {
            updateComissionedUser(changes);
            setEditMenuIsOpen(false);
          }}
          removeComissionedUser={removeComissionedUser}
          closeMenu={() => setEditMenuIsOpen(false)}
        />
      ) : null}
    </div>
  );
}

type EditComissionedUserMenuProps = {
  comissionedUser: TProjectComissionedUser;
  comissionableValue: number;
  updateComissionedUser: (changes: Partial<TProjectComissionedUser>) => void;
  removeComissionedUser: () => void;
  closeMenu: () => void;
};
function EditComissionedUserMenu({
  comissionedUser,
  comissionableValue,
  updateComissionedUser,
  removeComissionedUser,
  closeMenu,
}: EditComissionedUserMenuProps) {
  const [stateHolder, setStateHolder] = useState<TProjectComissionedUser>(comissionedUser);

  function updateStateHolder(changes: Partial<TProjectComissionedUser>) {
    setStateHolder((prev) => ({ ...prev, ...changes }));
  }
  return (
    <ResponsiveDialogDrawer
      menuTitle="EDITAR COMISSIONADO"
      menuDescription="Edite as informações do comissionado."
      menuActionButtonText="ATUALIZAR COMISSIONADO"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => updateComissionedUser(stateHolder)}
      actionIsPending={false}
      stateIsLoading={false}
      closeMenu={closeMenu}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-[0.6rem] font-bold tracking-tighter">COMISSÃO DO VENDEDOR:</h1>
          <Avatar className="h-5 w-5">
            <AvatarImage src={stateHolder.avatar_url || undefined} alt={stateHolder.nome} />
            <AvatarFallback>{formatNameAsInitials(stateHolder.nome || "")}</AvatarFallback>
          </Avatar>
          <h1 className="text-[0.6rem] font-bold tracking-tighter">{stateHolder.nome}</h1>
        </div>
        <div
          className={cn(
            "bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic",
            {
              "bg-orange-100 text-orange-700": !stateHolder.dataValidacao,
              "bg-green-100 text-green-700": stateHolder.dataValidacao,
            },
          )}
        >
          <BadgeCheck className={cn("h-3 min-h-3 w-3 min-w-3")} />
          <p className={cn("text-[0.57rem] font-medium")}>
            {stateHolder.dataValidacao ? "VALIDADO" : "NÃO VALIDADO"}
          </p>
        </div>
      </div>

      <NumberInput
        label="COMISSÃO DO VENDEDOR (%)"
        value={stateHolder.porcentagem}
        handleChange={(v) => {
          updateStateHolder({ porcentagem: v, valor: (v / 100) * comissionableValue });
        }}
        placeholder="Preencha aqui a porcentagem da comissão do vendedor..."
        width="100%"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
      />
      <NumberInput
        label="COMISSÃO DO VENDEDOR (R$)"
        value={stateHolder.valor || null}
        handleChange={(v) => {
          updateStateHolder({ valor: v, porcentagem: (v / comissionableValue) * 100 });
        }}
        placeholder="Preencha aqui o valor da comissão do vendedor..."
        width="100%"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
      />
      <div className="flex w-full items-center justify-center">
        <div className="bg-secondary text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center text-[0.55rem] font-bold italic">
          <p>COMISSÃO FINAL DO VENDEDOR</p>
          <p className="text-[0.57rem] font-black text-[#15599a]">
            {formatToMoney(comissionableValue * (stateHolder.porcentagem / 100))}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="VALORES NÃO EFETIVADOS"
            labelTrue="VALORES EFETIVADOS"
            date={stateHolder.dataEfetivacao ? new Date(stateHolder.dataEfetivacao) : null}
            handleChange={(value) => {
              updateStateHolder({ dataEfetivacao: value });
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="PAGAMENTO NÃO REALIZADO"
            labelTrue="PAGAMENTO REALIZADO"
            date={stateHolder.dataPagamento ? new Date(stateHolder.dataPagamento) : null}
            handleChange={(value) => {
              updateStateHolder({ dataPagamento: value });
            }}
          />
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
}
