import { z } from "zod";

/**
 * Contrato comum de entrada das rotas de relatório (visão geral, perfil de
 * clientes e geográfica). Cada rota aceita este formato mesmo que use apenas
 * os campos necessários — assim um único recorte alimenta todas as abas.
 */

const SegmentValueSchema = z
  .string({ invalid_type_error: "Tipo não válido para o valor de segmento." })
  .optional()
  .nullable();

export const ReportSegmentSchema = z
  .object({
    sexo: SegmentValueSchema,
    faixaEtaria: SegmentValueSchema,
    faixaValor: SegmentValueSchema,
    profissao: SegmentValueSchema,
    formaPagamento: SegmentValueSchema,
  })
  .default({});

export const ReportPeriodSchema = z
  .object({
    after: z
      .string({ invalid_type_error: "Tipo não válido para a data de início." })
      .datetime({ message: "Data de início deve ser uma data válida" })
      .optional()
      .nullable(),
    before: z
      .string({ invalid_type_error: "Tipo não válido para a data de fim." })
      .datetime({ message: "Data de fim deve ser uma data válida" })
      .optional()
      .nullable(),
  })
  .default({});

export const ReportLocationSchema = z
  .object({
    estado: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
  })
  .default({});

export const ReportFilterInputSchema = z.object({
  projectTypes: z
    .array(z.string({ invalid_type_error: "Tipos de projetos inválidos" }), {
      required_error: "Tipos de projetos são obrigatórios",
      invalid_type_error: "Tipos de projetos inválidos",
    })
    .default([]),
  period: ReportPeriodSchema,
  location: ReportLocationSchema,
  segment: ReportSegmentSchema,
});

export type TReportSegment = z.infer<typeof ReportSegmentSchema>;
export type TReportPeriod = z.infer<typeof ReportPeriodSchema>;
export type TReportLocation = z.infer<typeof ReportLocationSchema>;
export type TReportFilterInput = z.infer<typeof ReportFilterInputSchema>;

/** Uma dimensão de segmento está ativa quando possui valor não vazio. */
export function hasActiveSegment(segment?: TReportSegment | null): boolean {
  if (!segment) return false;
  return Object.values(segment).some((value) => !!value);
}
