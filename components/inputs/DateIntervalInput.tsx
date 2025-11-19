import { cn } from "@/lib/utils";
import { endOfDay, endOfMonth, endOfWeek, endOfYear, format, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Preset = {
	label: string;
	interval: { after: Date; before: Date };
};

type DateIntervalInputProps = {
	label?: string;
	labelClassName?: string;
	className?: string;
	value: { after?: Date; before?: Date };
	handleChange: (value: { after?: Date; before?: Date }) => void;
	presets?: Preset[];
};

function DateIntervalInput({ label, labelClassName, className, value, handleChange, presets }: DateIntervalInputProps) {
	const defaultPresets: Preset[] = [
		{
			label: "Hoje",
			interval: { after: startOfDay(new Date()), before: endOfDay(new Date()) },
		},
		{
			label: "Últimos 7 dias",
			interval: { after: startOfDay(subDays(new Date(), 6)), before: endOfDay(new Date()) },
		},
		{
			label: "Esta semana",
			interval: { after: startOfWeek(new Date(), { locale: ptBR }), before: endOfWeek(new Date(), { locale: ptBR }) },
		},
		{
			label: "Este mês",
			interval: { after: startOfMonth(new Date()), before: endOfMonth(new Date()) },
		},
		{
			label: "Último mês",
			interval: { after: startOfMonth(subMonths(new Date(), 1)), before: endOfMonth(subMonths(new Date(), 1)) },
		},
		{
			label: "Este ano",
			interval: { after: startOfYear(new Date()), before: endOfYear(new Date()) },
		},
	];

	const availablePresets = presets || defaultPresets;

	const handlePresetSelect = (preset: Preset) => {
		handleChange(preset.interval);
	};

	return (
		<div className={cn("flex flex-col gap-1")}>
			{label && <div className={cn("text-foreground text-sm font-medium", labelClassName)}>{label}</div>}

			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"min-h-[46.6px] border-primary/20 bg-background focus:border-primary w-full justify-start rounded-md border text-left text-sm font-normal ease-in-out dark:bg-[#121212]",
							!value.after && !value.before && "text-muted-foreground",
							className,
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value?.after ? (
							value.before ? (
								<>
									{format(value.after, "dd/MM/yyyy", { locale: ptBR })} - {format(value.before, "dd/MM/yyyy", { locale: ptBR })}
								</>
							) : (
								format(value.after, "dd/MM/yyyy", { locale: ptBR })
							)
						) : (
							<span>ESCOLHA UM PERÍODO</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						locale={ptBR}
						defaultMonth={value?.after}
						selected={{ from: value.after, to: value.before }}
						onSelect={(value) => handleChange({ after: value?.from, before: value?.to })}
						numberOfMonths={2}
					/>
					{availablePresets.length > 0 ? (
						<div className="flex w-full items-center justify-center px-2 py-1">
							<Select
								onValueChange={(value) => {
									const preset = availablePresets.find((preset) => preset.label === value);
									if (preset) {
										handleChange(preset.interval);
									}
								}}
							>
								<SelectTrigger className="w-full text-xs">
									<SelectValue placeholder="PERÍODO PRÉ-DEFINIDO" />
								</SelectTrigger>
								<SelectContent>
									{availablePresets.map((preset) => (
										<SelectItem
											className="text-xs"
											key={`${preset.label}-${preset.interval.after.getTime()}-${preset.interval.before.getTime()}`}
											value={preset.label}
										>
											{preset.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : null}
					{/* {availablePresets.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-2">
							{availablePresets.map((preset) => (
								<Button
									key={`${preset.label}-${preset.interval.after.getTime()}-${preset.interval.before.getTime()}`}
									variant="outline"
									size="sm"
									className={cn(
										"h-8 px-3 text-xs",
										value.after === preset.interval.after && value.before === preset.interval.before
											? "bg-primary text-primary-foreground hover:bg-primary/90"
											: "bg-background hover:bg-accent",
									)}
									onClick={() => handlePresetSelect(preset)}
								>
									{preset.label}
								</Button>
							))}
						</div>
					)} */}
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default DateIntervalInput;
