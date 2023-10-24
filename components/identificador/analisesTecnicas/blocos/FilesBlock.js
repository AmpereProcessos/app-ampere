import React from 'react'
import ArchiveLinkBlock from '../../../utils/FileLinkBlock'

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
      <div className="mt-2 flex w-full flex-wrap justify-around gap-2">
        {infoHolder.arquivos && infoHolder.arquivos.length > 0 ? (
          infoHolder.arquivos.map((file, index) => (
            <div className="w-full lg:w-[400px]">
              <ArchiveLinkBlock key={index} obj={formatFileInfo({ info: file })} showDeleteMenu={false} />
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
