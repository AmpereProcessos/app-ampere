import React from "react";
import { BiSolidError } from "react-icons/bi";
function ErrorPage({ msg }) {
	return (
		<div className="flex grow flex-col items-center justify-center">
			<BiSolidError size={50} />
			<p className="text-primary/60 text-center text-sm font-medium italic">{msg || "Ooops, um erro desconhecido ocorreu. Tente novamente"}</p>
		</div>
	);
}

export default ErrorPage;
