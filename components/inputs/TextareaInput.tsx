import { cn } from "@/lib/utils";
import React from "react";

type TextareaInputProps = {
	label: string;
	labelClassName?: string;
	holderClassName?: string;
	value: string;
	placeholder: string;
	editable?: boolean;
	handleChange: (value: string) => void;
};
function TextareaInput({ label, labelClassName, holderClassName, value, placeholder, editable = true, handleChange }: TextareaInputProps) {
	const inputIdentifier = label.toLowerCase().replace(" ", "_");
	return (
		<div className="flex w-full flex-col gap-1">
			<label htmlFor={inputIdentifier} className={cn("text-sm font-medium tracking-tight text-primary/80", labelClassName)}>
				{label}
			</label>
			<textarea
				disabled={!editable}
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					handleChange(e.target.value);
				}}
				className={cn(
					"min-h-[80px] w-full resize-none rounded-md border border-primary/20 bg-[#fff] p-3 text-center text-xs font-medium text-primary outline-none dark:bg-[#121212] lg:min-h-[65px]",
					holderClassName,
				)}
			/>
		</div>
	);
}

export default TextareaInput;
