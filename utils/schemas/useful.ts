export type TLocation = {
  cep?: string | null
  uf: string
  cidade: string
  bairro?: string | null
  endereco?: string | null
  numeroOuIdentificador?: string | null
  complemento?: string | null
  latitude?: string | null
  longitude?: string | null
}

export type TAttachmentHolder = {
  title: string
  file: File | null
  previewUrl: string | null
  type: string | null
}
