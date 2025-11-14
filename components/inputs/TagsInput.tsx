import { cn } from "@/lib/utils";
import React, { useState } from "react";
import type { KeyboardEvent } from "react";

type TagsInputProps = {
	width?: string;
	label: string;
	labelClassName?: string;
	holderClassName?: string;
	showLabel?: boolean;
	values: string[];
	placeholder: string;
	editable?: boolean;
	handleChange: (values: string[]) => void;
	handleOnBlur?: () => void;
};

function TagsInput({
	width,
	label,
	labelClassName,
	holderClassName,
	showLabel = true,
	values,
	placeholder,
	editable = true,
	handleChange,
	handleOnBlur,
}: TagsInputProps) {
	const [inputValue, setInputValue] = useState("");
	const inputIdentifier = label.toLowerCase().replace(" ", "_");

	const addTag = () => {
		if (inputValue.trim() && !values.includes(inputValue.trim())) {
			handleChange([...values, inputValue.trim()]);
			setInputValue("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		handleChange(values.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		} else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
			// Remove last tag when backspace is pressed on empty input
			removeTag(values[values.length - 1]);
		}
	};

	return (
		<div className={`flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
			{showLabel ? (
				<label htmlFor={inputIdentifier} className={cn("text-sm font-medium tracking-tight text-primary/80", labelClassName)}>
					{label}
				</label>
			) : null}

			<div
				className={cn(
					"flex min-h-[48px] w-full flex-wrap items-center gap-1 rounded-md border border-primary/20 p-2 shadow-xs duration-500 ease-in-out focus-within:border-primary",
					holderClassName,
				)}
			>
				{/* Render existing tags */}
				{values.map((tag) => (
					<span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
						{tag}
						{editable && (
							<button
								type="button"
								onClick={() => removeTag(tag)}
								className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20"
							>
								<span className="text-xs">×</span>
							</button>
						)}
					</span>
				))}

				{/* Input for new tags */}
				{editable && (
					<input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={() => {
							addTag();
							if (handleOnBlur) handleOnBlur();
						}}
						id={inputIdentifier}
						type="text"
						placeholder={values.length === 0 ? placeholder : ""}
						className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-sm outline-hidden placeholder:italic"
					/>
				)}
			</div>
		</div>
	);
}

export default TagsInput;
