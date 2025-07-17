import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import ModalVisitaTecnicaVendedor from "../../components/ModalVisitaTecnicaVendedor";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function VisitasTecnicas({}) {
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/signin");
		},
	});
	const [forms, setForms] = useState([]);
	const [filteredForms, setFilteredForms] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalForm, setModalForm] = useState({});
	function getForms() {
		axios
			.post("/api/solicitacoes/byVendedor", {
				vendedor: session?.user.visualizacao.referencia,
				tipo: "VISITA",
			})
			.then((res) => {
				setForms(res.data);
				setFilteredForms(res.data);
			});
	}
	function getCardColor(statusAprovacao) {
		if (statusAprovacao == "CONCLUIDO") {
			return "bg-green-100";
		} else if (statusAprovacao == "EM ANÁLISE TÉCNICA") {
			return "bg-yellow-100";
		} else if (statusAprovacao == "PENDÊNCIA COMERCIAL") {
			return "bg-cyan-100";
		} else if (statusAprovacao == "VISITA IN LOCO") {
			return "bg-indigo-100";
		} else if (statusAprovacao == "REJEITADA") {
			return "bg-red-300";
		} else {
			return "bg-[#fff]";
		}
	}
	useEffect(() => {
		if (session?.user) {
			getForms();
		}
	}, [session]);
	if (status == "loading") return <LoadingPage />;
	if (status == "authenticated") {
		return (
			<div className="flex grow flex-col bg-[#fff] p-6">
				<div className="flex border-b border-gray-300">
					<h1 className="text-xl font-bold text-[#15599a]">SEUS FORMULÁRIOS DE VISITA TÉCNICA</h1>
				</div>
				<div className="mt-4 flex flex-wrap justify-around gap-3">
					{filteredForms.map((solicitacao) => (
						<div
							onClick={() => {
								setModalForm(solicitacao);
								setModalIsOpen(true);
							}}
							key={solicitacao._id}
							className={`flex w-[250px] cursor-pointer flex-col lg:w-[450px] ${getCardColor(solicitacao.status)} border border-gray-300 p-3 hover:bg-blue-100`}
						>
							<div className="flex justify-center">
								<h1 className="text-xs font-bold text-[#15599a]">{solicitacao.nomeDoCliente ? solicitacao.nomeDoCliente : "-"}</h1>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<span className="text-xxs">VENDEDOR</span>
									<p className="text-xs text-gray-600">{solicitacao.nomeVendedor ? solicitacao.nomeVendedor : "-"}</p>
								</div>
								<div>
									<span className="text-xxs">CIDADE</span>
									<p className="text-xs text-gray-600">{solicitacao.cidade ? solicitacao.cidade : "-"}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<Link href="/publico/formVisitaTecnica">
					<div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
						<p className="text-sm font-bold uppercase">SOLICITAR VISITA</p>
					</div>
				</Link>
				{modalIsOpen && <ModalVisitaTecnicaVendedor info={modalForm} setModalIsOpen={setModalIsOpen} />}
			</div>
		);
	}
}

export default VisitasTecnicas;
