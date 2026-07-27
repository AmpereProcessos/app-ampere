"use client";

import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { AnimatedSpinner } from "@/components/utils/icons";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useProjectResume } from "@/utils/methods/query/projects";
import type { TProjectDTODBSimplified, TProjectResumeDTO } from "@/utils/schemas/projects";
import {
  CalendarDays,
  ChevronDown,
  CodeIcon,
  CreditCard,
  ExternalLink,
  HardHat,
  Headset,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Sun,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { formatProjectLocation } from "./SelectProjectInput";
import type { TProjectPickerFallback } from "./types";

type ResumeLineProps = {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
};
function ResumeLine({ icon, label, value }: ResumeLineProps) {
  return (
    <div className="flex w-full min-w-0 items-start gap-1.5">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex min-w-0 flex-col">
        <span className="text-muted-foreground text-[0.6rem] font-medium tracking-tight uppercase">
          {label}
        </span>
        <span className="text-foreground text-xs font-medium break-words">
          {value === null || value === undefined || value === "" ? "N/A" : value}
        </span>
      </div>
    </div>
  );
}

const CRM_OPPORTUNITY_BASE_URL = "https://crm.ampereenergias.com.br/comercial/oportunidades/id";

type CRMCodeBadgeProps = {
  codigoSVB: TProjectResumeDTO["codigoSVB"];
  idProjetoCRM: TProjectResumeDTO["idProjetoCRM"];
};
/**
 * Exibe o código SVB do projeto. Quando há `idProjetoCRM` (o ObjectId da oportunidade no CRM),
 * o código vira um link para a oportunidade; caso contrário fica como texto simples.
 */
function CRMCodeBadge({ codigoSVB, idProjetoCRM }: CRMCodeBadgeProps) {
  if (codigoSVB === null || codigoSVB === undefined || codigoSVB === "") return null;

  const content = (
    <>
      <CodeIcon className="h-3.5 w-3.5 min-h-3.5 min-w-3.5 shrink-0" />
      <span className="text-xs font-bold tracking-tight">{codigoSVB}</span>
    </>
  );

  if (!idProjetoCRM)
    return (
      <div className="bg-secondary text-primary flex w-fit items-center gap-1.5 rounded-lg px-2 py-1">
        {content}
      </div>
    );

  return (
    <a
      href={`${CRM_OPPORTUNITY_BASE_URL}/${idProjetoCRM}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Abrir a oportunidade no CRM"
      className="bg-secondary text-primary hover:bg-primary/20 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out"
    >
      {content}
      <ExternalLink className="h-3 w-3 min-h-3 min-w-3 shrink-0" />
    </a>
  );
}

function ResumeContent({ project }: { project: TProjectResumeDTO }) {
  const location = formatLocation({
    location: {
      uf: project.uf || "",
      cidade: project.cidade || "",
      cep: project.cep?.toString() || null,
      bairro: project.bairro,
      endereco: project.logradouro,
      numeroOuIdentificador: project.numeroResidencia?.toString() || null,
      complemento: null,
      latitude: null,
      longitude: null,
    },
    includeCity: true,
    includeUf: true,
    includeCEP: true,
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <CRMCodeBadge codigoSVB={project.codigoSVB} idProjetoCRM={project.idProjetoCRM} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ResumeLine
          icon={<UserRound className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Vendedor"
          value={
            project.vendedor?.nome
              ? `${project.vendedor.nome}${
                  project.vendedor.codigo ? ` (#${project.vendedor.codigo})` : ""
                }`
              : null
          }
        />
        <ResumeLine
          icon={<Headset className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Insider (SDR)"
          value={project.insider}
        />
        <ResumeLine
          icon={<Megaphone className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Canal de venda"
          value={project.canalVenda}
        />
        <ResumeLine
          icon={<HardHat className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Tipo de serviço"
          value={project.tipoDeServico}
        />
        <ResumeLine
          icon={<Phone className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Telefone"
          value={project.telefone}
        />
        <ResumeLine
          icon={<Mail className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Email"
          value={project.email}
        />
        <ResumeLine
          icon={<CalendarDays className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Contrato"
          value={
            project.contrato?.status
              ? `${project.contrato.status}${
                  project.contrato.dataAssinatura
                    ? ` · assinado em ${formatDateAsLocale(project.contrato.dataAssinatura)}`
                    : ""
                }`
              : null
          }
        />
        <ResumeLine
          icon={<CreditCard className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Pagamento"
          value={
            project.pagamento?.forma
              ? `${project.pagamento.forma}${
                  project.pagamento.credor ? ` · ${project.pagamento.credor}` : ""
                }`
              : null
          }
        />
        <ResumeLine
          icon={<Sun className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Sistema"
          value={
            project.sistema?.potPico
              ? `${project.sistema.potPico} kWp${
                  project.sistema.qtdeModulos ? ` · ${project.sistema.qtdeModulos} módulos` : ""
                }`
              : null
          }
        />
        <ResumeLine
          icon={<CreditCard className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Valor do projeto"
          value={project.sistema?.valorProjeto ? formatToMoney(project.sistema.valorProjeto) : null}
        />
        <ResumeLine
          icon={<HardHat className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Obra"
          value={
            project.obra?.entrada || project.obra?.saida
              ? `${
                  project.obra?.entrada
                    ? `entrada ${formatDateAsLocale(project.obra.entrada)}`
                    : "sem entrada"
                } · ${
                  project.obra?.saida
                    ? `saída ${formatDateAsLocale(project.obra.saida)}`
                    : "sem saída"
                }`
              : null
          }
        />
        <ResumeLine
          icon={<MapPin className="h-3.5 w-3.5 min-h-3.5 min-w-3.5" />}
          label="Localização"
          value={location}
        />
      </div>
      {project.etiquetas && project.etiquetas.length > 0 ? (
        <div className="flex w-full flex-wrap items-center gap-1">
          {project.etiquetas.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold"
              style={{
                backgroundColor: tag.cores?.secundaria || "#15599a",
                color: tag.cores?.primaria || "#ffffff",
              }}
            >
              {tag.titulo}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ProjectResumePanelProps = {
  projectId: string;
  /** Projeto simplificado já disponível — evita um estado vazio no cabeçalho. */
  selectedProject?: TProjectDTODBSimplified | null;
  /** Rótulo de fallback quando só há `{ nome, identificador }` persistidos. */
  fallbackLabel?: TProjectPickerFallback | null;
  defaultExpanded?: boolean;
  className?: string;
};

function ProjectResumePanel({
  projectId,
  selectedProject,
  fallbackLabel,
  defaultExpanded = false,
  className,
}: ProjectResumePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // A query só dispara quando o usuário realmente abre os detalhes.
  const { data: resume, isLoading, isError, error } = useProjectResume({
    id: projectId,
    enabled: isExpanded,
  });

  return (
    <div
      className={cn(
        "border-border bg-card flex w-full flex-col gap-3 rounded-lg border p-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">
              {selectedProject?.qtde ?? resume?.qtde ?? fallbackLabel?.identificador ?? "—"}
            </span>
            <span className="min-w-0 grow truncate text-sm font-bold tracking-tight">
              {selectedProject?.nomeDoContrato ??
                resume?.nomeDoContrato ??
                fallbackLabel?.nome ??
                "Projeto vinculado"}
            </span>
          </div>
          <div className="text-muted-foreground flex min-w-0 items-center gap-1 text-[0.65rem]">
            <MapPin className="h-3 w-3 min-h-3 min-w-3 shrink-0" />
            <span className="min-w-0 truncate">
              {selectedProject
                ? formatProjectLocation(selectedProject)
                : resume
                  ? formatLocation({
                      location: {
                        uf: resume.uf || "",
                        cidade: resume.cidade || "",
                        cep: null,
                        bairro: resume.bairro,
                        endereco: resume.logradouro,
                        numeroOuIdentificador: resume.numeroResidencia?.toString() || null,
                        complemento: null,
                        latitude: null,
                        longitude: null,
                      },
                      includeCity: true,
                      includeUf: true,
                    }) || "—"
                  : "—"}
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1 text-[0.65rem] font-bold"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "FECHAR DETALHES" : "VER DETALHES"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 min-h-3.5 min-w-3.5 transition-transform duration-200 ease-out",
              isExpanded && "rotate-180",
            )}
          />
        </Button>
      </div>

      {isExpanded ? (
        <div className="border-border w-full border-t pt-3">
          {isLoading ? (
            <div className="flex w-full flex-col items-center gap-2 py-6">
              <AnimatedSpinner className="h-6 w-6" />
              <p className="text-muted-foreground text-xs">Carregando detalhes...</p>
            </div>
          ) : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {resume ? <ResumeContent project={resume} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectResumePanel;
