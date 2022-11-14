import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../utils/whitelogo.png";
import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
function termPDF({ info, index }) {
  return (
    <div className="w-[21cm] h-[29.7cm] p-4">
      <Link href="/oem">
        <div className="flex justify-center">
          <Image height="70px" width="70px" src={Logo} />
        </div>
      </Link>
      <h1 className="mt-6 text-center font-bold">
        TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA
      </h1>
      <div className="mt-8 px-4">
        <p className="text-center font-raleway">
          Eu, Lucas Fernandes, inscrito sob o número de CPF/CNPJ{" "}
          <strong>
            {info.cpf_cnpj ? formatCnpjCpf(info.cpf_cnpj.toString()) : "-"}
          </strong>
          , declaro que a equipe técnica da empresa{" "}
          <strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>,
          inscrita sob o CNPJ nº 27.901.968/0001-45, realizou no dia{" "}
          {new Date(
            info.ordensDeServico[0].dataDeAbertura
          ).toLocaleDateString()}{" "}
          à manutenção preventiva, prevista em contrato, do sistema fotovoltaico
          de {info.sistema.potPico ? info.sistema.potPico : "-"} kWp instalado
          na{" "}
          <strong>
            {info.logradouro ? info.logradouro : "-"}, Nº{" "}
            {info.numeroResidencia ? info.numeroResidencia : "-"},{" "}
            {info.bairro ? info.bairro : "-"}
          </strong>{" "}
          , no município de <strong>{info.cidade ? info.cidade : "-"}</strong>.
        </p>
        <p className="mt-12">Por ser verdade assino este termo</p>
        <p className="mt-6 text-end">
          Ituiutaba, {new Date().toLocaleDateString()}
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
  const index = query.index;
  console.log(id, index);
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info, index: index } };
}
export default termPDF;
