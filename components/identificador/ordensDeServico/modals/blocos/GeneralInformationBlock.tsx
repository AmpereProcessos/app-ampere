import DateInput from "@/components/inputs/Date";
import MultipleSelectWithImages from "@/components/inputs/MultipleSelectWithImages";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { cn } from "@/lib/utils";
import {
  equipesTecnicas,
  formatDate,
  serviceOrdersCategories,
  serviceOrderUrgencyOptions,
} from "@/utils/constants";
import {
  formatDateAsLocale,
  formatNameAsInitials,
  formatToPhone,
} from "@/utils/methods/formatting";
import { useEmployeesSimplified } from "@/utils/methods/query/users";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { ServiceOrderStatus } from "@/utils/select-options";
import { LayoutGrid } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { BsCalendarPlus } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { TbUrgent } from "react-icons/tb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
type ServiceOrderGeneralInformationBlockProps = {
  predefinedCategories?: { id: number; label: string; value: string }[];
  infoHolder: TServiceOrder;
  updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
  project?: TServiceOrderProject;
};
function ServiceOrderGeneralInformationBlock({
  infoHolder,
  updateInfoHolder,
  project,
}: ServiceOrderGeneralInformationBlockProps) {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    error: employeesError,
  } = useEmployeesSimplified({});
  function handleEffectivationUpdate(
    newValue: TServiceOrder["status"],
    previousData: TServiceOrder,
  ) {
    if (newValue === "CONCLUÍDA") {
      if (previousData.status !== "CONCLUÍDA") return new Date().toISOString();
      return previousData.dataEfetivacao;
    }
    if (previousData.status === "CONCLUÍDA") return null;
    return previousData.dataEfetivacao;
  }
  function handleUseProjectInformation(project: TServiceOrderProject | undefined) {
    if (!project) return toast.error("Dados do projeto não encontrados.");
    updateInfoHolder({
      descricao: `${project?.tipoDeServico} DO(A) ${project?.nomeDoContrato}`,
      favorecido: {
        nome: project?.nomeDoContrato,
        contato: project?.telefone?.toString() || "",
      },
      responsavel: {
        nome: project?.obra?.equipeResp || "",
        tipo: project?.obra?.equipeResp ? "INTERNO" : "EXTERNO",
      },
    });
  }
  const isServiceOrderInformationEqualToProject = Object.values({
    description: project
      ? infoHolder.descricao === `${project?.tipoDeServico} DO(A) ${project?.nomeDoContrato}`
      : false,
    favoredName: project ? infoHolder.favorecido?.nome === project?.nomeDoContrato : false,
    favoredPhone: project ? infoHolder.favorecido?.contato === project?.telefone : false,
    responsibleName: project ? infoHolder.responsavel?.nome === project?.obra?.equipeResp : false,
  }).every((r) => r);

  const responsiblesMissingValidation = infoHolder.responsaveis.filter((r) => !r.dataValidacao);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <p className="text-foreground text-xs font-medium">CRIADO POR:</p>
          <Avatar className="w-6 h-6 min-w-6 min-h-6">
            <AvatarImage src={infoHolder?.autor?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs font-medium">
              {formatNameAsInitials(infoHolder?.autor?.nome || "Autor não identificado")}
            </AvatarFallback>
          </Avatar>
          <p className="text-foreground text-xs font-medium">
            {infoHolder?.autor?.nome || "Autor não identificado"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BsCalendarPlus />
          <p className="text-foreground text-xs font-medium">
            {formatDateAsLocale(infoHolder?.dataInsercao, true)}
          </p>
        </div>
      </div>
      <ResponsiveDialogDrawerSection
        sectionTitleText="INFORMAÇÕES GERAIS"
        sectionTitleIcon={<LayoutGrid size={15} />}
      >
        <div className="flex w-full items-center justify-end">
          {project && !isServiceOrderInformationEqualToProject ? (
            <button
              type="button"
              onClick={() => handleUseProjectInformation(project)}
              className={cn(
                "flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400",
              )}
            >
              <MdContentCopy size={12} />
              <h1 className="text-[0.65rem] font-medium tracking-tight">
                UTILIZAR DADOS DO PROJETO
              </h1>
            </button>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="DESCRIÇÃO DO SERVIÇO"
                placeholder="Preencha a descrição do serviço..."
                value={infoHolder.descricao}
                handleChange={(value) => updateInfoHolder({ descricao: value })}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="CATEGORIA DO SERVIÇO"
                value={infoHolder.categoria}
                options={serviceOrdersCategories}
                handleChange={(value) => updateInfoHolder({ categoria: value })}
                width="100%"
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  updateInfoHolder({
                    categoria: serviceOrdersCategories[0].value as TServiceOrder["categoria"],
                  })
                }
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="STATUS DO SERVIÇO"
                value={infoHolder.status}
                options={ServiceOrderStatus}
                handleChange={(value) =>
                  updateInfoHolder({
                    status: value,
                    dataEfetivacao: handleEffectivationUpdate(value, infoHolder),
                  })
                }
                width="100%"
                selectedItemLabel="NULO"
                onReset={() => updateInfoHolder({ status: "PENDENTE" })}
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="NOME DO FAVORECIDO"
                placeholder="Preencha o nome do favorecido..."
                value={infoHolder.favorecido?.nome}
                handleChange={(value) =>
                  updateInfoHolder({ favorecido: { ...infoHolder.favorecido, nome: value } })
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="CONTATO DO FAVORECIDO"
                placeholder="Preencha o contato do favorecido..."
                value={infoHolder.favorecido?.contato}
                handleChange={(value) =>
                  updateInfoHolder({
                    favorecido: { ...infoHolder.favorecido, contato: formatToPhone(value) },
                  })
                }
                width="100%"
              />
            </div>
          </div>

          <MultipleSelectWithImages
            label="RESPONSÁVEIS"
            selected={infoHolder.responsaveis.map((responsible) => responsible.id)}
            options={
              employees?.map((employee) => ({
                id: employee._id,
                label: employee.nome,
                value: employee._id,
              })) || []
            }
            handleChange={(value) => {
              const selectedResponsibles: TServiceOrder["responsaveis"] =
                employees
                  ?.filter((employee) => value.includes(employee._id))
                  .map((employee) => ({
                    id: employee._id,
                    nome: employee.nome,
                    avatar_url: employee.avatar_url,
                    telefone: employee.telefone,
                    email: employee.email,
                  })) || [];
              updateInfoHolder({ responsaveis: selectedResponsibles });
            }}
            onReset={() => updateInfoHolder({ responsaveis: [] })}
            resetOptionLabel="NÃO DEFINIDO"
            width="100%"
          />
          {responsiblesMissingValidation.length > 0 ? (
            <div className="w-full flex items-center flex flex-col lg:flex-row gap-2">
              <h3 className="text-foreground text-xs font-medium">
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
          <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">
            LIBERAÇÃO DA ORDEM DE SERVIÇO
          </h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <DateInput
                label="DATA DE PREVISÃO P/ LIBERAÇÃO"
                value={formatDate(infoHolder.dataPrevisaoLiberacao)}
                handleChange={(value) =>
                  updateInfoHolder({
                    dataPrevisaoLiberacao: formatDateInputChange(value, "string") as string,
                  })
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <DateInput
                label="DATA DE LIBERAÇÃO"
                value={formatDate(infoHolder.dataLiberacao)}
                handleChange={(value) =>
                  updateInfoHolder({
                    dataLiberacao: formatDateInputChange(value, "string") as string,
                  })
                }
                width="100%"
              />
            </div>
          </div>
          <h1 className="text-foreground text-sm font-medium tracking-tight">
            URGÊNCIA DA ORDEM DE SERVIÇO
          </h1>
          <div className="flex w-full flex-wrap items-center justify-around gap-4">
            {serviceOrderUrgencyOptions.map((urgency) => (
              <button
                type="button"
                key={urgency.value}
                onClick={() =>
                  updateInfoHolder({
                    urgencia:
                      infoHolder.urgencia !== urgency.value
                        ? (urgency.value as TServiceOrder["urgencia"])
                        : "POUCO URGENTE",
                  })
                }
                className={cn(
                  "flex items-center gap-2 rounded border px-4 py-2 duration-300 ease-in-out",
                  urgency.textColor,
                  urgency.backgroundColor,
                  urgency.value === infoHolder.urgencia
                    ? "opacity-100 hover:opacity-80"
                    : "opacity-40 hover:opacity-70",
                  urgency.value === infoHolder.urgencia
                    ? urgency.borderColor
                    : "border-transparent",
                )}
              >
                <TbUrgent size={16} />
                <h1 className="text-xs font-bold tracking-tighter">{urgency.label}</h1>
              </button>
            ))}
          </div>
          <TextareaInput
            label="ANOTAÇÕES"
            placeholder="Preencha as anotações do serviço..."
            value={infoHolder.anotacoes || ""}
            handleChange={(value) => updateInfoHolder({ anotacoes: value })}
          />
        </div>
      </ResponsiveDialogDrawerSection>
    </div>
  );
}

export default ServiceOrderGeneralInformationBlock;
