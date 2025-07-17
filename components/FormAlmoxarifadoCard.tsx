import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCity, FaUser, FaUserAlt, FaUsers } from "react-icons/fa";
import { BsCalendarPlus, BsFillCalendarCheckFill } from "react-icons/bs";
import { TbExternalLink } from "react-icons/tb";
import { TWarehouseFormularyDTO } from "@/utils/schemas/warehouse-formularies";
import { formatDateAsLocale } from "@/utils/methods/formatting";

type FormAlmoxarifadoCardProps = {
	form: TWarehouseFormularyDTO;
	openModal: (id: string) => void;
};
function FormAlmoxarifadoCard({ form, openModal }: FormAlmoxarifadoCardProps) {
	function getCardColor(status: boolean) {
		if (status == true)
			return (
				<div className="flex min-w-fit items-center gap-2 rounded-full bg-green-600 px-2 py-1 ">
					<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">FINALIZADO</h1>
				</div>
			);

		return (
			<div className="flex min-w-fit items-center gap-2 rounded-full bg-blue-600 px-2 py-1 ">
				<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">EM ABERTO</h1>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col rounded-md border border-gray-300 p-3 lg:w-[450px]">
			<div className="flex w-full items-center justify-between gap-2">
				<h1 onClick={(e) => openModal(form._id)} className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm">
					{form.nomeDoContrato || form.nomeTerceiro || "NÃO DEFINIDO"}
				</h1>
				{getCardColor(!!form.efetivado)}
			</div>

			<div className="mt-1 flex w-full flex-wrap items-center justify-between">
				<div className="flex items-center gap-2">
					<FaCity />
					<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{form.cidade}</p>
				</div>
				<div className="flex items-center gap-2 text-blue-800">
					<FaUsers color={"rgb(30,64,175)"} />
					<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{form.equipeResp}</p>
				</div>
			</div>
			<div className="mt-2 flex w-full items-center justify-between">
				<div className={`flex items-center gap-2`}>
					<BsCalendarPlus />
					<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(form.abertura)}</p>
				</div>
				<div className="flex items-center justify-center gap-2">
					<FaUser />
					<p className="text-xs font-medium text-gray-500">{form.responsavel}</p>
				</div>
			</div>
		</div>
	);

	// if (inViewRef) {
	//   return (
	//     <div
	//       ref={inViewRef}
	//       onClick={() => {
	//         handleOpenModal(formInfo)
	//       }}
	//       className={`shdadow-lg flex w-full cursor-pointer flex-col justify-between border border-gray-300 p-3 hover:bg-blue-100 lg:w-[450px] ${getCardColor(
	//         formInfo.efetivado
	//       )}`}
	//     >
	//       <div className="mb-1 flex items-center justify-between font-medium">
	//         <p className="text-xs text-gray-700">{formInfo.nomeDoContrato ? formInfo.nomeDoContrato : formInfo.nomeTerceiro}</p>
	//         <p className="text-xs text-[#15599a]">#{formInfo.codigoProjeto ? formInfo.codigoProjeto : '-'}</p>
	//       </div>
	//       <div className="flex w-full items-center justify-between">
	//         <div className="flex items-center justify-start gap-2 text-xs">
	//           <FaCity color="rgb(59,130,246)" size={'20px'} />
	//           <p>{form.cidade ? form.cidade : '-'}</p>
	//         </div>
	//         <div className="flex items-center justify-end gap-2 text-xs">
	//           <p>{form.equipeResp}</p>
	//           <FaUsers color="rgb(245,158,11)" size={'20px'} />
	//         </div>
	//       </div>
	//       <div className="mt-2 flex items-center justify-between">
	//         <div className="flex flex-col items-start gap-1">
	//           <span className="text-xxs">RESPONSÁVEL</span>
	//           <div className="flex items-center gap-1 text-xs text-gray-600">
	//             <FaUserAlt />
	//             <p className="">{formInfo.responsavel && formInfo.responsavel}</p>
	//           </div>
	//         </div>
	//         {form.efetivado && (
	//           <div className="flex items-center">
	//             <Link href={`/almoxarifado/pdfFormulario/${form._id}`}>
	//               <a
	//                 onClick={(e) => e.stopPropagation()}
	//                 className="h-[30px] rounded border border-[#fead61] p-1 font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black"
	//               >
	//                 <TbExternalLink />
	//               </a>
	//             </Link>
	//           </div>
	//         )}
	//         <div className="flex flex-col items-end gap-1">
	//           <span className="text-xxs">SAÍDA DE OBRA</span>
	//           {msg.text ? (
	//             <p className={`text-xs italic ${msg.color}`}>{msg.text}</p>
	//           ) : formInfo.saidaDeObra ? (
	//             <div className="flex items-center justify-end gap-2">
	//               <p className="text-xs text-gray-600">{dayjs(formInfo.saidaDeObra).add(3, 'hour').format('DD/MM/YYYY')}</p>
	//               <BsFillCalendarCheckFill />
	//             </div>
	//           ) : formInfo.efetivado && form.idPai ? (
	//             <div
	//               onClick={(e) => fetchSaidaDeObra(e, form.idPai)}
	//               className="flex cursor-pointer items-center rounded border border-black p-1 font-bold text-black transition duration-300 ease-in-out hover:scale-105 hover:bg-black hover:text-white"
	//             >
	//               <p className="text-xs">BUSCAR DATA</p>
	//               {/* {icon} */}
	//             </div>
	//           ) : (
	//             <p className="text-xs text-gray-600">-</p>
	//           )}
	//         </div>
	//       </div>
	//     </div>
	//   )
	// } else
	//   return (
	//     <div
	//       onClick={() => {
	//         handleOpenModal(formInfo)
	//       }}
	//       className={`shdadow-lg flex w-full cursor-pointer flex-col justify-between border border-gray-300 p-3 hover:bg-blue-100 lg:w-[450px] ${getCardColor(
	//         formInfo.efetivado
	//       )}`}
	//     >
	//       <div className="mb-1 flex items-center justify-between font-medium">
	//         <p className="text-xs text-gray-700">{formInfo.nomeDoContrato ? formInfo.nomeDoContrato : formInfo.nomeTerceiro}</p>
	//         <p className="text-xs text-[#15599a]">#{formInfo.codigoProjeto ? formInfo.codigoProjeto : '-'}</p>
	//       </div>
	//       <div className="flex w-full items-center justify-between">
	//         <div className="flex items-center justify-start gap-2 text-xs">
	//           <FaCity color="rgb(59,130,246)" size={'20px'} />
	//           <p>{form.cidade ? form.cidade : '-'}</p>
	//         </div>
	//         <div className="flex items-center justify-end gap-2 text-xs">
	//           <p>{form.equipeResp}</p>
	//           <FaUsers color="rgb(245,158,11)" size={'20px'} />
	//         </div>
	//       </div>
	//       <div className="mt-2 flex items-center justify-between">
	//         <div className="flex flex-col items-start gap-1">
	//           <span className="text-xxs">RESPONSÁVEL</span>
	//           <div className="flex items-center gap-1 text-gray-500">
	//             <FaUserAlt size={'17px'} />
	//             <p className="text-xs">{formInfo.responsavel && formInfo.responsavel}</p>
	//           </div>
	//         </div>
	//         {form.efetivado && (
	//           <div className="flex items-center">
	//             <Link href={`/almoxarifado/pdfFormulario/${form._id}`}>
	//               <a
	//                 onClick={(e) => e.stopPropagation()}
	//                 className="h-[30px] rounded border border-[#fead61] p-1 font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black"
	//               >
	//                 <TbExternalLink />
	//               </a>
	//             </Link>
	//           </div>
	//         )}
	//         <div className="flex flex-col items-end gap-1">
	//           <span className="text-xxs">SAÍDA DE OBRA</span>
	//           {msg.text ? (
	//             <p className={`text-xs italic ${msg.color}`}>{msg.text}</p>
	//           ) : formInfo.saidaDeObra ? (
	//             <div className="flex items-center justify-end gap-2 text-gray-500">
	//               <p className="text-xs">{dayjs(formInfo.saidaDeObra).add(3, 'hour').format('DD/MM/YYYY')}</p>
	//               <BsFillCalendarCheckFill size={'17px'} />
	//             </div>
	//           ) : formInfo.efetivado && form.idPai ? (
	//             <div
	//               onClick={(e) => fetchSaidaDeObra(e, form.idPai)}
	//               className="flex cursor-pointer items-center rounded border border-black p-1 font-bold text-black transition duration-300 ease-in-out hover:scale-105 hover:bg-black hover:text-white"
	//             >
	//               <p className="text-xs">BUSCAR DATA</p>
	//               {/* {icon} */}
	//             </div>
	//           ) : (
	//             <p className="text-xs text-gray-600">-</p>
	//           )}
	//         </div>
	//       </div>
	//       <div className="flex w-full items-center justify-center gap-2">
	//         <p className="text-xs italic text-gray-500">ABERTO EM:</p>
	//         <p className="text-xs italic text-gray-500">{form.abertura ? dayjs(form.abertura).format('DD/MM/YYYY HH:mm') : ''}</p>
	//       </div>
	//     </div>
	//   )
}

export default FormAlmoxarifadoCard;
