import dayjs from 'dayjs'
import { TProjectDTO } from '../schemas/projects'
import { TLocation } from '../schemas/useful'

export function formatNameAsInitials(name: string) {
  const splittedName = name.replace('-', '').split(' ')
  const firstLetter = splittedName[0][0]
  var secondLetter
  if (['DE', 'DA', 'DO', 'DOS', 'DAS'].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : ''
  else secondLetter = splittedName[1] ? splittedName[1][0] : ''
  return firstLetter + secondLetter
}
export function formatDateAsLocale(date: string | Date | null | undefined, showHours: boolean = false) {
  if (!date) return null
  if (showHours) return dayjs(date).format('DD/MM/YYYY HH:mm')
  return dayjs(date).add(3, 'hour').format('DD/MM/YYYY')
}

export function formatDateTime(value: any) {
  if (!value) return undefined
  if (isNaN(new Date(value).getMilliseconds())) return undefined
  return dayjs(value).format('YYYY-MM-DDTHH:mm')
}
export function formatToCEP(value: string) {
  let cep = value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}
export function formatToCPForCNPJ(value: string) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
export function formatToPhone(value: string) {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}

export function formatWithoutDiacritics(string: string, useUpperCase?: boolean) {
  if (!useUpperCase) return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  else
    return string
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
}
export function getProjectNestedFieldValue(project: TProjectDTO, path: string) {
  // @ts-ignore
  return path.split('.').reduce((acc, part) => acc && acc[part as keyof TProjectDTO], project)
}

export function formatLocation({ location, includeUf, includeCity }: { location: TLocation; includeUf?: boolean; includeCity?: boolean }) {
  var addressStr = ''
  if (includeCity && location.cidade) addressStr = addressStr + `${location.cidade}`
  if (includeUf && location.uf) addressStr = addressStr + ` (${location.uf}), `
  if (!location.endereco) return ''
  addressStr = addressStr + location.endereco
  if (location.numeroOuIdentificador) addressStr = addressStr + `, Nº ${location.numeroOuIdentificador}`
  if (location.bairro) addressStr = addressStr + `, ${location.bairro}`
  addressStr += '.'
  return addressStr.toUpperCase()
}
