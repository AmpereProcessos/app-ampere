import React from "react";
import Image from "next/image";
import LaudoTecnicoUrbano from "../../../../components/LaudoTecnicoUrbano";
import LaudoSimplesUrbano from "../../../../components/LaudoSimplesUrbano";
import LaudoIntermediarioUrbano from "../../../../components/LaudoIntermediarioUrbano";
import LaudoTecnicoRural from "../../../../components/LaudoTecnicoRural";
import LaudoSimplesRural from "../../../../components/LaudoSimplesRural";
import connectToSolicitacoesDatabase from "../../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
function Laudo({ info, tipo }) {
  return (
    <>
      {tipo == "LAUDO TÉCNICO(URBANO)" && <LaudoTecnicoUrbano info={info} />}
      {tipo == "LAUDO SIMPLES(URBANO)" && <LaudoSimplesUrbano info={info} />}
      {tipo == "LAUDO INTERMEDIÁRIO(URBANO)" && (
        <LaudoIntermediarioUrbano info={info} />
      )}
      {tipo == "LAUDO TÉCNICO(RURAL)" && <LaudoTecnicoRural info={info} />}
      {tipo == "LAUDO SIMPLES(RURAL)" && <LaudoSimplesRural info={info} />}
    </>
  );
}

export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const tipo = query.tipo;
  const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
  const collection = db.collection("visitaTecnica");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info, tipo: tipo } };
}

export default Laudo;
