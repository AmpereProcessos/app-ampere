import toast from 'react-hot-toast'

export function isNumber(value) {
  if (value == null) return false
  const isNaNCheck = isNaN(value)
  if (isNaNCheck) return false
  return true
}
