import React from 'react'
import { useMaterialLogs } from '../../../utils/methods/query/materials'
import LoadingPage from '../../utils/LoadingPage'
import { FaLongArrowAltRight, FaUserCircle } from 'react-icons/fa'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'
import { BsCalendarFill, BsCartPlusFill } from 'react-icons/bs'
import dayjs from 'dayjs'
function MaterialLogs({ materialId }) {
  const { data: logs, isFetching, isSuccess } = useMaterialLogs(materialId, !!materialId)
  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2">
      <h1 className="w-full rounded bg-zinc-700 p-2 text-center font-raleway font-medium text-white">HISTÓRICO DE ALTERAÇÕES</h1>
      {isFetching ? (
        <div className="min-h-[200px] w-full">
          <LoadingPage />
        </div>
      ) : null}
      {isSuccess ? (
        logs.length > 0 ? (
          <div className="flex w-full flex-col gap-2 py-2">
            {logs.map((log, index) => (
              <div key={log._id} className="tex flex w-full flex-col rounded border border-gray-200 p-2 px-4 lg:w-[60%]">
                <div className="flex w-full justify-center">
                  {log.tipo == 'ENTRADA' ? <BsCartPlusFill color="rgb(34,197,94)" size={'20px'} /> : null}
                  {log.tipo == 'RETIRADA' ? <ImArrowUp color="rgb(239,68,68)" /> : null}
                  {log.tipo == 'DEVOLUÇÃO' ? <ImArrowDown color="rgb(34,197,94)" /> : null}
                  {log.tipo == 'ALTERAÇÃO MANUAL' ? <AiFillEdit color="#fead41" /> : null}
                </div>

                <div className="flex items-center justify-center">
                  <h1 className="text-sm font-medium">{log.tipo}</h1>
                </div>

                <div className="grid grid-cols-3 items-center">
                  {log.qtdeAnterior && log.qtdeNovo ? (
                    <>
                      <h1 className="text-end text-lg text-gray-600">{log.qtdeAnterior}</h1>
                      <div className="flex items-center justify-center">
                        <FaLongArrowAltRight />
                      </div>
                      <h1 className="text-start text-lg text-gray-600">{log.qtdeNovo}</h1>
                    </>
                  ) : (
                    <div className="col-span-3 flex items-center justify-center">{log.alteracao}</div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <div className="flex items-center justify-start gap-2">
                    <FaUserCircle />
                    <h1 className="text-xs text-gray-500">{log.autor?.nome}</h1>
                  </div>
                  <div className="items-justify-end flex gap-2">
                    <BsCalendarFill color="#15599a" />
                    <h1 className="text-xs text-gray-500">{dayjs(log.dataInsercao).format('DD/MM/YYYY HH:mm')}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="w-full text-center">Não há histórico de alteração desse item.</p>
        )
      ) : null}
    </div>
  )
}

export default MaterialLogs
