import React from 'react'
import Image from 'next/image'
import LaudoTecnicoUrbano from '../../../../components/LaudoTecnicoUrbano'
import LaudoSimplesUrbano from '../../../../components/LaudoSimplesUrbano'
import LaudoIntermediarioUrbano from '../../../../components/LaudoIntermediarioUrbano'
import LaudoTecnicoRural from '../../../../components/LaudoTecnicoRural'
import LaudoSimplesRural from '../../../../components/LaudoSimplesRural'
import connectToSolicitacoesDatabase from '../../../../utils/solicitacoesDb'
import { ObjectId } from 'mongodb'
import LaudoFormularioVisitaUrbano from '../../../../components/LaudoFormularioVisitaUrbano'
import LaudoFormularioVisitaRural from '../../../../components/LaudoFormularioVisitaRural'
function Laudo({ info, tipo }) {
  // console.log(info)
  return (
    <>
      {tipo == 'LAUDO TÉCNICO(URBANO)' && <LaudoTecnicoUrbano analysis={info} />}
      {tipo == 'LAUDO SIMPLES(URBANO)' && <LaudoSimplesUrbano analysis={info} />}
      {tipo == 'LAUDO INTERMEDIÁRIO(URBANO)' && <LaudoIntermediarioUrbano analysis={info} />}
      {tipo == 'LAUDO TÉCNICO(RURAL)' && <LaudoTecnicoRural analysis={info} />}
      {tipo == 'LAUDO SIMPLES(RURAL)' && <LaudoSimplesRural analysis={info} />}
      {tipo == 'FORMULÁRIO(URBANO)' && <LaudoFormularioVisitaUrbano analysis={info} />}
      {tipo == 'FORMULÁRIO(RURAL)' && <LaudoFormularioVisitaRural analysis={info} />}
    </>
  )
}

export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id
  const tipo = query.tipo
  const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
  const collection = db.collection('analisesTecnicas')
  let os = await collection.findOne({
    _id: ObjectId(id),
  })
  let info = JSON.parse(JSON.stringify(os))
  // Pass data to the page via props
  return { props: { info, tipo: tipo } }
}

export default Laudo
