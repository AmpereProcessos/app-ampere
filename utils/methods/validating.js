import toast from 'react-hot-toast'

export function isNumber(value) {
  if (value == null) return false
  const isNaNCheck = isNaN(value)
  if (isNaNCheck) return false
  return true
}
export function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && value !== null && value !== undefined
}
