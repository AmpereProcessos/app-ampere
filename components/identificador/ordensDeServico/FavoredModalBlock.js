import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit, AiFillPhone } from 'react-icons/ai'
import { FaCity, FaUser } from 'react-icons/fa'
import { MdLocationPin } from 'react-icons/md'
import TextInput from '../../inputs/Text'

function FavoredModalBlock({ infoHolder, setInfoHolder }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
        <h1 className="text-white font-bold">FAVORECIDO</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div className="w-full flex flex-col gap-1">
            <TextInput label={'NOME'} placeholder={'Preencha o nome do cliente favorecido...'} value={infoHolder.favorecido.nome} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
        <div className="flex gap-2 items-center text-gray-800">
          <FaUser size={'20px'} color="rgb(31,41,55)" />
          <p className="font-raleway font-medium text-sm">{order?.favorecido?.nome || 'N/A'}</p>
        </div>
        <div className="flex gap-2 items-center text-gray-800">
          <AiFillPhone size={'20px'} color="rgb(31,41,55)" />
          <p className="font-raleway font-medium text-sm">{order?.favorecido?.contato || 'N/A'}</p>
        </div>
      </div>
      <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
        <div className="flex gap-2 items-center">
          <FaCity size={'20px'} color="rgb(31,41,55)" />
          <p className="font-raleway font-medium text-sm">
            {order?.localizacao ? `${order?.localizacao.cidade} - ${order?.localizacao.uf} ` : 'N/A'}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
          <p className="font-raleway font-medium text-sm">
            {order?.localizacao
              ? `${order?.localizacao.endereco}, Nº ${order?.localizacao.numeroOuIdentificador}, ${order?.localizacao.bairro} - ${order?.localizacao.cep}`
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FavoredModalBlock
