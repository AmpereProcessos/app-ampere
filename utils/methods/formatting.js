import dayjs from 'dayjs'

export function formatNameAsInitials(name) {
  const splittedName = name.replace('-', '').split(' ')
  const firstLetter = splittedName[0][0]
  var secondLetter
  if (['DE', 'DA', 'DO', 'DOS', 'DAS'].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : ''
  else secondLetter = splittedName[1] ? splittedName[1][0] : ''
  return firstLetter + secondLetter
}
export function formatDateAsLocale(date, showHours = false) {
  if (!date) return null
  if (showHours) return dayjs(date).format('DD/MM/YYYY HH:mm')
  return dayjs(date).add(3, 'hour').format('DD/MM/YYYY')
}

export function formatToCEP(value) {
  let cep = value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}
export function formatToCPForCNPJ(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
export function formatToPhone(value) {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}
