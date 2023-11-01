import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../services/firebase/firebase-storage'
import { fileTypes } from '../constants'
function getFileFormat(contentType) {
  const fileFormatInfo = fileTypes[contentType]
  if (!fileFormatInfo) return 'INDEFINIDO'
  return fileFormatInfo.title
}
export async function generalFirebaseUpload({ file, path }) {
  try {
    const fileRef = ref(storage, path)
    const firebaseUploadResponse = await uploadBytes(fileRef, file)
    const firebaseUploadMetadataFullPath = firebaseUploadResponse.metadata.fullPath
    const firebaseUploadMetadaContentType = firebaseUploadResponse.metadata.contentType
    const url = await getDownloadURL(ref(storage, firebaseUploadMetadataFullPath))
    const format = getFileFormat(firebaseUploadMetadaContentType)
    return { url, format }
  } catch (error) {
    throw error
  }
}
