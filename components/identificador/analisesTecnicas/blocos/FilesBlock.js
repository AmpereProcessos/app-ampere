import React from 'react'
import ArchiveLinkBlock from '../../../utils/FileLinkBlock'
import Link from 'next/link'

function FilesBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  function formatFileInfo({ info }) {
    return {
      title: info.descricao,
      link: info.url,
      format: info.formato,
    }
  }
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">ARQUIVOS</h1>
      </div>
      <div className="flex flex-col w-full items-center">
        <h1 className="font-sans font-bold  text-[#353432]">LINK PARA ARQUIVOS AUXILIARES</h1>
        {infoHolder.arquivosAuxiliares ? (
          <Link href={infoHolder.arquivosAuxiliares}>
            <a className="w-fit text-center text-blue-300 self-center font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-cyan-300">
              {infoHolder.arquivosAuxiliares}
            </a>
          </Link>
        ) : (
          <p className="w-full font-medium text-center text-xs italic text-gray-500 py-2">Link não preenchido.</p>
        )}
      </div>
      <div className="mt-2 flex w-full flex-wrap justify-around gap-2">
        {infoHolder.arquivos && infoHolder.arquivos.length > 0 ? (
          infoHolder.arquivos.map((file, index) => (
            <div key={index} className="w-full lg:w-[400px]">
              <ArchiveLinkBlock obj={formatFileInfo({ info: file })} showDeleteMenu={false} />
            </div>
          ))
        ) : (
          <p className="w-full font-medium text-center text-xs italic text-gray-500">Nenhum arquivo adicionado.</p>
        )}
      </div>
    </div>
  )
}

export default FilesBlock
