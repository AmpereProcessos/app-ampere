import type { TProjectDTODBSimplified } from "@/utils/schemas/projects";

/**
 * Payload emitido ao selecionar um projeto.
 *
 * `id`, `nome` e `identificador` refletem a forma canônica já persistida pelos
 * consumidores do app (ex: `projeto` em formulários de almoxarifado, receitas e despesas),
 * enquanto `project` carrega o registro completo para quem precisar de mais campos.
 */
export type TProjectPickerSelection = {
  id: string;
  nome: string;
  identificador: number;
  project: TProjectDTODBSimplified;
};

/**
 * Rótulo de fallback para um projeto já persistido.
 *
 * Ao editar um registro salvo temos apenas `{ id, nome, identificador }`; sem isso o gatilho
 * exibiria o placeholder de "nenhum projeto" até que o projeto aparecesse nos resultados da busca.
 */
export type TProjectPickerFallback = {
  nome?: string | null;
  identificador?: string | number | null;
};
