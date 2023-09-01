import { getMetadata, ref } from 'firebase/storage'
import React from 'react'
import { MdAttachFile } from 'react-icons/md'
import { TbDownload } from 'react-icons/tb'
import { storage } from '../../../../utils/firebase'
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
    <div className="flex items-center justify-between gap-2 w-full border border-cyan-500 rounded-md p-2">
      <div className="flex items-center gap-2">
        <MdAttachFile color="rgb(107,114,128)" />
        <Link href={info.link}>
          <a className="text-sm text-gray-600 font-medium hover:text-cyan-500 duration-300 ease-in-out">{info.title || 'ARQUIVO'}</a>
        </Link>
        {info.format ? <p className="text-[0.6rem] text-[#fead41] font-medium">({info.format})</p> : null}
      </div>
      <div
        onClick={() => handleDownload(info)}
        className="flex items-center justify-center text-blue-700 hover:text-blue-500 hover:scale-105 duration-300 ease-in-out cursor-pointer"
      >
        <TbDownload />
      </div>
    </div>
  )
}

export default CallFile
