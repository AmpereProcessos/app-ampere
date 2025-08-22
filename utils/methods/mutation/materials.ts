import axios from 'axios'
import createHttpError from 'http-errors'
import type { TMaterial, TMaterialDTO, TMaterialSupplier } from '@/utils/schemas/materials'
import type { TMaterialEntranceInput } from '@/pages/api/almoxarifado/estoque'
import { TDeleteMaterialInput, TDeleteMaterialOutput } from '@/pages/api/almoxarifado/materiais/exclusao'

type UpdateManyMaterialsParams = {
  formularyId?: string
  project: { id?: string | null; nome?: string | null }
  updates: { id: string; nome: string; diferenca: number }[]
}
export async function updateManyMaterials({ formularyId, project, updates }: UpdateManyMaterialsParams) {
  try {
    const { data } = await axios.put('/api/almoxarifado/estoque/operacoes-massa', { formularyId, project, updates })
    if (typeof data.message != 'string') return 'Atualizações realizadas com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

type InputMaterialParams = {
  input: TMaterialEntranceInput
}
export async function handleMultipleMaterialEntrance({ input }: InputMaterialParams) {
  try {
    const { data } = await axios.patch('/api/almoxarifado/estoque', input)
    if (typeof data.message !== 'string') return 'Entrada de material feita com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function debitMaterials({ formId, projectId, identifier, changes, tag }) {
  console.log('ID DO FORMULÁRIO', formId)
  console.log('MATERIAIS DEBITADOS', changes)
  console.log('TAG DA ALTERAÇÃO', tag)
  try {
    if (!changes) throw new createHttpError.BadRequest('Array de mudanças não específicado.')
    const filteredChangesByStockableItems = changes.filter((change) => !!change.id)
    const updateChangesObj = filteredChangesByStockableItems.map((x) => {
      return {
        id: x.id,
        diff: -x.qtdeSaida,
      }
    })
    console.log('UPDATE CHANGE OBJ', updateChangesObj)
    await axios.post('/api/almoxarifado/materiais', {
      idFormulario: formId,
      idProjeto: projectId,
      tag: tag,
      identificador: identifier,
      changes: updateChangesObj,
    })
    return { status: 'success', statusCode: 201 }
  } catch (error) {
    throw error
  }
}
export async function returnMaterials({ formId, identifier, changes, tag }) {
  console.log('ID DO FORMULÁRIO', formId)
  console.log('MATERIAIS DEBITADOS', changes)
  console.log('TAG DA ALTERAÇÃO', tag)
  try {
    if (!changes) throw new createHttpError.BadRequest('Array de mudanças não especificado.')
    const filteredChangesByStockableItems = changes.filter((change) => !!change.id)
    const updateChangesObj = filteredChangesByStockableItems.map((x) => {
      return {
        id: x.id,
        diff: x.qtdeDevolucao,
      }
    })
    console.log('UPDATE CHANGE OBJ', updateChangesObj)
    await axios.post('/api/almoxarifado/materiais', {
      idFormulario: formId,
      tag: tag,
      identificador: identifier,
      changes: updateChangesObj,
    })
    return { status: 'success', statusCode: 201 }
  } catch (error) {
    throw error
  }
}
export async function handleMaterialEntrance({ materialId, newPrice, diff }) {
  try {
    if (!materialId) throw new createHttpError.BadRequest('ID do material não fornecido.')
    if (!newPrice) throw new createHttpError.BadRequest('Novo preço não fornecido.')
    if (!diff) new createHttpError.BadRequest('Diferença não fornecida.')

    const changes = { id: materialId, price: newPrice, diff: diff }
    const response = await axios.patch('/api/almoxarifado/materiais', {
      changes: changes,
    })
    return 'Material atualizado com sucesso!'
  } catch (error) {
    throw error
  }
}
export async function addMaterial(newMaterialObj) {
  const { nome, qtde: quantidade, qtdeMinima: quantidadeMinima, grandeza, preco, codigo, localizacao, anotacoes } = newMaterialObj
  try {
    if (!nome) throw new createHttpError.BadRequest('Nome não fornecido.')
    if (!quantidade || Number(quantidade) <= 0) throw new createHttpError.BadRequest('Quantidade inválida!')
    if (!preco || Number(preco) <= 0) throw new createHttpError.BadRequest('Preço inválido!')
    const response = await axios.post('/api/almoxarifado/novoMaterial', {
      nome: nome,
      qtde: quantidade,
      qtdeMinima: quantidadeMinima,
      grandeza: grandeza,
      preco: preco,
      codigo: codigo,
      localizacao: localizacao,
      anotacoes: anotacoes,
    })
    return 'Material adicionado com sucesso !'
  } catch (error) {
    throw error
  }
}

export async function updateMaterial({ id, changes }: { id: string; changes: Partial<TMaterialDTO> }) {
  try {
    const { data } = await axios.put(`/api/almoxarifado/estoque?id=${id}`, changes)
    if (typeof data.message !== 'string') return 'Material atualizado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function createMaterial({ info }: { info: TMaterial }) {
  try {
    const { data } = await axios.post('/api/almoxarifado/estoque', info)
    if (typeof data.message !== 'string') return 'Material criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function createMaterialSupplier({ info }: { info: TMaterialSupplier }) {
  try {
    const { data } = await axios.post('/api/almoxarifado/fornecedores', info)
    return data as { data: { insertedId: string }; message: string }
  } catch (error) {
    throw error
  }
}

export async function deleteMaterial({ id, type, mergeIntoId }: TDeleteMaterialInput) {
  try {
    const { data } = await axios.post<TDeleteMaterialOutput>('/api/almoxarifado/materiais/exclusao', { id, type, mergeIntoId })
    return data
  } catch (error) {
    throw error
  }
}
