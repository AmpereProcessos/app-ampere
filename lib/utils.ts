import { type ClassValue, clsx } from 'clsx'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function absoluteUrl(path: string) {
  return new URL(path, process.env.NEXT_PUBLIC_URL).href
}

export async function copyToClipboard(text: string | undefined) {
  if (!text) {
    toast.error('Conteúdo não disponível para cópia.')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copiado para área de transferência.')
  } catch (err) {
    toast.error('Erro ao copiar para área de transferência.')
    console.error('Failed to copy:', err)
  }
}
