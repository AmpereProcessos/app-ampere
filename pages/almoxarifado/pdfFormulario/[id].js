import React from "react";
import Logo from "../../../utils/empty-logo.png";
import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
function PDFFormulario({ info }) {
  console.log(info);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-6">
      <h1 className="text-center font-bold text-xl mb-6">
        REQUISIÇÃO DE SAÍDA DE MATERIAIS
      </h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/almoxarifado/formularios">
            <div className="flex justify-center items-center">
              <Image height="80px" width="100px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">
              AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME
            </p>
            <p className="text-center font-bold">
              CNPJ <br />
              27.901.968/0001-45
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-center pr-2 text-sm">ID DO FORMULÁRIO</p>
            <p className="text-center pr-2">{info._id}</p>
          </div>
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2 text-sm">DATA DE ABERTURA</p>
            <p className="text-center pr-2">
              {info.dataEfetivacao
                ? dayjs(info.dataEfetivacao).format("DD/MM/YYYY HH:mm")
                : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 border border-black w-full mt-4 py-4">
        <div className="flex justify-center">
          <h1 className="font-bold text-xl">
            {info.nomeDoContrato} - (#{info.codigoProjeto})
          </h1>
        </div>
        <div class="flex flex-col px-2">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full border border-gray-700 text-center">
                  <thead class="border-b bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        class="text-sm font-medium text-white px-6 py-4"
                      >
                        PRODUTO
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-white px-6 py-4"
                      >
                        RETIRADA
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-white px-6 py-4"
                      >
                        DEVOLUÇÃO
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-white px-6 py-4"
                      >
                        DIFERENÇA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.materiais.map((material, index) => (
                      <tr key={index} class="border-b border-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.nome}
                        </td>
                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeSaida}
                        </td>
                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
                        </td>
                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFFormulario;
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("formularios");
  let form = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(form));
  // Pass data to the page via props
  return { props: { info } };
}
