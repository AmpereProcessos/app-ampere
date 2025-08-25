import React from 'react'
import { BsFillPiggyBankFill } from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import { MdCategory, MdOutlineAddCircle } from 'react-icons/md'
import { formatToMoney } from '../../../utils/constants'

function AccountItem({ account, openEditModal }) {
  return (
    <div className="border-primary/20 flex w-full flex-col rounded border p-2">
      <h1 className="text-center font-bold">{account.nome}</h1>
      <div className="mt-2 flex w-full items-center justify-end gap-1">
        <button
          onClick={() => openEditModal(account._id)}
          className="flex w-fit items-center justify-center gap-1 rounded border border-[#fead41] p-1 text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
        >
          <AiFillEdit />
          <p className="font-raleway text-xs font-light tracking-tight">EDITAR</p>
        </button>
      </div>
    </div>
  )
}

export default AccountItem
