import React, { useEffect, useState } from 'react'

import { parseCookies } from 'nookies'
import EtapaTelhado from './etapasConferenciaMontagem/EtapaTelhado'
import EtapaMontagemMecanica from './etapasConferenciaMontagem/EtapaMontagemMecanica'
import EtapaLancamentoCabosConexoes from './etapasConferenciaMontagem/EtapaLancamentoCabosConexoes'
import EtapaFinalizacao from './etapasConferenciaMontagem/EtapaFinalizacao'
import EtapaEntrada from './etapasConferenciaMontagem/EtapaEntrada'
function ConferenciaMontagemOS({ session, order, closeModal, queryKey }) {
  const [stage, setStage] = useState(0)

  const [msg, setMsg] = useState({ text: '', color: '' })
  const cidadesGoias = [
    'CALDAS NOVAS', // GO
    'PORTEIRÃO', // GO
    'SÃO SIMÃO', // GO
    'INACIOLÂNDIA', // GO
    'TRINDADE', // GO
    'ITUMBIARA', // GO
    'QUIRINÓPOLIS', // GO
    'PARANAIGUARA', // GO
    'CATALÃO', // GO
    'CACHOEIRA ALTA', // GO
  ]

  useEffect(() => {
    const cookies = parseCookies(null)
    const stageCookie = cookies[`STAGE-${order._id}`]
    console.log('COOKIES', stageCookie)
    if (stageCookie) {
      let stage = stageCookie ? Number(stageCookie) : 0
      console.log('STAGE', stage)
      setStage(stage)
    }
  }, [])
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="text-center text-xl font-bold text-[#15599a]">CONFERÊNCIA DE FECHAMENTO DA OS</h1>
      {stage == 0 && <EtapaEntrada session={session} order={order} next={() => setStage((prev) => prev + 1)} />}
      {stage == 1 && <EtapaTelhado session={session} order={order} next={() => setStage((prev) => prev + 1)} />}
      {stage == 2 && <EtapaMontagemMecanica session={session} order={order} next={() => setStage((prev) => prev + 1)} />}
      {stage == 3 && <EtapaLancamentoCabosConexoes session={session} order={order} next={() => setStage((prev) => prev + 1)} />}
      {stage == 4 && (
        <EtapaFinalizacao session={session} order={order} next={() => setStage((prev) => prev + 1)} closeModal={closeModal} queryKey={queryKey} />
      )}
      {msg.text && <p className={`text-center text-xs italic ${msg.color} mt-2`}>{msg.text}</p>}
    </div>
  )
}

export default ConferenciaMontagemOS
