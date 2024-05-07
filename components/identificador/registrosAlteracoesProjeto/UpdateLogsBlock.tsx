import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React, { useState } from 'react'
import { MdVisibility } from 'react-icons/md'

type UpdateLogsBlockProps = {
  logs: TProjectUpdateLogDTO[]
  SectionElement: React.JSX.Element
}
function UpdateLogsBlock({ logs, SectionElement }: UpdateLogsBlockProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  return (
    <div className="flex w-full flex-col gap-2 px-2">
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex items-center gap-1 rounded-full border border-cyan-500 bg-cyan-100 px-2 py-1 text-cyan-500"
        >
          <MdVisibility />
          <p className="text-xs font-medium">MOSTRAR REGISTRO DE ALTERAÇÕES</p>
        </button>
      </div>
      {showMenu ? SectionElement : null}
    </div>
  )
}

export default UpdateLogsBlock
