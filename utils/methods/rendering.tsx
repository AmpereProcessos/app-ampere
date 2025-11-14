import type { IconType } from "react-icons/lib";
import { ProductItemCategories, units } from "../select-options";
import type { TProductItem } from "../schemas/crm/kits.schema";
import { BsCart } from "react-icons/bs";
import { fileTypes } from "../constants";
import { AiFillFile } from "react-icons/ai";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export function renderIcon(icon: React.ComponentType | IconType) {
	const IconComponent = icon;
	return <IconComponent />;
}
export function renderIconWithClassNames(icon: ComponentType | IconType, className?: string) {
	const IconComponent = icon;
	return <IconComponent className={cn("h-4 min-h-4 w-4 min-w-4", className)} />;
}
export function renderProductCategoryIcon(category: TProductItem["categoria"], size: number | undefined = 12) {
	const CategoryInfo = ProductItemCategories.find((productCategory) => productCategory.value === category);
	if (!CategoryInfo) return <BsCart size={size} />;
	return renderIcon(CategoryInfo.icon);
}

export function handleRenderFileIcon(format: string, size?: number) {
	//   useKey('Escape', () => setSelectMenuIsOpen(false))
	const extensionInfo = Object.values(fileTypes).find((f) => f.title === format);
	if (!extensionInfo)
		return (
			<div className="text-primary text-lg">
				<AiFillFile />
			</div>
		);

	return <div className="text-primary text-lg">{renderIcon(extensionInfo.icon)}</div>;
}
export function renderPagesIcons({
	totalPages,
	activePage,
	selectPage,
	disabled,
}: {
	totalPages: number;
	activePage: number;
	selectPage: (page: number) => void;
	disabled: boolean;
}) {
	const MAX_RENDER = 5;
	let pages: (number | string)[] = [];
	if (totalPages <= MAX_RENDER) {
		pages = Array.from({ length: totalPages }, (v, i) => i + 1);
	} else {
		// If active page is around the middle of the total pages
		if (totalPages - activePage > 3 && activePage - 1 > 3) {
			pages = [1, "...", activePage - 1, activePage, activePage + 1, "...", totalPages];
		} else {
			// if active page is 3 elements from the total page
			if (activePage > 3 && totalPages - activePage < MAX_RENDER - 1)
				pages = [1, "...", ...Array.from({ length: MAX_RENDER }, (v, i) => i + totalPages - MAX_RENDER), totalPages];
			// else, if active page is 3 elements from 1
			else pages = [...Array.from({ length: MAX_RENDER }, (v, i) => i + 1), "...", totalPages];
		}
	}
	return pages.map((p) => (
		<button
			type="button"
			key={p}
			disabled={typeof p !== "number" || disabled}
			onClick={() => {
				if (typeof p !== "number") return;
				return selectPage(p);
			}}
			className={`${
				activePage === p ? "border-primary bg-primary text-secondary" : "text-primary hover:bg-primary/50 border-transparent"
			} h-8 max-h-10 min-h-8 w-8 max-w-10 min-w-8 rounded-full border text-xs font-medium lg:h-10 lg:min-h-10 lg:w-10 lg:min-w-10`}
		>
			{p}
		</button>
	));
}
export function renderUnitLabel(str: string) {
	const unit = units.find((u) => u.value === str);
	return unit?.label || str;
}
