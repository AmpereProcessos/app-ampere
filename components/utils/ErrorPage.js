import React from 'react'
import { BiSolidError } from 'react-icons/bi'
function ErrorPage({ msg }) {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <BiSolidError size={50} />
      <p className="text-center text-sm italic text-gray-500 font-medium">{msg || 'Ooops, um erro desconhecido ocorreu. Tente novamente'}</p>
    </div>
  )
}

export default ErrorPage
