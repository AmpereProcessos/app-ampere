import React from 'react'
import { BsFillPiggyBankFill } from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import { MdCategory, MdOutlineAddCircle } from 'react-icons/md'
import { formatToMoney } from '../../../utils/constants'

function AccountItem({ account, openEditModal }) {
  return (
    <div className="p-2 rounded border border-gray-200 flex flex-col w-full">
      <h1 className="text-center font-bold">{account.nome}</h1>
      <div className="flex items-center  gap-1 w-full justify-end mt-2">
        <button
          onClick={() => openEditModal(account._id)}
          className="flex items-center justify-center gap-1  border border-[#fead41] text-[#fead41] hover:bg-[#fead41] hover:text-white duration-300 ease-in-out rounded p-1 w-fit"
        >
          <AiFillEdit />
          <p className="font-raleway font-light text-xs tracking-tight">EDITAR</p>
        </button>
      </div>
    </div>
  )
}

export default AccountItem
