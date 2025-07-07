import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { LoadingButton } from "./Buttons/LoadingButton";
import { cn } from "@/lib/utils";

type ResponsibleModalWrapperProps = PropsWithChildren<{
	title: string;
	description: string;
	ctaButtonText: string;
	dialogContentClassName?: string;
	drawerContentClassName?: string;
	handleSubmit: () => void;
	isPending: boolean;
	closeModal: () => void;
}>;
function ResponsibleModalWrapperWithMutation({
	children,
	title,
	description,
	ctaButtonText,
	handleSubmit,
	isPending,
	closeModal,
	dialogContentClassName,
	drawerContentClassName,
}: ResponsibleModalWrapperProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className={cn("flex flex-col h-fit min-h-[60vh] max-h-[70vh]", dialogContentClassName)}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto">{children}</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton
						//@ts-ignore
						onClick={handleSubmit}
						loading={isPending}
					>
						{ctaButtonText}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className={cn("h-fit max-h-[70vh] flex flex-col", drawerContentClassName)}>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto">{children}</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>

					<LoadingButton
						//@ts-ignore
						onClick={handleSubmit}
						loading={isPending}
					>
						{ctaButtonText}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default ResponsibleModalWrapperWithMutation;
