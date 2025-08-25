import React from 'react'

function AttachFile({ files, setFiles, clientIdentifier }) {
  const isCPF = clientIdentifier.length == 14
  const isCNPJ = clientIdentifier.length == 18
  if (clientIdentifier.length < 14)
    return (
      <div className="flex w-full flex-col gap-2">
        <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">ANEXO DE ARQUIVOS</h1>
        <p className="py-2 text-center text-sm text-red-500 italic">Preencha um CPF/CNPJ válido.</p>
      </div>
    )
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h1 className="bg-primary/80 mt-4 w-full rounded-md p-2 text-center font-bold text-white">ANEXO DE ARQUIVOS</h1>
      {isCPF ? (
        <>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'comprovanteEndereco'} className="font-sans font-bold text-[#353432]">
              COMPROVANTE DE ENDEREÇO
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.comprovanteEndereco ? files.comprovanteEndereco.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, comprovanteEndereco: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'comprovanteEndereco'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'comprovanteRenda'} className="font-sans font-bold text-[#353432]">
              COMPROVANTE DE RENDA
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.comprovanteRenda ? files.comprovanteRenda.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, comprovanteRenda: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'comprovanteRenda'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'documentoPessoal'} className="font-sans font-bold text-[#353432]">
              DOCUMENTO PESSOAL (COM CPF/CNPJ)
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.documentoPessoal ? files.documentoPessoal.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, documentoPessoal: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'documentoPessoal'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
        </>
      ) : null}
      {isCNPJ ? (
        <>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'cartaoCNPJ'} className="font-sans font-bold text-[#353432]">
              CARTÃO CNPJ
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.cartaoCNPJ ? files.cartaoCNPJ.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, cartaoCNPJ: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'cartaoCNPJ'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'contratoSocial'} className="font-sans font-bold text-[#353432]">
              CONTRATO SOCIAL
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.contratoSocial ? files.contratoSocial.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, contratoSocial: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'contratoSocial'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'comprovanteEndereco'} className="font-sans font-bold text-[#353432]">
              COMPROVANTE DE ENDEREÇO DA INSTALAÇÃO
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.comprovanteEndereco ? files.comprovanteEndereco.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, comprovanteEndereco: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'comprovanteEndereco'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'comprovanteRenda'} className="font-sans font-bold text-[#353432]">
              COMPROVANTE DE RENDA (REPRESENTANTE LEGAL)
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.comprovanteRenda ? files.comprovanteRenda.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, comprovanteRenda: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'comprovanteRenda'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'declaracaoFaturamento'} className="font-sans font-bold text-[#353432]">
              DECLARAÇÃO DE FATURAMENTO (12 MESES)
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.declaracaoFaturamento ? files.declaracaoFaturamento.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, declaracaoFaturamento: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'declaracaoFaturamento'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
          <div className="flex w-[50%] flex-col lg:w-full">
            <label htmlFor={'documentoPessoal'} className="font-sans font-bold text-[#353432]">
              DOCUMENTO PESSOAL (REPRESENTANTE LEGAL)
            </label>
            <div className="bg-primary/20 relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center text-sm font-normal text-gray-400">
                    {files.documentoPessoal ? files.documentoPessoal.name : `Anexe aqui o comprovante de endereço...`}
                  </span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  setFiles((prev) => ({ ...prev, documentoPessoal: e.target.files ? e.target.files[0] : null }))
                }}
                className="h-full w-full opacity-0"
                type="file"
                id={'documentoPessoal'}
                accept={'.png, .jpeg, .jpg, .pdf, .docx, .doc'}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default AttachFile
