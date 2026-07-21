import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../services/firebase/firebase-storage'
import { fileTypes } from '../constants'
import { uploadFile } from './firebase'

export type TSimpleAttachment = {
  file: File | null
  previewUrl: string | null
}

export type TAttachmentState = {
  titulo: string
  arquivos: {
    tipo: string | null
    arquivo: File | null
    previewUrl: string | null
    originalSize?: number
    compressionDurationMs?: number
  }[]
  identificador: string
}

export type TPropertyUsageClientMetrics = {
  fileCount: number
  originalBytes: number
  uploadedBytes: number
  compressionDurationMs: number
  uploadDurationMs: number
  effectiveType?: string
  downlinkMbps?: number
  rttMs?: number
}

type NetworkInformation = {
  effectiveType?: string
  downlink?: number
  rtt?: number
}

function getNetworkMetrics(): Pick<TPropertyUsageClientMetrics, 'effectiveType' | 'downlinkMbps' | 'rttMs'> {
  if (typeof navigator === 'undefined') return {}
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (!connection) return {}
  return {
    effectiveType: connection.effectiveType,
    downlinkMbps: connection.downlink,
    rttMs: connection.rtt,
  }
}
function getFileFormat(contentType: string) {
  const fileFormatInfo = fileTypes[contentType]
  if (!fileFormatInfo) return 'INDEFINIDO'
  return fileFormatInfo.title
}
export async function generalFirebaseUpload({ file, path }: { file: File; path: string }) {
  try {
    const fileRef = ref(storage, path)
    const firebaseUploadResponse = await uploadBytes(fileRef, file)
    const firebaseUploadMetadataFullPath = firebaseUploadResponse.metadata.fullPath
    const firebaseUploadMetadaContentType = firebaseUploadResponse.metadata.contentType
    const url = await getDownloadURL(ref(storage, firebaseUploadMetadataFullPath))
    const format = getFileFormat(firebaseUploadMetadaContentType ?? '')
    return { url, format }
  } catch (error) {
    throw error
  }
}

type HandleMultipleAttachmentsUpdateParams = {
  attachments: TAttachmentState[]
  vinculationId: string
  onProgress?: (progress: number) => void
  onMetrics?: (metrics: TPropertyUsageClientMetrics) => void
}
export async function handleMultipleAttachmentsUpdate({ attachments, vinculationId, onProgress, onMetrics }: HandleMultipleAttachmentsUpdateParams) {
  try {
    const uploadStartedAt = performance.now()
    const flattenAttachments = attachments.flatMap((attachment) => {
      return attachment.arquivos
        .filter((a) => !!a.arquivo)
        .map((file, index) => ({
          titulo: attachment.arquivos.length > 1 ? `${attachment.titulo} (${index + 1})` : attachment.titulo,
          arquivo: file.arquivo as File,
          originalSize: file.originalSize ?? (file.arquivo as File).size,
          compressionDurationMs: file.compressionDurationMs ?? 0,
        }))
    })
    const totalBytes = flattenAttachments.reduce((sum, attachment) => sum + attachment.arquivo.size, 0)
    const uploadedBytesByIndex = Array.from({ length: flattenAttachments.length }, () => 0)

    onProgress?.(flattenAttachments.length > 0 ? 0 : 100)

    const filesMetadata = await Promise.all(
      flattenAttachments.map(async (attachment, index) => {
        const { url, format, size } = await uploadFile({
          file: attachment.arquivo,
          fileName: attachment.titulo,
          vinculationId: vinculationId,
          prefix: 'property-usage',
          onProgress: onProgress
            ? (fileProgress) => {
                uploadedBytesByIndex[index] = Math.round((attachment.arquivo.size * fileProgress) / 100)
                const uploadedBytes = uploadedBytesByIndex.reduce((sum, current) => sum + current, 0)
                const totalProgress = totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 100
                onProgress(Math.min(totalProgress, 100))
              }
            : undefined,
        })
        return { titulo: attachment.titulo, url, formato: format, tamanho: size }
      })
    )

    onProgress?.(100)
    onMetrics?.({
      fileCount: flattenAttachments.length,
      originalBytes: flattenAttachments.reduce((sum, attachment) => sum + attachment.originalSize, 0),
      uploadedBytes: totalBytes,
      compressionDurationMs: flattenAttachments.reduce((sum, attachment) => sum + attachment.compressionDurationMs, 0),
      uploadDurationMs: Math.round(performance.now() - uploadStartedAt),
      ...getNetworkMetrics(),
    })

    return filesMetadata
  } catch (error) {
    console.error('Error uploading files:', error)
    throw error
  }
}
