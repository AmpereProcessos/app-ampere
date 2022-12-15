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
  console.log(tipo);
  return (
    <>
      {/** <LaudoTecnicoUrbano /> */}
      {tipo == "LAUDO TÉCNICO(URBANO)" && <LaudoTecnicoUrbano info={info} />}
      {/*{tipo == "LAUDO TÉCNICO(URBANO)" && <LaudoSimplesUrbano info={info} />}*/}
    </>
  );
}

export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const tipo = query.tipo;
  console.log(tipo);
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
