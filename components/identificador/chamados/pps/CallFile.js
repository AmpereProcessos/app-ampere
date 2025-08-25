import { getMetadata, ref } from 'firebase/storage'
import React from 'react'
import { MdAttachFile } from 'react-icons/md'
import { TbDownload } from 'react-icons/tb'
import { storage } from '../../../../utils/services/firebase/firebase-storage'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { fileTypes } from '../../../../utils/constants'

function CallFile({ info }) {
  async function handleDownload(info) {
    var splitFileName = info.title.replace('/', '').toUpperCase().split(' ')
    var fixedFileName = splitFileName.join('_')

    let fileRef = ref(storage, info.link)
    const metadata = await getMetadata(fileRef)

    const filePath = fileRef.fullPath
    const extension = fileTypes[metadata.contentType]?.extension

    try {
      const response = await axios.get(`/api/firebase/download?filePath=${encodeURIComponent(filePath)}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fixedFileName}${extension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error('Erro ao baixar arquivo')
    }
  }
  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-md border border-cyan-500 p-2">
      <div className="flex items-center gap-2">
        <MdAttachFile color="rgb(107,114,128)" />
        <Link href={info.link}>
          <div className="text-primary/80 text-sm font-medium duration-300 ease-in-out hover:text-cyan-500">{info.title || 'ARQUIVO'}</div>
        </Link>
        {info.format ? <p className="text-[0.6rem] font-medium text-[#fead41]">({info.format})</p> : null}
      </div>
      <div
        onClick={() => handleDownload(info)}
        className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
      >
        <TbDownload />
      </div>
    </div>
  )
}

export default CallFile
