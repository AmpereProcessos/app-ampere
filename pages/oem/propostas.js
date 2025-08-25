import React, { useEffect, useState } from 'react'
import TextInput from '../../components/TextInput'
import SelectInput from '../../components/SelectInput'
import NumberInput from '../../components/NumberInput'
import ListPropostas from '../../components/ListPropostas'
import { cidadesAtendidas, prices, cities } from '../../utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import ModalNewPropostaOeM from '../../components/ModalNewPropostaOeM'
import { FaCity, FaSolarPanel, FaUser } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import { BsFolderFill, BsTelephoneFill } from 'react-icons/bs'
import { IoMdPower } from 'react-icons/io'
import { AiFillThunderbolt } from 'react-icons/ai'
import { GoGraph } from 'react-icons/go'

const stages = {
  1: 'Em apresentação',
  2: 'Em negociação',
  3: 'Em fechamento',
  4: 'Venda fechada',
}

function Propostas() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [newProposeModalIsOpen, setNewProposeModalIsOpen] = useState(false)

  const [proposes, setProposes] = useState({ status: null, data: null })

  async function getProposes() {
    setProposes({ status: 'loading', data: null })
    try {
      const { data } = await axios.get('/api/o&m/proposes')
      let obj = {
        inPresentation: data.filter((p) => p.estagio == 1 || !p.estagio),
        inNegotiation: data.filter((p) => p.estagio == 2),
        closing: data.filter((p) => p.estagio == 3),
        closed: data.filter((p) => p.estagio == 4),
      }
      setProposes({ status: 'success', data: obj })
    } catch (error) {
      setProposes({ status: 'failure', data: [] })
    }
  }
  return null
  // useEffect(() => {
  //   if (session?.user) {
  //     if (!proposes.data) {
  //       getProposes();
  //     }
  //   }
  // }, [session]);
  // if (status == "loading") return <LoadingPage />;
  // if (status == "authenticated") {
  //   return (
  //     <div className="flex flex-col p-6 grow bg-background">
  //       <div className="flex items-center gap-x-2 border-b-2 border-primary/20">
  //         <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
  //           PROPOSTAS DE O&M
  //         </h1>
  //       </div>
  //       {/* {proposes.status == "loading" ? <LoadingPage /> : null}
  //       {proposes.status == "success" ? (
  //         <div className="grow flex gap-2 flex-wrap justify-around p-2">
  //           {proposes.data.map((propose) => (
  //             <div
  //               key={propose._id}
  //               className="flex gap-3 flex-col p-3 w-full lg:w-[400px] h-[175px] border border-primary/20 shadow-md"
  //             >
  //               <div className="w-full flex items-center justify-between">
  //                 <div className="flex items-center gap-2 text-primary/70">
  //                   <HiIdentification style={{ color: "#15599a" }} />
  //                   <h1 className="font-medium">{propose.nomeCliente}</h1>
  //                 </div>
  //                 <div className="flex items-center gap-2 text-primary/70">
  //                   <FaCity style={{ color: "#fead61" }} />
  //                   <h1 className="font-medium">
  //                     {propose.cidade}/{propose.uf}
  //                   </h1>
  //                 </div>
  //               </div>
  //               <div className="flex items-center justify-between">
  //                 <div className="flex items-center gap-2">
  //                   <FaUser style={{ color: "#003d5b" }} />
  //                   <h1 className="text-primary/70 font-medium text-xs">
  //                     {propose.vendedor}
  //                   </h1>
  //                 </div>
  //                 <div className="flex items-center gap-2">
  //                   <BsTelephoneFill style={{ color: "#16B010" }} />
  //                   <h1 className="text-primary/70 font-medium text-xs">
  //                     {propose.telefoneVendedor
  //                       ? propose.telefoneVendedor
  //                       : "NÃO FORNECIDO"}
  //                   </h1>
  //                 </div>
  //               </div>
  //               <div className="flex items-center justify-between">
  //                 <div className="w-1/3 flex items-center justify-start gap-2">
  //                   <FaSolarPanel style={{ color: " rgb(217,119,6)" }} />
  //                   <h1 className="text-primary/70 font-medium text-xs">
  //                     {propose.qtdeModulos} MÓDULOS
  //                   </h1>
  //                 </div>
  //                 <div className="w-1/3 flex items-center justify-center gap-2">
  //                   <GoGraph style={{ color: "blue" }} />
  //                   <h1 className="text-primary/70 font-medium text-xs">
  //                     {propose.eficienciaAtual}%
  //                   </h1>
  //                 </div>
  //                 <div className="w-1/3 flex items-end justify-end gap-2">
  //                   <AiFillThunderbolt style={{ color: "red" }} />
  //                   <h1 className="text-primary/70 font-medium text-xs">
  //                     {propose.potModulos} W
  //                   </h1>
  //                 </div>
  //               </div>
  //               <div className="flex gap-3 items-center justify-center">
  //                 <a
  //                   onClick={() =>
  //                     router.push(`/oem/pdfProposta/${propose._id}`)
  //                   }
  //                   className="text-sm text-blue-300 font-medium cursor-pointer"
  //                 >
  //                   PROPOSTA
  //                 </a>
  //                 <BsFolderFill style={{ color: "rgb(30,64,175)" }} />
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       ) : null}
  //       {proposes.status == "failure" ? (
  //         <p className="text-lg text-red-500 py-2 text-center w-full">
  //           Houve um erro ao buscar as propostas no banco de dados. Por favor,
  //           verifique a conexão com a internet e tente novamente.
  //         </p>
  //       ) : null} */}
  //       <div className="flex py-2 gap-4 mt-5  shadow-lg w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20">
  //         <ListPropostas
  //           title={"Em apresentação"}
  //           listId={1}
  //           fetchProposes={getProposes}
  //           proposes={
  //             proposes.data?.inPresentation ? proposes.data.inPresentation : []
  //           }
  //         />
  //         <ListPropostas
  //           title={"Em negociação"}
  //           listId={2}
  //           fetchProposes={getProposes}
  //           proposes={
  //             proposes.data?.inNegotiation ? proposes.data.inNegotiation : []
  //           }
  //         />
  //         <ListPropostas
  //           title={"Em fechamento"}
  //           listId={3}
  //           fetchProposes={getProposes}
  //           proposes={proposes.data?.closing ? proposes.data.closing : []}
  //         />
  //         <ListPropostas
  //           title={"Vendas Fechadas"}
  //           listId={4}
  //           fetchProposes={getProposes}
  //           proposes={proposes.data?.closed ? proposes.data.closed : []}
  //         />
  //         {/* <ListPropostas
  //           title={"Vendas fechadas"}
  //           listId={4}
  //           fetchProposes={getProposes}
  //           proposes={[]}
  //         /> */}
  //       </div>
  //       <div
  //         onClick={() => setNewProposeModalIsOpen(true)}
  //         className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
  //       >
  //         <p className="uppercase font-bold text-sm">Nova proposta</p>
  //       </div>
  //       {newProposeModalIsOpen ? (
  //         <ModalNewPropostaOeM
  //           getProposes={getProposes}
  //           closeModal={() => setNewProposeModalIsOpen(false)}
  //           isOpen={newProposeModalIsOpen}
  //         />
  //       ) : null}
  //     </div>
  //   );
  // }
}

export default Propostas
