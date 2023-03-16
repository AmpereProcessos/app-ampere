import React from "react";
import Logo from "../../../utils/empty-logo.png";
import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
function PDFFormulario({ info, backTo }) {
  console.log(backTo);
  function getTotalCost() {
    var total = 0;
    for (let i = 0; i < info.materiais.length; i++) {
      if (info.materiais[i].diff) {
        total = total + info.materiais[i].diff * info.materiais[i].precoUnit;
      } else {
        total =
          total +
          (info.materiais[i].qtdeSaida - info.materiais[i].qtdeDevolucao) *
            info.materiais[i].precoUnit;
      }
    }
    return total.toFixed(2);
  }
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-4">
      <h1 className="text-center font-bold text-xl mb-6">
        REQUISIÇÃO DE SAÍDA DE MATERIAIS
      </h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href={backTo ? `/${backTo}` : "/almoxarifado/formularios"}>
            <div className="flex justify-center items-center">
              <Image height="80px" width="240px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold text-sm">
              AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME
            </p>
            <p className="text-center font-bold text-sm">
              CNPJ <br />
              27.901.968/0001-45
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-center pr-2 text-sm">ID DO FORMULÁRIO</p>
            <p className="text-center pr-2 text-sm">{info._id}</p>
          </div>
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2 text-sm">DATA DE ABERTURA</p>
            <p className="text-center pr-2 text-sm">
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
        <div className="flex flex-col px-2">
          <div className="grid grid-cols-6 gap-x-2 border-b bg-gray-800">
            <p className="text-sm col-span-2 font-medium text-white px-6 py-4 text-center">
              PRODUTO
            </p>
            <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
              RETIRADA
            </p>
            <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
              DEVOLUÇÃO
            </p>
            <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
              DIFERENÇA
            </p>
            <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
              VALOR
            </p>
          </div>
          {info.materiais.map((material, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-x-2 border-b border-x border-gray-700"
            >
              <p className="col-span-2 py-4 text-center whitespace-nowrap text-xs font-medium text-gray-900">
                {material.nome}
              </p>
              <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                {material.qtdeSaida}
              </p>
              <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
              </p>
              <p className="text-sm col-span-1  text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                {material.diff
                  ? material.diff.toFixed(2)
                  : (material.qtdeSaida - material.qtdeDevolucao).toFixed(2)}
              </p>
              <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                R$
                {material.diff
                  ? (material.diff * material.precoUnit)
                      .toFixed(2)
                      .replace(".", ",")
                  : (
                      (material.qtdeSaida - material.qtdeDevolucao) *
                      material.precoUnit
                    )
                      .toFixed(2)
                      .replace(".", ",")}
              </p>
            </div>
          ))}
          <div className="grid grid-cols-6 gap-x-2  border-b border-x border-gray-700">
            <p className="px-6 py-4 col-span-2 text-center whitespace-nowrap text-sm font-medium text-gray-900">
              TOTAL
            </p>
            <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
              -
            </p>
            <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
              -
            </p>
            <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
              -
            </p>
            <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
              R$
              {getTotalCost()}
            </p>
          </div>
          {/**<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full border border-gray-700 text-center">
                  <thead className="border-b bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        PRODUTO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        RETIRADA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DEVOLUÇÃO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DIFERENÇA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        VALOR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.materiais.map((material, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.nome}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeSaida}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.diff ? material.diff.toFixed(2) : "-"}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          R$
                          {(material.diff * material.precoUnit)
                            .toFixed(2)
                            .replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b border-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        R$
                        {getTotalCost()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PDFFormulario;
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const backTo = query.backTo ? query.backTo : "";
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("formularios");
  let form = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(form));
  // Pass data to the page via props
  return { props: { info, backTo } };
}
