import React from 'react'
import { MdOutlineSecurity } from 'react-icons/md'

function UnauthorizedPage() {
  return (
    <div className="flex grow items-center justify-center">
      <div className="flex items-center gap-1">
        <MdOutlineSecurity color=" rgb(220,38,38)" />
        <p className="font-medium tracking-tight text-gray-500">Oops, seu usuário não possui permissão para acessar essa página.</p>
      </div>
    </div>
  )
}

export default UnauthorizedPage
