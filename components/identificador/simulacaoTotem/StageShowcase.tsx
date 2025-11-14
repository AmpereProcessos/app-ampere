import { motion } from "framer-motion";

type StageShowcaseProps = {
	stage: number;
};
export default function StageShowcase({ stage }: StageShowcaseProps) {
	return (
		<div className="text-primary w-fit self-center text-center">
			<div className="flex w-full flex-1 grow items-center justify-center self-stretch">
				<div className="relative h-[30.05px] w-[300px] lg:w-[350px]">
					{stage > 1 ? (
						<motion.div
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: 0.5 }}
							className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-[3.38%] w-[125px] bg-[rgba(21,89,154,1)] lg:w-[150px]"
						/>
					) : (
						<div className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-[3.38%] w-[125px] bg-[rgba(79,88,96,1)] lg:w-[150px]" />
					)}
					{stage > 2 ? (
						<motion.div
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: 0.5 }}
							className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-1/2 w-[125px] bg-[rgba(21,89,154,1)] lg:w-[150px]"
						/>
					) : (
						<div className="absolute top-[42.5%] right-[3.6%] bottom-[45%] left-1/2 w-[125px] bg-[rgba(79,88,96,1)] lg:w-[150px]" />
					)}
					<div className="absolute inset-y-0 right-[90.99%] left-0 w-[30px] font-black">
						<div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]" />
						<p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">1</p>
					</div>
					<div className={`${stage > 1 ? "font-black" : ""} absolute inset-y-0 right-[45.5%] left-[45.5%] w-[30px] font-normal`}>
						{stage > 1 ? (
							<>
								<motion.div
									initial={{ opacity: 0.8 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]"
								/>

								<p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">2</p>
							</>
						) : (
							<>
								<div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(79,88,96,1)]" />
								<p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">2</p>
							</>
						)}
					</div>
					<div className={`${stage > 2 ? "font-black" : ""} absolute inset-y-0 right-0 left-[90.99%] w-[30px] font-normal`}>
						{stage > 2 ? (
							<>
								<div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]" />
								<p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">3</p>
							</>
						) : (
							<>
								<div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(79,88,96,1)]" />
								<p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">3</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
