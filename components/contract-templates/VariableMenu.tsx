import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contractVariables, getVariablesByCategory } from "@/lib/contract-generation/variables";
import { Code, VariableIcon } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface VariableMenuProps {
	query: string;
	onSelect: (variable: { id: string; label: string }) => void;
}

export const VariableMenu: React.FC<VariableMenuProps> = ({ query, onSelect }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Filter variables based on query
	const filteredVariables = contractVariables.filter((variable) => {
		const searchText = query.toLowerCase();
		return (
			variable.label.toLowerCase().includes(searchText) ||
			variable.id.toLowerCase().includes(searchText) ||
			variable.category.toLowerCase().includes(searchText)
		);
	});

	const groupedVariables = getVariablesByCategory();
	const categories = Object.keys(groupedVariables);

	// Filter categories that have matching variables
	const filteredCategories = categories.filter((category) => {
		return groupedVariables[category].some((variable) => {
			const searchText = query.toLowerCase();
			return (
				variable.label.toLowerCase().includes(searchText) ||
				variable.id.toLowerCase().includes(searchText) ||
				variable.category.toLowerCase().includes(searchText)
			);
		});
	});

	useEffect(() => {
		setSelectedIndex(0);
	}, []);

	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredVariables.length - 1));
				event.preventDefault();
				return true;
			}

			if (event.key === "ArrowDown") {
				setSelectedIndex((prevIndex) => (prevIndex < filteredVariables.length - 1 ? prevIndex + 1 : 0));
				event.preventDefault();
				return true;
			}

			if (event.key === "Enter") {
				const selectedVariable = filteredVariables[selectedIndex];
				if (selectedVariable) {
					onSelect(selectedVariable);
				}
				event.preventDefault();
				return true;
			}

			return false;
		},
		[filteredVariables, selectedIndex, onSelect],
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

	if (filteredVariables.length === 0) {
		return (
			<Command className="rounded-lg border shadow-md w-[400px]">
				<CommandList>
					<CommandEmpty>Nenhuma variável encontrada</CommandEmpty>
				</CommandList>
			</Command>
		);
	}

	return (
		<Command className="rounded-lg border shadow-md w-[400px]">
			<CommandList>
				<ScrollArea className="h-[400px]">
					{query ? (
						// Show filtered list
						<CommandGroup heading="Resultados">
							{filteredVariables.map((variable, index) => (
								<CommandItem
									key={variable.id}
									value={variable.id}
									onSelect={() => onSelect(variable)}
									className="flex items-start gap-1 cursor-pointer border border-primary/10 px-3 rounded"
								>
									<VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
									<span className="text-xs font-medium uppercase">{variable.label}</span>
								</CommandItem>
							))}
						</CommandGroup>
					) : (
						// Show grouped by category
						<>
							{filteredCategories.map((category) => (
								<CommandGroup key={category} heading={category.toUpperCase()} className="flex flex-col gap-1">
									{groupedVariables[category].map((variable) => (
										<CommandItem
											key={variable.id}
											value={variable.id}
											onSelect={() => onSelect(variable)}
											className="flex items-start gap-1 cursor-pointer border border-primary/10 px-3 rounded hover:bg-blue-100"
										>
											<VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
											<span className="text-xs font-medium uppercase">{variable.label}</span>
										</CommandItem>
									))}
								</CommandGroup>
							))}
						</>
					)}
				</ScrollArea>
			</CommandList>
		</Command>
	);
};
