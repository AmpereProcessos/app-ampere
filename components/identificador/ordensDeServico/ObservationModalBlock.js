import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
const variants = {
  hidden: {
    opacity: 0.2,
    y: -1,
    transition: {
      duration: 0.5, // Adjust the duration as needed
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // Adjust the duration as needed
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01, // Adjust the duration as needed
    },
  },
}

function ObservationModalBlock({ infoHolder, setInfoHolder }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
        <h1 className="text-white font-bold">OBSERVAÇÕES</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div key={'editor'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2">
            <textarea
              autoFocus={true}
              value={infoHolder.observacoes}
              onChange={(e) => setInfoHolder((prev) => ({ ...prev, observacoes: e.target.value }))}
              className="resize-none w-full text-center min-h-[80px] rounded-bl-sm rounded-br-sm p-3 bg-gray-100 outline-none text-xs text-gray-600 font-medium"
            />
          </motion.div>
        ) : (
          <motion.div key={'readOnly'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2">
            <div className="flex-col  w-full min-h-[80px] rounded-bl-sm rounded-br-sm flex items-center justify-start p-3 bg-gray-200 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {infoHolder.observacoes ? (
                infoHolder.observacoes.split('\n').map((obs) => <p className="text-xs text-gray-600 font-medium">{obs}</p>)
              ) : (
                <p className="text-xs text-gray-600 font-medium">SEM OBSERVAÇÕES</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ObservationModalBlock
