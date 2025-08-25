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
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">ARQUIVOS</h1>
      </div>
      <div className="flex w-full flex-col items-center">
        <h1 className="font-sans font-bold text-[#353432]">LINK PARA ARQUIVOS AUXILIARES</h1>
        {infoHolder.arquivosAuxiliares ? (
          <Link href={infoHolder.arquivosAuxiliares}>
            <div className="font-raleway w-fit cursor-pointer self-center text-center text-sm font-medium text-blue-300 duration-300 ease-in-out hover:text-cyan-300">
              {infoHolder.arquivosAuxiliares}
            </div>
          </Link>
        ) : (
          <p className="text-primary/60 w-full py-2 text-center text-xs font-medium italic">Link não preenchido.</p>
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
          <p className="text-primary/60 w-full text-center text-xs font-medium italic">Nenhum arquivo adicionado.</p>
        )}
      </div>
    </div>
  )
}

export default FilesBlock
