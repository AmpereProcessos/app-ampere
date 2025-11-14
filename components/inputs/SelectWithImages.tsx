import React, { useEffect, useRef, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { Drawer, DrawerContent } from "../ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import Avatar from "../utils/Avatar";

type SelectOption<T> = {
	id: string | number;
	value: T;
	label: string;
	url?: string;
};
type SelectWithImagesProps<T> = {
	width?: string;
	label: string;
	labelClassName?: string;
	holderClassName?: string;
	showLabel?: boolean;
	value: any | null;
	editable?: boolean;
	selectedItemLabel: string;
	options: SelectOption<T>[] | null;
	handleChange: (value: T) => void;
	onReset: () => void;
};

function SelectWithImages<T>({
	width,
	label,
	labelClassName,
	holderClassName,
	showLabel = true,
	value,
	editable = true,
	options,
	selectedItemLabel,
	handleChange,
	onReset,
}: SelectWithImagesProps<T>) {
	function getValueID(value: T | null) {
		if (options && value) {
			// console.log("OPTIONS", options);
			// console.log("VALUE", value);
			const filteredOption = options?.find((option) => option.value === value || option.id === value);
			if (filteredOption) return filteredOption.id;
			return null;
		}
		return null;
	}

	const ref = useRef<any>(null);
	const [items, setItems] = useState<SelectOption<T>[] | null>(options);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [selectMenuIsOpen, setSelectMenuIsOpen] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState<number | string | null>(getValueID(value));
	const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down");

	const [searchFilter, setSearchFilter] = useState<string>("");
	const inputIdentifier = label.toLowerCase().replace(" ", "_");
	function handleSelect(id: string | number, item: T) {
		handleChange(item);
		setSelectedId(id);
		setSelectMenuIsOpen(false);
	}
	function handleFilter(value: string) {
		setSearchFilter(value);
		if (!items || !options) return;
		if (value.trim().length > 0) {
			const filteredItems = options.filter((item) => item.label.toUpperCase().includes(value.toUpperCase()));
			setItems(filteredItems);
			return;
		}
		setItems(options);
		return;
	}
	function resetState() {
		onReset();
		setSelectedId(null);
		setSelectMenuIsOpen(false);
	}
	function onClickOutside() {
		setSearchFilter("");
		setSelectMenuIsOpen(false);
	}
	useEffect(() => {
		setSelectedId(getValueID(value));
		setItems(options);
	}, [options, value]);
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target) && isDesktop) {
				onClickOutside();
			}
		};
		document.addEventListener("click", (e) => handleClickOutside(e), true);
		return () => {
			document.removeEventListener("click", (e) => handleClickOutside(e), true);
		};
	}, [onClickOutside]);

	useEffect(() => {
		if (selectMenuIsOpen && ref.current) {
			const rect = ref.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;

			if (spaceBelow < 250 && spaceAbove > spaceBelow) {
				setDropdownDirection("up");
			} else {
				setDropdownDirection("down");
			}
		}
	}, [selectMenuIsOpen]);

	if (isDesktop)
		return (
			<div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
				{showLabel ? (
					<label htmlFor={inputIdentifier} className={cn("text-primary/80 text-start text-sm font-medium tracking-tight", labelClassName)}>
						{label}
					</label>
				) : null}
				<div
					className={cn(
						"bg-background flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border p-3 text-sm shadow-xs duration-500 ease-in-out dark:bg-[#121212]",
						selectMenuIsOpen ? "border-primary" : "border-primary/20",
						holderClassName,
					)}
				>
					{selectMenuIsOpen ? (
						<input
							type="text"
							value={searchFilter}
							onChange={(e) => handleFilter(e.target.value)}
							placeholder="Filtre o item desejado..."
							className="h-full w-full italic outline-hidden"
						/>
					) : (
						<div className="flex grow items-center gap-2">
							{selectedId && options ? (
								<>
									<Avatar url={options.find((item) => item.id === selectedId)?.url} fallback="O" height={20} width={20} />

									<button
										type="button"
										onClick={() => {
											if (editable) setSelectMenuIsOpen((prev) => !prev);
										}}
										className="text-primary grow cursor-pointer text-start"
									>
										{selectedId && options ? options.filter((item) => item.id === selectedId)[0]?.label : "NÃO DEFINIDO"}
									</button>
								</>
							) : (
								<button
									type="button"
									onClick={() => {
										if (editable) setSelectMenuIsOpen((prev) => !prev);
									}}
									className="text-primary grow cursor-pointer text-start"
								>
									NÃO DEFINIDO
								</button>
							)}
						</div>
					)}
					{selectMenuIsOpen ? (
						<IoMdArrowDropup
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (editable) setSelectMenuIsOpen((prev) => !prev);
							}}
						/>
					) : (
						<IoMdArrowDropdown
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (editable) setSelectMenuIsOpen((prev) => !prev);
							}}
						/>
					)}
				</div>
				{selectMenuIsOpen ? (
					<div
						className={`absolute ${
							dropdownDirection === "down" ? "top-[75px]" : "bottom-[75px]"
						} border-primary/20 bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 z-100 flex h-[250px] max-h-[250px] w-full flex-col gap-1 self-center overflow-y-auto overscroll-y-auto rounded-md border p-2 py-1 shadow-xs dark:bg-[#121212]`}
					>
						<button
							type="button"
							onClick={() => resetState()}
							className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-1 px-2 ${!selectedId ? "bg-primary/20" : ""}`}
						>
							<p className="text-primary grow text-sm font-medium">{selectedItemLabel}</p>
							{!selectedId ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
						</button>
						<div className="my-2 h-px w-full bg-gray-200" />
						{items ? (
							items.map((item, index) => (
								<button
									type="button"
									onClick={() => handleSelect(item.id, item.value)}
									key={item.id ? item.id : index}
									className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-2 px-2 ${selectedId === item.id ? "bg-primary/20" : ""}`}
								>
									<Avatar url={item.url} height={20} width={20} fallback={formatNameAsInitials(item.label)} />
									<p className="text-primary grow pl-2 text-start text-sm font-medium">{item.label}</p>
									{selectedId === item.id ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
								</button>
							))
						) : (
							<p className="text-primary w-full text-center text-sm italic">Sem opções disponíveis.</p>
						)}
					</div>
				) : (
					false
				)}
			</div>
		);

	return (
		<Drawer open={selectMenuIsOpen} onOpenChange={setSelectMenuIsOpen}>
			<div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
				{showLabel ? (
					<label htmlFor={inputIdentifier} className={labelClassName}>
						{label}
					</label>
				) : null}
				<div
					className={`flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border duration-500 ease-in-out ${
						selectMenuIsOpen ? "border-primary" : "border-primary/20"
					} bg-background p-3 text-sm shadow-xs dark:bg-[#121212]`}
				>
					<div className="flex grow items-center gap-2">
						{selectedId && options ? (
							<>
								<Avatar url={options.find((item) => item.id === selectedId)?.url} fallback="O" height={20} width={20} />
								<button
									type="button"
									onClick={() => {
										if (editable) setSelectMenuIsOpen((prev) => !prev);
									}}
									className="text-primary grow cursor-pointer text-start"
								>
									{selectedId && options ? options.filter((item) => item.id === selectedId)[0]?.label : "NÃO DEFINIDO"}
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => {
									if (editable) setSelectMenuIsOpen((prev) => !prev);
								}}
								className="text-primary grow cursor-pointer"
							>
								NÃO DEFINIDO
							</button>
						)}
					</div>
					<IoMdArrowDropdown
						style={{ cursor: "pointer" }}
						onClick={() => {
							if (editable) setSelectMenuIsOpen((prev) => !prev);
						}}
					/>
				</div>
				<DrawerContent className="gap-2 p-2">
					<input
						type="text"
						value={searchFilter}
						onChange={(e) => handleFilter(e.target.value)}
						placeholder="Filtre o item desejado..."
						className="w-full bg-transparent p-2 text-sm italic outline-hidden"
					/>

					<button
						type="button"
						onClick={() => resetState()}
						className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-1 px-2 ${!selectedId ? "bg-primary/20" : ""}`}
					>
						<p className="text-primary grow text-sm font-medium">{selectedItemLabel}</p>
						{!selectedId ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
					</button>
					<div className="my-2 h-px w-full bg-gray-200" />
					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-[200px] min-h-[200px] flex-col gap-2 overflow-y-auto overscroll-y-auto lg:h-[350px] lg:max-h-[350px]">
						{items ? (
							items.map((item, index) => (
								<button
									type="button"
									onClick={() => handleSelect(item.id, item.value)}
									key={item.id ? item.id : index}
									className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-2 px-2 ${selectedId === item.id ? "bg-primary/20" : ""}`}
								>
									<Avatar url={item.url} height={20} width={20} fallback={formatNameAsInitials(item.label)} />
									<p className="text-primary grow pl-2 text-start text-sm font-medium">{item.label}</p>
									{selectedId === item.id ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
								</button>
							))
						) : (
							<p className="text-primary w-full text-center text-sm italic">Sem opções disponíveis.</p>
						)}
					</div>
				</DrawerContent>
			</div>
		</Drawer>
	);
}

export default SelectWithImages;
