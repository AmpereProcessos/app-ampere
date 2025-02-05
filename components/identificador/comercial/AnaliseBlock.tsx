import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdDocument, IoMdPower } from 'react-icons/io'
import { FaSolarPanel, FaUserAlt } from 'react-icons/fa'
import { ImPower } from 'react-icons/im'
import FileLinkBlock from '../../utils/FileLinkBlock'
import { formatDecimalPlaces, formatLongString, formatToMoney } from '../../../utils/constants'
import { MdElectricMeter, MdOutlineAttachMoney, MdRoofing } from 'react-icons/md'
import { BsHouse } from 'react-icons/bs'
import ProposeProjectVinculation from './ProposeProjectVinculation'
import { TComercialAnalyticalItem } from '@/pages/api/projects/analitico/comercial'
import { TProject } from '@/utils/schemas/projects'

function getBarColor(project: TComercialAnalyticalItem) {
  const contractValue = project.valorContrato
  const proposeValue = project.proposta.valor
  const valueIsEqual = Math.abs(contractValue - (proposeValue || 0)) <= 5

  const contractPeakPower = project.potenciaPico
  const proposePeakPower = project.proposta.potenciaPico
  const powerIsEqual = Math.abs(contractPeakPower - (proposePeakPower || 0)) <= 5
  if (valueIsEqual && powerIsEqual) return 'bg-green-500'
  return 'bg-red-500'
}

type AnaliseBlockProps = {
  project: TComercialAnalyticalItem
}
function AnaliseBlock({ project }: AnaliseBlockProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  function renderLinks({ links, category }: { links: TComercialAnalyticalItem['links']; category: string }) {
    if (!links) return null
    return (
      <div className="mt-4 flex w-full flex-wrap justify-around gap-3 px-2">
        {/**@ts-ignore */}
        {links[category]?.map((link: any, index: number) => (
          <div key={`${link.title} - ${index}`} className="w-full lg:w-[400px]">
            <FileLinkBlock obj={link} prefix={project.nome} deleteFile={() => {}} showDeleteMenu={false} />{' '}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex w-full gap-2 rounded-md border border-gray-300 shadow-sm">
      <div className={`h-full w-[7px] ${getBarColor(project)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col p-3">
        <div className="flex w-full items-center gap-2">
          <div className="flex min-w-[350px] flex-col">
            <div className="flex items-center gap-1">
              <h1 className="font-black text-[#fead41]">{project.identificadorCRM}</h1>
              <h1 className="font-bold leading-none tracking-tight">{project.nome}</h1>
            </div>
            <p className="text-xs text-gray-500">{project.tipoServico}</p>
          </div>
          <div className="flex grow items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserAlt />
              <p className="font-medium text-gray-500">{project.vendedor}</p>
            </div>
            <div className="flex items-center gap-2">
              <ImPower />
              <p className="font-medium text-gray-500">{formatDecimalPlaces(project.potenciaPico)}W</p>
            </div>
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="font-medium text-gray-500">{formatToMoney(project.valorProjeto)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="font-medium text-gray-500">{formatToMoney(project.valorPadrao || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <BsHouse />
              <p className="font-medium text-gray-500">{formatToMoney(project.valorEstrutura || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="font-medium text-gray-500">{formatToMoney(project.valorContrato)}</p>
            </div>
          </div>
        </div>
        {project.proposta.id ? (
          <div className="mt-1 flex w-full flex-col rounded bg-gray-100 p-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <IoMdDocument />
                <h1 className="text-xs font-medium text-gray-500">PROPOSTA VINCULADA</h1>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="flex min-w-[350px] flex-col">
                <h1 className="text-sm font-bold leading-none tracking-tight text-[#15599a]">{formatLongString(project.proposta.nome || '', 30)}</h1>
              </div>
              <div className="flex grow items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImPower />
                  <p
                    className={`${
                      Math.abs(project.potenciaPico - (project.proposta.potenciaPico || 0)) < 5 ? 'text-green-500' : 'text-[#F31559]'
                    } font-medium`}
                  >
                    {project.proposta.potenciaPico}W
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineAttachMoney />
                  <p
                    className={`${
                      Math.abs(project.valorContrato - (project.proposta.valor || 0)) < 5 ? 'text-green-500' : 'text-[#F31559]'
                    } font-medium`}
                  >
                    {formatToMoney(project.proposta.valor || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center p-1">
            <h1 className="rounded border border-red-500 p-1 text-xs font-bold text-[#F31559]">SEM PROPOSTA VINCULADA</h1>
            <ProposeProjectVinculation
              idProject={project.id}
              idSolicitation={project.idSolicitacaoContrato}
              signatureDate={project.dataAssinatura}
              contractRequestDate={project.dataSolicitacao}
            />
          </div>
        )}
        <div className="mt-1 flex w-full items-center justify-start">
          <div className="flex items-center gap-1">
            {showAdditionalInfo ? (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(false)} />
              </div>
            ) : (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(true)} />
              </div>
            )}
            <p className="text-xs text-gray-500">MAIS INFORMAÇÕES</p>
          </div>
        </div>
        {showAdditionalInfo ? (
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xs text-gray-600">CPF/CNPJ</h1>
                <h1 className="text-center text-sm font-medium text-gray-600">{project.cpfCnpj ? project.cpfCnpj : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xs text-gray-600">CIDADE</h1>
                <h1 className="text-center text-sm font-medium text-gray-600">{project.cidade ? project.cidade : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xs text-gray-600">BAIRRO</h1>
                <h1 className="text-center text-sm font-medium text-gray-600">{project.bairro ? project.bairro : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xs text-gray-600">LOGRADOURO</h1>
                <h1 className="text-center text-sm font-medium text-gray-600">{project.logradouro ? project.logradouro : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xs text-gray-600">Nº</h1>
                <h1 className="text-center text-sm font-medium text-gray-600">
                  {project.numeroOuIdentificador ? project.numeroOuIdentificador : '-'}
                </h1>
              </div>
            </div>
            {project.links && (
              <div className="mt-4 grid w-full grid-cols-1 gap-2">
                {Object.keys(project.links).map((category, index) =>
                  project.links && project.links[category as keyof TProject['links']]?.length > 0 ? (
                    <div key={index} className="flex w-full flex-col">
                      <h1 className="w-full rounded-tl-md rounded-tr-md bg-cyan-700 p-1 text-center font-bold text-white">
                        {category.toUpperCase()}
                      </h1>

                      {renderLinks({ links: project.links[category], category: category })}
                      {/* {project.links[category].map((obj, index2) => (
                <div className="w-full lg:w-[50%]">
                <FileLinkBlock
                key={`${obj.title} - ${index2}`}
                obj={obj}
                prefix={infoHolder.nomeDoContrato}
                deleteFile={(obj) => deleteFile(obj, category)}
                />
                </div>
                ))} */}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )

  // return (
  //   <div className="flex w-full flex-col border border-gray-200 p-1">
  //     <div className="grid w-full grid-cols-8 items-center">
  //       <div className="col-span-2 flex flex-col">
  //         <div className="col-span-2 flex items-center gap-2">
  //           {showAdditionalInfo ? (
  //             <div className="cursor-pointer text-gray-600 hover:text-blue-400">
  //               <IoMdArrowDropupCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(false)} />
  //             </div>
  //           ) : (
  //             <div className="cursor-pointer text-gray-600 hover:text-blue-400">
  //               <IoMdArrowDropdownCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(true)} />
  //             </div>
  //           )}
  //           <div className="flex items-center gap-2 text-sm">
  //             <strong className="text-[#fead61]">({project.identificadorCRM})</strong>
  //             {project.nome} <strong className="text-[#15599a]">{project.identificador}</strong> -{' '}
  //           </div>
  //         </div>
  //         {project.proposta ? <h1 className={`text-center text-xs font-medium text-blue-700`}>{project.proposta.nome}</h1> : null}
  //       </div>

  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">TIPO DE SERVIÇO</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{project.tipoServico}</h1>
  //       </div>
  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">POTÊNCIA PICO</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{project.potenciaPico}kWp</h1>
  //         {project.proposta ? (
  //           <h1 className={`${project.proposta.potenciaPico == project.potenciaPico ? 'text-green-500' : 'text-red-500'} text-xs font-medium`}>
  //             {project.proposta.potenciaPico}
  //           </h1>
  //         ) : null}
  //       </div>
  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">VALOR DO PROJETO</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{formatToMoney(project.valorProjeto)}</h1>
  //       </div>
  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">VALOR DO PADRÃO</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{formatToMoney(project.valorPadrao)}</h1>
  //       </div>
  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">VALOR DA ESTRUTURA</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{formatToMoney(project.valorEstrutura)}</h1>
  //       </div>
  //       <div className="col-span-1 flex flex-col items-center">
  //         <h1 className="text-center text-xs text-gray-600">VALOR DO CONTRATO</h1>
  //         <h1 className="text-center text-sm font-medium text-gray-600">{formatToMoney(project.valorContrato)}</h1>
  //         {project.proposta ? (
  //           <h1 className={`${project.proposta.valor == project.valorContrato ? 'text-green-500' : 'text-red-500'} text-xs font-medium`}>
  //             {formatToMoney(project.proposta.valor)}
  //           </h1>
  //         ) : null}
  //       </div>
  //     </div>
  //     {showAdditionalInfo ? (
  //       <div className="flex w-full flex-col">
  //         <div className="flex items-center justify-around">
  //           <div className="flex flex-col items-center">
  //             <h1 className="text-center text-xs text-gray-600">CPF/CNPJ</h1>
  //             <h1 className="text-center text-sm font-medium text-gray-600">{project.cpfCnpj ? project.cpfCnpj : '-'}</h1>
  //           </div>
  //           <div className="flex flex-col items-center">
  //             <h1 className="text-center text-xs text-gray-600">CIDADE</h1>
  //             <h1 className="text-center text-sm font-medium text-gray-600">{project.cidade ? project.cidade : '-'}</h1>
  //           </div>
  //           <div className="flex flex-col items-center">
  //             <h1 className="text-center text-xs text-gray-600">BAIRRO</h1>
  //             <h1 className="text-center text-sm font-medium text-gray-600">{project.bairro ? project.bairro : '-'}</h1>
  //           </div>
  //           <div className="flex flex-col items-center">
  //             <h1 className="text-center text-xs text-gray-600">LOGRADOURO</h1>
  //             <h1 className="text-center text-sm font-medium text-gray-600">{project.logradouro ? project.logradouro : '-'}</h1>
  //           </div>
  //           <div className="flex flex-col items-center">
  //             <h1 className="text-center text-xs text-gray-600">Nº</h1>
  //             <h1 className="text-center text-sm font-medium text-gray-600">{project.numeroOuIdentificador ? project.numeroOuIdentificador : '-'}</h1>
  //           </div>
  //         </div>
  //         {/* {project.links && (
  //           <div className="flex justify-center gap-2 gap-y-4 mt-3 flex-wrap">
  //             {Object.keys(project.links).map((category, index) =>
  //               project.links[category]?.length > 0 ? (
  //                 <div key={index} className="flex flex-col w-full lg:w-[45%] p-1 shadow-sm">
  //                   <h1 className="font-bold text-center text-green-500">{category.toUpperCase()}</h1>
  //                   <div className="flex flex-col items-center gap-1">
  //                     {project.links[category].map((obj, index2) => (
  //                       <FileLinkBlock key={index2} obj={obj} deleteFile={(obj) => alert('Exclusão de arquivos não permitida nessa área.')} />
  //                     ))}
  //                   </div>
  //                 </div>
  //               ) : null
  //             )}
  //           </div>
  //         )} */}
  //       </div>
  //     ) : null}
  //   </div>
  // )
}

export default AnaliseBlock
