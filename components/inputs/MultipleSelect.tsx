"use client";

import React, { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";

import { HiCheck } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  selected: T[] | null;
  editable?: boolean;
  selectedItemLabel: string;
  optionsStartContent?: ReactNode;
  options: SelectOption[] | null;
  handleChange: (value: T[]) => void;
  onReset: () => void;
};

function getIdsFromSelected<T>(
  selected: T[] | null,
  options: SelectOption[] | null,
): (string | number)[] {
  if (!options || !selected || selected.length === 0) return [];
  return options
    .filter((option) => selected.includes(option.value as T))
    .map((option) => option.id);
}

function itemCommandValue(id: string | number) {
  return `id:${String(id)}`;
}

function optionRowStart(item: SelectOption, optionsStartContent?: ReactNode) {
  return item.startContent ?? optionsStartContent ?? null;
}

type OptionsListProps = {
  options: SelectOption[] | null;
  optionsStartContent?: ReactNode;
  filterPlaceholder: string;
  resetOptionLabel: string;
  commandListClassName?: string;
  selectedIds: (string | number)[];
  listKey: number;
  editable: boolean;
  onToggle: (id: string | number) => void;
  onReset: () => void;
  closeMenu: () => void;
};

function OptionsList({
  options,
  optionsStartContent,
  filterPlaceholder,
  resetOptionLabel,
  commandListClassName,
  selectedIds,
  listKey,
  editable,
  onToggle,
  onReset,
  closeMenu,
}: OptionsListProps) {
  const hasOptions = options && options.length > 0;
  const noneSelected = selectedIds.length === 0;
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
              if (!editable) return;
              onReset();
              closeMenu();
            }}
            className="hover:bg-primary/20 data-[selected=true]:bg-primary/20"
          >
            <p className="text-foreground grow text-sm font-medium">{resetOptionLabel}</p>
            <HiCheck
              className={cn("ml-auto shrink-0", noneSelected ? "opacity-100" : "opacity-0")}
              style={{ color: "#fead61", fontSize: "20px" }}
            />
          </CommandItem>
          <CommandSeparator className="my-2 h-px bg-gray-200" />
          {hasOptions ? (
            options!.map((item, index) => {
              const isOn = selectedIds.includes(item.id);
              const v = itemCommandValue(item.id);
              const start = optionRowStart(item, optionsStartContent);
              return (
                <CommandItem
                  key={item.id != null ? String(item.id) : index}
                  value={v}
                  keywords={[item.label, String(item.id)]}
                  onSelect={() => {
                    if (!editable) return;
                    onToggle(item.id);
                  }}
                  className={cn(
                    "hover:bg-primary/20 data-[selected=true]:bg-primary/20",
                    isOn && "bg-primary/20",
                  )}
                >
                  <span className="text-foreground flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                    {start ? (
                      <span className="inline-flex shrink-0 items-center">{start}</span>
                    ) : null}
                    <span className="grow truncate text-sm font-medium">{item.label}</span>
                  </span>
                  <HiCheck
                    className={cn("ml-auto shrink-0", isOn ? "opacity-100" : "opacity-0")}
                    style={{ color: "#fead61", fontSize: "20px" }}
                  />
                </CommandItem>
              );
            })
          ) : (
            <div className="text-foreground w-full p-3 text-center text-sm italic">
              Sem opções disponíveis.
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function MultipleSelectInput<T>({
  width,
  label,
  labelClassName,
  holderClassName,
  showLabel = true,
  selected,
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
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>(() =>
    getIdsFromSelected(selected, options),
  );

  useEffect(() => {
    setSelectedIds(getIdsFromSelected(selected, options));
  }, [selected, options]);

  const selectedOptions = useMemo(
    () => (options?.filter((o) => selectedIds.includes(o.id)) ?? []) as SelectOption[],
    [options, selectedIds],
  );

  const noneSelected = selectedIds.length === 0;
  const manySelected = selectedIds.length > 1;
  const oneSelected = selectedIds.length === 1;

  const triggerText = useMemo(() => {
    if (noneSelected || !options) return "NÃO DEFINIDO";
    if (manySelected) return "MÚLTIPLAS SELEÇÕES";
    const one = options.find((o) => o.id === selectedIds[0]);
    return one?.label ?? "NÃO DEFINIDO";
  }, [noneSelected, manySelected, options, selectedIds]);

  const triggerStart = useMemo(() => {
    if (!oneSelected || !options) return null;
    const o = options.find((item) => item.id === selectedIds[0]);
    if (!o) return null;
    return o.startContent ?? optionsStartContent ?? null;
  }, [oneSelected, options, selectedIds, optionsStartContent]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      setListKey((k) => k + 1);
    }
  }, []);

  const fireChangeFromIds = useCallback(
    (ids: (string | number)[]) => {
      const next = (options?.filter((o) => ids.includes(o.id)).map((o) => o.value) ?? []) as T[];
      handleChange(next);
    },
    [handleChange, options],
  );

  const onToggle = useCallback(
    (id: string | number) => {
      const next = [...selectedIds];
      const at = next.indexOf(id);
      if (at >= 0) {
        next.splice(at, 1);
      } else {
        next.push(id);
      }
      setSelectedIds(next);
      fireChangeFromIds(next);
    },
    [selectedIds, fireChangeFromIds],
  );

  const handleReset = useCallback(() => {
    onReset();
    setSelectedIds([]);
  }, [onReset]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const rootStyle: React.CSSProperties | undefined = width
    ? { width, maxWidth: "100%" }
    : { maxWidth: "100%" };

  const filterPh = "Filtre o item desejado...";

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
        "bg-background text-foreground flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border p-3 text-sm font-normal shadow-xs transition-[border-color,box-shadow] duration-500 ease-in-out dark:bg-[#121212]",
        isOpen ? "border-primary" : "border-border",
        "hover:bg-background",
        holderClassName,
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-start">
        {triggerStart ? (
          <span className="inline-flex shrink-0 items-center">{triggerStart}</span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{triggerText}</span>
      </span>
      {isOpen && !mobile ? (
        <IoMdArrowDropup className="text-foreground h-5 w-5 min-h-5 min-w-5 shrink-0" aria-hidden />
      ) : (
        <IoMdArrowDropdown
          className="text-foreground h-5 w-5 min-h-5 min-w-5 shrink-0"
          aria-hidden
        />
      )}
    </Button>
  );

  const listBoxDesktop = (
    <OptionsList
      options={options}
      optionsStartContent={optionsStartContent}
      filterPlaceholder={filterPh}
      resetOptionLabel={selectedItemLabel}
      commandListClassName="max-h-[250px] lg:max-h-[250px]"
      selectedIds={selectedIds}
      listKey={listKey}
      editable={editable}
      onToggle={onToggle}
      onReset={handleReset}
      closeMenu={closeMenu}
    />
  );

  const listBoxMobile = (
    <OptionsList
      options={options}
      optionsStartContent={optionsStartContent}
      filterPlaceholder={filterPh}
      resetOptionLabel={selectedItemLabel}
      commandListClassName="flex max-h-[200px] min-h-[200px] flex-col gap-2 lg:max-h-[350px] lg:min-h-[250px]"
      selectedIds={selectedIds}
      listKey={listKey}
      editable={editable}
      onToggle={onToggle}
      onReset={handleReset}
      closeMenu={closeMenu}
    />
  );

  const mobileSummary = (
    <p className="text-foreground w-full text-center text-xs tracking-tight">
      {selectedOptions.length > 0
        ? selectedOptions.length > 3
          ? "Múltiplas opções selecionadas."
          : `Selecionando: ${selectedOptions.map((o) => o.label).join(", ")}.`
        : "Nenhuma opção selecionada."}
    </p>
  );

  return (
    <div
      className={cn("relative flex w-full flex-col gap-1", !width && "lg:w-[350px]")}
      style={rootStyle}
      draggable={false}
    >
      {showLabel ? (
        <label
          htmlFor={triggerId}
          className={cn(
            "text-foreground text-start text-sm font-medium tracking-tight",
            labelClassName,
          )}
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
            className="border-border bg-background z-100 w-[var(--radix-popover-trigger-width)] border p-0 shadow-xs dark:bg-[#121212]"
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
            {mobileSummary}
            <div className="mt-2 border-t border-border pt-2" id={`${inputIdentifier}-listbox`}>
              {listBoxMobile}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default MultipleSelectInput;
