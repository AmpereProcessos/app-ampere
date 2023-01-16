import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { storage } from "../utils/firebase";
import Logo from "../utils/logo.png";
import Link from "next/link";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
import xml2js from "xml2js";
import * as XLSX from "xlsx";
function Teste() {
  const [file, setFile] = useState();
  function handleFileConvertion() {
    const reader = new FileReader();
    // const result = excelToJson({ sourceFile: file });
    // console.log(result);
    console.log(reader);
  }
  function readExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
    promise.then((d) => {
      console.log(d);
      return d;
    });
  }
  function readXML(file) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      console.log(e.target.result);
    };
    // xml2js.parseString(file, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    //   var json = JSON.stringify(result, null, 4);
    //   console.log(JSON.parse(json));
    //   return JSON.parse(json);
    // });
  }
  // useEffect(() => {
  //   xml2js.parseString(dom, (err, result) => {
  //     if (err) {
  //       throw err;
  //     }
  //     var json = JSON.stringify(result, null, 4);
  //     console.log(JSON.parse(json));
  //   });
  // }, []);
  function handleFileInput() {
    // xlsx application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xml text/xml
    if (
      file.type ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      readExcel(file);
    } else if (file.type == "text/xml") {
      readXML(file);
      console.log("XML");
    } else {
      alert("FORMATO INVÁLIDO");
    }
  }
  return (
    <div className="w-[21cm] h-[29.7cm] bg-zinc-100 p-4">
      <div className="flex flex-col items-center">
        <input type={"file"} onChange={(e) => setFile(e.target.files[0])} />
        <button
          className="p-2 rounded border-2 border-[#15599a] text-[#15599a] font-bold hover:border-0 hover:bg-[#15599a] hover:text-white"
          onClick={() => handleFileInput()}
        >
          READ XLSX
        </button>
        {/**<h1 classNameName="text-center text-[#15599a] font-bold">ENTREGUES</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            DESDE ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {entregues.map((obj) => (
            <div classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.compra.statusEntrega == "ENTREGUE"
                  ? obj.compra.dataEntrega
                    ? `${dayjs(new Date()).diff(
                        obj.compra.dataEntrega,
                        "days"
                      )} dias`
                    : `${dayjs(new Date()).diff(
                        obj.compra.previsaoEntrega,
                        "days"
                      )} dias`
                  : "-"}
              </div>
            </div>
          ))}
        </div> */}
        {/* <h1 classNameName="text-center text-[#15599a] font-bold">EM ROTA</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xs p-2 bg-[#15599a] text-white font-bold">
            ATÉ ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {emRota.map((obj, index) => (
            <div key={index} classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {dayjs(obj.compra.previsaoEntrega).diff(new Date(), "day")} dias
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Teste;
