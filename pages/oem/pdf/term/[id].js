import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Logo from "../../../../utils/whitelogo.png";
import connectToDatabase2 from "../../../../utils/ossDb";
import { ObjectId } from "mongodb";
function termPDF({ info }) {
  console.log(info);
  return (
    <div className="w-[21cm] h-[29.7cm] p-4">
      <Link href="/oem/serviceOrder">
        <div className="flex justify-center">
          <Image height="70px" width="70px" src={Logo} />
        </div>
      </Link>
      <h1 className="mt-6 text-center font-bold">
        TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA
      </h1>
      <div className="mt-8 px-4">
        <p className="text-center font-raleway">
          Eu, {info.generalInfos.clientName}, inscrito sob o número de CPF/CNPJ
          <strong> {info.generalInfos.cpf_cnpj}</strong>, declaro que a equipe
          técnica da empresa{" "}
          <strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>,
          inscrita sob o CNPJ nº 27.901.968/0001-45, realizou no dia{" "}
          {new Date(info.generalInfos.date).toLocaleDateString()} à manutenção
          preventiva, prevista em contrato, do sistema fotovoltaico de{" "}
          {info.generalInfos.peakPot} kWp instalado na{" "}
          <strong>
            {info.generalInfos.address}, Nº {info.generalInfos.number},{" "}
            {info.generalInfos.district}
          </strong>{" "}
          , no município de <strong>{info.generalInfos.city}</strong>.
        </p>
        <p className="mt-12">Por ser verdade assino este termo</p>
        <p className="mt-6 text-end">
          Ituiutaba, {new Date(info.generalInfos.date).toLocaleDateString()}
        </p>
        <div className="mt-32 flex flex-col">
          <hr className="border-t-2 border-black" />
          <p className="text-center mt-4 font-raleway font-bold">TÉCNICO</p>
        </div>
        <div className="mt-32 flex flex-col">
          <hr className="border-t-2 border-black" />
          <p className="text-center mt-4 font-raleway font-bold">CLIENTE</p>
        </div>
        <div className="mt-72">
          <p className="text-center font-raleway">
            Avenida Nove, 233 - Centro, Ituiutaba-MG
          </p>
          <p className="text-center">ampereenergiascomercial@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;

  const db = await connectToDatabase2(process.env.DB_KEY);
  const collection = db.collection("data");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}
export default termPDF;
