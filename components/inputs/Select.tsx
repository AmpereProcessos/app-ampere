"use client";

import React, { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";

import { HiCheck } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/media-query";

const RESET_VALUE = "__select_reset__";

type SelectOption = {
	id: string | number;
	value: any;
	label: string;
	startContent?: ReactNode;
};

type SelectInputProps<T> = {
	width?: string;
	label: string;
	labelClassName?: string;
	holderClassName?: string;
	showLabel?: boolean;
	value: T | null;
	editable?: boolean;
	selectedItemLabel: string;
	optionsStartContent?: ReactNode;
	options: SelectOption[] | null;
	handleChange: (value: T) => void;
	onReset: () => void;
};

function getValueID<T>(value: T | null, options: SelectOption[] | null) {
	if (!options || value == null) return null;
	const match = options.find((option) => option.value === value);
	return match ? match.id : null;
}

function itemCommandValue(id: string | number) {
	return `id:${String(id)}`;
}

type OptionsListProps<T> = {
	options: SelectOption[] | null;
	optionsStartContent?: ReactNode;
	filterPlaceholder: string;
	resetOptionLabel: string;
	commandListClassName?: string;
	selectedId: string | number | null;
	listKey: number;
	handleSelect: (id: string | number, value: T) => void;
	handleReset: () => void;
	closeMenu: () => void;
};

function optionRowStart(item: SelectOption, optionsStartContent?: ReactNode) {
	return item.startContent ?? optionsStartContent ?? null;
}

function OptionsList<T>({
	options,
	optionsStartContent,
	filterPlaceholder,
	resetOptionLabel,
	commandListClassName,
	selectedId,
	listKey,
	handleSelect,
	handleReset,
	closeMenu,
}: OptionsListProps<T>) {
	const hasOptions = options && options.length > 0;
	return (
		<Command key={listKey} loop className="w-full" shouldFilter={!!hasOptions}>
			<CommandInput placeholder={filterPlaceholder} className="h-9 w-full text-sm italic" />
			<CommandList
				className={cn(
					"scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 w-full overflow-y-auto overscroll-y-auto",
					commandListClassName ?? "max-h-[250px] lg:max-h-[250px]",
				)}
			>
				<CommandEmpty className="w-full p-3 text-sm">Nenhuma opção correspondente.</CommandEmpty>
				<CommandGroup className="w-full p-0">
					<CommandItem
						value={RESET_VALUE}
						keywords={["reset", resetOptionLabel, filterPlaceholder]}
						onSelect={() => {
							handleReset();
							closeMenu();
						}}
						className="hover:bg-primary/20 data-[selected=true]:bg-primary/20"
					>
						<p className="text-primary grow text-sm font-medium">{resetOptionLabel}</p>
						<HiCheck
							className={cn("ml-auto shrink-0", !selectedId ? "opacity-100" : "opacity-0")}
							style={{ color: "#fead61", fontSize: "20px" }}
						/>
					</CommandItem>
					<CommandSeparator className="my-2 h-px bg-gray-200" />
					{hasOptions ? (
						options!.map((item, index) => {
							const v = itemCommandValue(item.id);
							const start = optionRowStart(item, optionsStartContent);
							return (
								<CommandItem
									key={item.id != null ? String(item.id) : index}
									value={v}
									keywords={[item.label, String(item.id)]}
									onSelect={() => {
										handleSelect(item.id, item.value);
										closeMenu();
									}}
									className={cn(
										"hover:bg-primary/20 data-[selected=true]:bg-primary/20",
										selectedId != null && selectedId == item.id && "bg-primary/20",
									)}
								>
									<span className="text-primary flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
										{start ? <span className="inline-flex shrink-0 items-center">{start}</span> : null}
										<span className="grow truncate text-sm font-medium">{item.label}</span>
									</span>
									<HiCheck
										className={cn("ml-auto shrink-0", selectedId != null && selectedId == item.id ? "opacity-100" : "opacity-0")}
										style={{ color: "#fead61", fontSize: "20px" }}
									/>
								</CommandItem>
							);
						})
					) : (
						<div className="text-primary w-full p-3 text-center text-sm italic">Sem opções disponíveis.</div>
					)}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

function SelectInput<T>({
	width,
	label,
	labelClassName,
	holderClassName,
	showLabel = true,
	value,
	editable = true,
	options,
	optionsStartContent,
	selectedItemLabel,
	handleChange,
	onReset,
}: SelectInputProps<T>) {
	const triggerId = useId();
	const inputIdentifier = useMemo(() => label.toLowerCase().replaceAll(" ", "_"), [label]);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [isOpen, setIsOpen] = useState(false);
	const [listKey, setListKey] = useState(0);
	const [selectedId, setSelectedId] = useState<string | number | null>(getValueID(value, options));

	const selectedOption = useMemo(() => {
		if (selectedId == null || !options) return null;
		return options.find((item) => item.id === selectedId) ?? null;
	}, [options, selectedId]);

	const selectedLabel = selectedOption?.label ?? null;

	const triggerStart = useMemo(() => {
		if (!selectedOption) return null;
		return selectedOption.startContent ?? optionsStartContent ?? null;
	}, [selectedOption, optionsStartContent]);

	useEffect(() => {
		setSelectedId(getValueID(value, options));
	}, [value, options]);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open);
		if (open) {
			setListKey((k) => k + 1);
		}
	}, []);

	const handleSelect = useCallback(
		(id: string | number, v: T) => {
			handleChange(v);
			setSelectedId(id);
		},
		[handleChange],
	);

	const handleReset = useCallback(() => {
		onReset();
		setSelectedId(null);
	}, [onReset]);

	const closeMenu = useCallback(() => setIsOpen(false), []);

	const rootStyle: React.CSSProperties | undefined = width
		? { width, maxWidth: "100%" }
		: { maxWidth: "100%" };

	const triggerButton = (mobile?: boolean) => (
		<Button
			type="button"
			id={triggerId}
			disabled={!editable}
			variant="outline"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-controls={isOpen ? `${inputIdentifier}-listbox` : undefined}
			className={cn(
				"bg-background text-primary flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border p-3 text-sm font-normal shadow-xs transition-[border-color,box-shadow] duration-500 ease-in-out dark:bg-[#121212]",
				isOpen ? "border-primary" : "border-primary/20",
				"hover:bg-background",
				holderClassName,
			)}
		>
			<span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-start">
				{triggerStart ? <span className="inline-flex shrink-0 items-center">{triggerStart}</span> : null}
				<span className="min-w-0 flex-1 truncate">{selectedLabel ?? selectedItemLabel}</span>
			</span>
			{isOpen && !mobile ? (
				<IoMdArrowDropup className="text-primary h-5 w-5 min-h-5 min-w-5 shrink-0" aria-hidden />
			) : (
				<IoMdArrowDropdown className="text-primary h-5 w-5 min-h-5 min-w-5 shrink-0" aria-hidden />
			)}
		</Button>
	);

	const filterPh = "Filtre o item desejado...";
	const listBoxDesktop = (
		<OptionsList<T>
			options={options}
			optionsStartContent={optionsStartContent}
			filterPlaceholder={filterPh}
			resetOptionLabel={selectedItemLabel}
			commandListClassName="max-h-[250px] lg:max-h-[250px]"
			selectedId={selectedId}
			listKey={listKey}
			handleSelect={handleSelect}
			handleReset={handleReset}
			closeMenu={closeMenu}
		/>
	);
	const listBoxMobile = (
		<OptionsList<T>
			options={options}
			optionsStartContent={optionsStartContent}
			filterPlaceholder={filterPh}
			resetOptionLabel={selectedItemLabel}
			commandListClassName="flex max-h-[200px] min-h-[200px] flex-col gap-2 lg:max-h-[350px] lg:min-h-[250px]"
			selectedId={selectedId}
			listKey={listKey}
			handleSelect={handleSelect}
			handleReset={handleReset}
			closeMenu={closeMenu}
		/>
	);

	return (
		<div
			className={cn("relative flex w-full flex-col gap-1", !width && "lg:w-[350px]")}
			style={rootStyle}
		>
			{showLabel ? (
				<label
					htmlFor={triggerId}
					className={cn("text-primary/80 text-start text-sm font-medium tracking-tight", labelClassName)}
				>
					{label}
				</label>
			) : null}
			{isDesktop ? (
				<Popover open={isOpen} onOpenChange={handleOpenChange}>
					<PopoverTrigger asChild>{triggerButton()}</PopoverTrigger>
					<PopoverContent
						id={`${inputIdentifier}-listbox`}
						align="start"
						sideOffset={4}
						className="border-primary/20 bg-background z-100 w-[var(--radix-popover-trigger-width)] border p-0 shadow-xs dark:bg-[#121212]"
					>
						{listBoxDesktop}
					</PopoverContent>
				</Popover>
			) : (
				<Drawer open={isOpen} onOpenChange={handleOpenChange} repositionInputs={false}>
					<DrawerTrigger asChild disabled={!editable}>
						{triggerButton(true)}
					</DrawerTrigger>
					<DrawerContent className="gap-2 p-2">
						<div className="mt-2 border-t border-primary/20 pt-2" id={`${inputIdentifier}-listbox`}>
							{listBoxMobile}
						</div>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
}

export default SelectInput;
