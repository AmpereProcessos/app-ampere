const DEFAULT_MAX_DIMENSION = 1600
const DEFAULT_QUALITY = 0.82
const SKIP_COMPRESSION_BELOW_BYTES = 800 * 1024

export type TImageCompressionResult = {
  file: File
  originalSize: number
  compressedSize: number
  compressionDurationMs: number
  compressed: boolean
  originalWidth: number | null
  originalHeight: number | null
  outputWidth: number | null
  outputHeight: number | null
}

type CompressImageForUploadOptions = {
  maxDimension?: number
  quality?: number
}

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

function replaceFileExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName}.${extension}`
}

async function loadImage(file: File) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('N\u00e3o foi poss\u00edvel otimizar a imagem.'))
      },
      'image/jpeg',
      quality
    )
  })
}

export async function compressImageForUpload(file: File, options: CompressImageForUploadOptions = {}): Promise<TImageCompressionResult> {
  const startedAt = now()
  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION
  const quality = options.quality ?? DEFAULT_QUALITY

  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo selecionado n\u00e3o \u00e9 uma imagem v\u00e1lida.')
  }

  const image = await loadImage(file)
  const originalWidth = image.naturalWidth
  const originalHeight = image.naturalHeight
  const largestDimension = Math.max(originalWidth, originalHeight)

  if (file.size <= SKIP_COMPRESSION_BELOW_BYTES && largestDimension <= maxDimension) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionDurationMs: Math.round(now() - startedAt),
      compressed: false,
      originalWidth,
      originalHeight,
      outputWidth: originalWidth,
      outputHeight: originalHeight,
    }
  }

  const scale = Math.min(1, maxDimension / largestDimension)
  const outputWidth = Math.max(1, Math.round(originalWidth * scale))
  const outputHeight = Math.max(1, Math.round(originalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight

  const context = canvas.getContext('2d')
  if (!context) throw new Error('O navegador n\u00e3o suporta a otimiza\u00e7\u00e3o da imagem.')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, outputWidth, outputHeight)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, outputWidth, outputHeight)

  const blob = await canvasToBlob(canvas, quality)
  const optimizedFile = new File([blob], replaceFileExtension(file.name, 'jpg'), {
    type: 'image/jpeg',
    lastModified: file.lastModified,
  })
  const shouldUseOptimizedFile = optimizedFile.size < file.size
  const outputFile = shouldUseOptimizedFile ? optimizedFile : file

  return {
    file: outputFile,
    originalSize: file.size,
    compressedSize: outputFile.size,
    compressionDurationMs: Math.round(now() - startedAt),
    compressed: shouldUseOptimizedFile,
    originalWidth,
    originalHeight,
    outputWidth: shouldUseOptimizedFile ? outputWidth : originalWidth,
    outputHeight: shouldUseOptimizedFile ? outputHeight : originalHeight,
  }
}
