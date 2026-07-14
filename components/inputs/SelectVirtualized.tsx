"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

type SelectInputVirtualizedProps<T> = {
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
  /** Altura de cada linha (px). @default 40 */
  itemHeight?: number;
  /** Altura máxima do painel de lista (px). @default 300 */
  maxHeight?: number;
  /** Comportamento modal do popover (Radix). @default true */
  modal?: boolean;
};

function getValueID<T>(value: T | null, options: SelectOption[] | null) {
  if (!options || value == null) return null;
  const match = options.find((option) => option.value === value);
  return match ? match.id : null;
}

function itemCommandValue(id: string | number) {
  return `id:${String(id)}`;
}

function optionRowStart(item: SelectOption, optionsStartContent?: ReactNode) {
  return item.startContent ?? optionsStartContent ?? null;
}

type VirtualizedOptionsListProps<T> = {
  value: T | null;
  filterPlaceholder: string;
  resetOptionLabel: string;
  optionsStartContent?: ReactNode;
  optionsRow: SelectOption[];
  sourceOptions: SelectOption[] | null;
  searchValue: string;
  setSearchValue: (v: string) => void;
  listKey: number;
  itemHeight: number;
  maxHeight: number;
  handleSelect: (id: string | number, value: T) => void;
  handleReset: () => void;
  closeMenu: () => void;
};

type VirtualItem = { type: "reset" } | { type: "option"; option: SelectOption };

function buildVirtualItems(options: SelectOption[]): VirtualItem[] {
  return [
    { type: "reset" } as const,
    ...options.map((o) => ({ type: "option" as const, option: o })),
  ];
}

type VirtualizedScrollRowsProps<T> = {
  virtualizedItems: VirtualItem[];
  itemHeight: number;
  maxHeight: number;
  filterPlaceholder: string;
  resetOptionLabel: string;
  optionsStartContent?: ReactNode;
  value: T | null;
  sourceOptions: SelectOption[] | null;
  handleSelect: (id: string | number, value: T) => void;
  handleReset: () => void;
  closeMenu: () => void;
};

function VirtualizedScrollRows<T>({
  virtualizedItems,
  itemHeight,
  maxHeight,
  filterPlaceholder,
  resetOptionLabel,
  optionsStartContent,
  value,
  sourceOptions,
  handleSelect,
  handleReset,
  closeMenu,
}: VirtualizedScrollRowsProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const selectedId = getValueID(value, sourceOptions);
  const listHeight = Math.min(maxHeight, virtualizedItems.length * itemHeight);

  const virtualizer = useVirtualizer({
    count: virtualizedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  const totalSize = virtualizer.getTotalSize();
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn(
        "scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 w-full overflow-y-auto p-0",
      )}
      style={{ height: listHeight, maxHeight }}
    >
      <div
        style={{
          height: totalSize,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((vItem) => {
          const item = virtualizedItems[vItem.index];
          if (!item) return null;
          return (
            <div
              key={vItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${vItem.size}px`,
                transform: `translateY(${vItem.start}px)`,
              }}
            >
              {item.type === "reset" ? (
                <>
                  <CommandItem
                    value={RESET_VALUE}
                    keywords={["reset", resetOptionLabel, filterPlaceholder]}
                    onSelect={() => {
                      handleReset();
                      closeMenu();
                    }}
                    className="hover:bg-primary/20 data-[selected=true]:bg-primary/20"
                  >
                    <p className="text-foreground grow text-sm font-medium">{resetOptionLabel}</p>
                    <HiCheck
                      className={cn(
                        "ml-auto shrink-0",
                        selectedId == null ? "opacity-100" : "opacity-0",
                      )}
                      style={{ color: "#fead61", fontSize: "20px" }}
                    />
                  </CommandItem>
                  <CommandSeparator className="my-2 h-px bg-gray-200" />
                </>
              ) : (
                (() => {
                  const o = item.option;
                  const start = optionRowStart(o, optionsStartContent);
                  return (
                    <CommandItem
                      value={itemCommandValue(o.id)}
                      keywords={[o.label, String(o.id)]}
                      onSelect={() => {
                        handleSelect(o.id, o.value);
                        closeMenu();
                      }}
                      className={cn(
                        "hover:bg-primary/20 h-full data-[selected=true]:bg-primary/20",
                        selectedId != null && selectedId == o.id && "bg-primary/20",
                      )}
                    >
                      <span className="text-foreground flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                        {start ? (
                          <span className="inline-flex shrink-0 items-center">{start}</span>
                        ) : null}
                        <span className="grow truncate text-sm font-medium">{o.label}</span>
                      </span>
                      <HiCheck
                        className={cn(
                          "ml-auto shrink-0",
                          selectedId != null && selectedId == o.id ? "opacity-100" : "opacity-0",
                        )}
                        style={{ color: "#fead61", fontSize: "20px" }}
                      />
                    </CommandItem>
                  );
                })()
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VirtualizedOptionsList<T>({
  value,
  filterPlaceholder,
  resetOptionLabel,
  optionsStartContent,
  optionsRow,
  sourceOptions,
  searchValue,
  setSearchValue,
  listKey,
  itemHeight,
  maxHeight,
  handleSelect,
  handleReset,
  closeMenu,
}: VirtualizedOptionsListProps<T>) {
  const hasSourceData = sourceOptions != null && sourceOptions.length > 0;
  const showFilterEmpty = optionsRow.length === 0 && searchValue.trim() !== "" && hasSourceData;
  const filterEmptyNoSearch = optionsRow.length === 0 && searchValue.trim() === "";
  const showNoData = (sourceOptions == null || sourceOptions.length === 0) && filterEmptyNoSearch;

  const virtualizedItems = useMemo(() => buildVirtualItems(optionsRow), [optionsRow]);

  return (
    <Command key={listKey} loop className="w-full" shouldFilter={false}>
      <CommandInput
        placeholder={filterPlaceholder}
        className="h-9 w-full text-sm italic"
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList className="w-full max-h-none overflow-visible p-0">
        {showFilterEmpty ? (
          <CommandEmpty className="w-full p-3 text-sm">Nenhuma opção correspondente.</CommandEmpty>
        ) : (
          <CommandGroup className="p-0">
            <VirtualizedScrollRows<T>
              virtualizedItems={virtualizedItems}
              itemHeight={itemHeight}
              maxHeight={maxHeight}
              filterPlaceholder={filterPlaceholder}
              resetOptionLabel={resetOptionLabel}
              optionsStartContent={optionsStartContent}
              value={value}
              sourceOptions={sourceOptions}
              handleSelect={handleSelect}
              handleReset={handleReset}
              closeMenu={closeMenu}
            />
            {showNoData ? (
              <div className="text-foreground w-full p-2 text-center text-sm italic">
                Sem opções disponíveis.
              </div>
            ) : null}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

function SelectInputVirtualized<T>({
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
  itemHeight = 40,
  maxHeight = 300,
  modal = true,
}: SelectInputVirtualizedProps<T>) {
  const triggerId = useId();
  const inputIdentifier = useMemo(() => label.toLowerCase().replaceAll(" ", "_"), [label]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const [listKey, setListKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
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

  const filterPh = "Filtre o item desejado...";

  const filteredOptions = useMemo(() => {
    if (!options) return [] as SelectOption[];
    if (!searchValue.trim()) return options;
    const q = searchValue.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [options, searchValue]);

  useEffect(() => {
    setSelectedId(getValueID(value, options));
  }, [value, options]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      setListKey((k) => k + 1);
    } else {
      setSearchValue("");
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
        <span className="min-w-0 flex-1 truncate">{selectedLabel ?? selectedItemLabel}</span>
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

  const listBody = (
    <VirtualizedOptionsList<T>
      value={value}
      filterPlaceholder={filterPh}
      resetOptionLabel={selectedItemLabel}
      optionsStartContent={optionsStartContent}
      optionsRow={filteredOptions}
      sourceOptions={options}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      listKey={listKey}
      itemHeight={itemHeight}
      maxHeight={maxHeight}
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
          className={cn(
            "text-foreground text-start text-sm font-medium tracking-tight",
            labelClassName,
          )}
        >
          {label}
        </label>
      ) : null}
      {isDesktop ? (
        <Popover open={isOpen} onOpenChange={handleOpenChange} modal={modal}>
          <PopoverTrigger asChild>{triggerButton()}</PopoverTrigger>
          <PopoverContent
            id={`${inputIdentifier}-listbox`}
            align="start"
            sideOffset={4}
            className="border-border bg-background z-100 w-[var(--radix-popover-trigger-width)] border p-0 shadow-xs dark:bg-[#121212]"
          >
            {listBody}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={isOpen} onOpenChange={handleOpenChange} repositionInputs={false}>
          <DrawerTrigger asChild disabled={!editable}>
            {triggerButton(true)}
          </DrawerTrigger>
          <DrawerContent className="gap-2 p-2">
            <div className="mt-2 border-t border-border pt-2" id={`${inputIdentifier}-listbox`}>
              {listBody}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default SelectInputVirtualized;
