import React, { useState } from 'react'
import Text from './inputs/Text'
import NumberInput from './inputs/Number'
import Date from './inputs/Date'
import Select from './inputs/Select'
import axios from 'axios'
import { equipesTecnicas, serviceOrdersCategories, tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from '../utils/constants'
import { useSession } from 'next-auth/react'
import { FaCity, FaUser } from 'react-icons/fa'
import { AiFillPhone } from 'react-icons/ai'
import Avatar from './utils/Avatar'
import { MdLocationPin } from 'react-icons/md'
import { BsSuitDiamondFill } from 'react-icons/bs'
import TakeMaterialsBlock from './identificador/ordensDeServico/TakeMaterialsBlock'
import AvailableMaterialsBlock from './identificador/ordensDeServico/AvailableMaterialsBlock'
import CheckboxInput from './CheckboxInput'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { createServiceOrder } from '../utils/methods/mutation/serviceOrders'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { useQueryClient } from 'react-query'
import { VscChromeClose } from 'react-icons/vsc'
import ModalNewServiceOrder from './identificador/ordensDeServico/ModalNewServiceOrder'
function getEquipmentList({ str, category }) {
  if (category != 'MONTAGEM') return null
  if (typeof str != 'string') return null
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    console.log(arr)
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]
    if (qty && desc)
      return {
        qtde: qty,
        descricao: desc,
      }
  })
  return formattedSpllited.filter((x) => !!x)
}
function getInverterInfoByStr(str) {
  const regexInverterQty = /^(\d{1,3})x/i
  const regexInverterModel = /x([^()]+)/
  const regexInverterPower = /\((\d+)W\)/
  const inverterQty = regexInverterQty.exec(str) ? regexInverterQty.exec(str)[0].slice(0, -1) : null
  const inverterModel = regexInverterModel.exec(str) ? regexInverterModel.exec(str)[0].substring(1) : null
  const inverterPower = regexInverterPower.exec(str) ? regexInverterPower.exec(str)[0].replace('(', '').replace(')', '').replace('W', '') : null
  return {
    modelo: inverterModel,
    qtde: inverterQty,
    potencia: inverterPower,
  }
}
function OSCreationBlock({ project, categories }) {
  const { data: session } = useSession()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  return (
    <div className="flex flex-col w-full items-center">
      <div
        onClick={() => setDropdownMenuVisible(true)}
        className="flex items-center justify-between  p-2 rounded-md mb-2 bg-gray-500 hover:bg-cyan-500 w-fit cursor-pointer"
      >
        <h1 className="text-center text-white font-bold">ABRIR PAINEL DE CRIAÇÃO DE ORDEM DE SERVIÇO</h1>
      </div>

      {dropdownMenuVisible ? (
        <ModalNewServiceOrder project={project} categories={categories} closeModal={() => setDropdownMenuVisible(false)} session={session} />
      ) : null}
    </div>
  )
}

export default OSCreationBlock
