import React from 'react'

function CardProjeto({ info, handleOpenModal, setModalProject, estagio }) {
  return (
    <div
      onClick={() => {
        handleOpenModal()
        setModalProject({ estagio: estagio, projeto: info })
      }}
      className="border-primary/20 dark:hover:bg-primary/10 mt-2 flex w-full flex-col gap-y-2 rounded border px-2 py-2 shadow-xs hover:bg-blue-100"
    >
      <div>
        <h1 className="text-xs font-bold text-zinc-700">
          <strong className="text-[#15599a]">{info.qtde}</strong> - {info.nomeDoProjeto}
        </h1>
      </div>
    </div>
  )
}

export default CardProjeto
