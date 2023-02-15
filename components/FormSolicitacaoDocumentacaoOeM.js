import React, { useState } from "react";

function FormSolicitacaoDocumentacaoOeM() {
  const [images, setImages] = useState({});
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DOCUMENTAÇÃO
      </span>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <div className="w-fit flex flex-col items-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            PROPOSTA COMERCIAL ATUALIZADA
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.propostaComercial ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.propostaComercial.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal">
                    Adicione o arquivo aqui
                  </span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  propostaComercial: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            DOCUMENTO COM FOTO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.documentoComFoto ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.documentoComFoto.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal">
                    Adicione o arquivo aqui
                  </span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  documentoComFoto: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        {dados.tipoDaInstalacao == "URBANO" && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                IPTU
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.iptu ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.iptu.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      iptu: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
        {dados.tipoDaInstalacao == "RURAL" && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                CAR
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.car ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.car.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      car: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                MATRÍCULA
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.matricula ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.matricula.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      matricula: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
        {dados.tipoDoTitular == "PESSOA JURIDICA" && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                CONTRATO SOCIAL
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.contratoSocial ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.contratoSocial.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      contratoSocial: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                CARTÃO CNPJ
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.cartaoCnpj ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.cartaoCnpj.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      cartaoCnpj: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                COMPROVANTE DE ENDEREÇO - REPRESENTANTE LEGAL
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.comprovanteEnderecoRepresentante ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.comprovanteEnderecoRepresentante.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      comprovanteEnderecoRepresentante: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label
                className="ml-2 text-center text-[#15599a] font-bold"
                htmlFor="propostaComercial"
              >
                DOCUMENTO COM FOTO DE TODOS OS SÓCIOS
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {images.documentoComFotoSocios ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {images.documentoComFotoSocios.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal">
                        Adicione o arquivo aqui
                      </span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) =>
                    setImages({
                      ...images,
                      documentoComFotoSocios: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FormSolicitacaoDocumentacaoOeM;
