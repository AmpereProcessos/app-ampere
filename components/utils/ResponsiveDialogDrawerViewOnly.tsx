import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import ErrorComponent from "./ErrorComponent";
import LoadingComponent from "./LoadingComponent";

const responsiveMenuVariants = cva("flex flex-col", {
  variants: {
    dialogVariant: {
      fit: "h-fit w-fit max-w-fit min-h-fit",
      sm: "max-h-[90%]",
      md: "h-[70%] min-h-[70%] max-h-[70%] lg:max-h-[70%] w-[60%] min-w-[60%] max-w-[60%] lg:max-w-[60%]",
      lg: "h-[90%] min-h-[90%] max-h-[90%] lg:max-h-[90%] w-[80%] min-w-[80%] max-w-[80%] lg:max-w-[80%]",
    },
  },
  defaultVariants: {
    dialogVariant: "sm",
  },
});

const drawerVariants = cva("flex flex-col", {
  variants: {
    drawerVariant: {
      fit: "flex flex-col h-fit max-h-fit",
      sm: "flex flex-col h-fit max-h-[95vh]",
      md: "flex flex-col h-fit max-h-[95vh]",
      lg: "flex flex-col h-fit max-h-[95vh]",
    },
  },
  defaultVariants: {
    drawerVariant: "sm",
  },
});
type ResponsiveDialogDrawerProps = PropsWithChildren & {
  dialogContentClassName?: string;
  drawerContentClassName?: string;
  menuTitle: string;
  menuDescription: string;
  menuCancelButtonText: string;
  stateIsLoading: boolean;
  stateError?: string | null;
  closeMenu: () => void;
  dialogVariant?: "fit" | "sm" | "md" | "lg";
  drawerVariant?: "fit" | "sm" | "md" | "lg";
};
function ResponsiveDialogDrawerViewOnly({
  children,
  menuTitle,
  menuDescription,
  menuCancelButtonText,
  closeMenu,
  stateIsLoading,
  stateError,
  dialogContentClassName,
  drawerContentClassName,
  dialogVariant,
  drawerVariant,
}: ResponsiveDialogDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <Dialog onOpenChange={(v) => (v ? null : closeMenu())} open>
      <DialogContent
        className={cn(responsiveMenuVariants({ dialogVariant }), dialogContentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{menuTitle}</DialogTitle>
          <DialogDescription>{menuDescription}</DialogDescription>
        </DialogHeader>
        {stateIsLoading ? (
          <LoadingComponent />
        ) : stateError ? (
          <ErrorComponent msg={stateError} />
        ) : (
          <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-2">
            {children}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{menuCancelButtonText}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer shouldScaleBackground={false} onOpenChange={(v) => (v ? null : closeMenu())} open>
      <DrawerContent className={cn(drawerVariants({ drawerVariant }), drawerContentClassName)}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{menuTitle}</DrawerTitle>
          <DrawerDescription>{menuDescription}</DrawerDescription>
        </DrawerHeader>
        {stateIsLoading ? (
          <LoadingComponent />
        ) : stateError ? (
          <ErrorComponent msg={stateError} />
        ) : (
          <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-0">
            {children}
          </div>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{menuCancelButtonText}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ResponsiveDialogDrawerViewOnly;
