import Image from "next/image";
import UnauthorizedSVG from "@/utils/svgs/unauthorized.svg";
export default function UnauthorizedComponent() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center grow">
			<div className="w-[70%] h-[70%] relative min-w-[70%] min-h-[70%]">
				<Image src={UnauthorizedSVG} alt="Não autorizado !" fill={true} />
			</div>
		</div>
	);
}
