import type { PropsWithChildren } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { LoadingButton } from './Buttons/LoadingButton'

type ResponsiveDialogDrawerProps = PropsWithChildren & {
  dialogContentClassName?: string
  drawerContentClassName?: string
  menuTitle: string
  menuDescription: string
  menuActionButtonText: string
  menuCancelButtonText: string
  actionFunction: () => void
  actionIsPending: boolean
  stateIsLoading: boolean
  closeMenu: () => void
}
function ResponsiveDialogDrawer({
  children,
  menuTitle,
  menuDescription,
  menuActionButtonText,
  menuCancelButtonText,
  closeMenu,
  actionFunction,
  stateIsLoading,
  actionIsPending,
  dialogContentClassName,
  drawerContentClassName,
}: ResponsiveDialogDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop ? (
    <Dialog onOpenChange={(v) => (v ? null : closeMenu())} open>
      <DialogContent className={cn('flex h-fit max-h-[80vh] min-h-[60vh] flex-col', dialogContentClassName)}>
        <DialogHeader>
          <DialogTitle>{menuTitle}</DialogTitle>
          <DialogDescription>{menuDescription}</DialogDescription>
        </DialogHeader>
        <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-0">
          {children}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{menuCancelButtonText}</Button>
          </DialogClose>
          <LoadingButton loading={actionIsPending || stateIsLoading} onClick={() => actionFunction()}>
            {menuActionButtonText}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={(v) => (v ? null : closeMenu())} open>
      <DrawerContent className={cn('flex h-fit max-h-[70vh] flex-col', drawerContentClassName)}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{menuTitle}</DrawerTitle>
          <DrawerDescription>{menuDescription}</DrawerDescription>
        </DrawerHeader>

        <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-0">
          {children}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{menuCancelButtonText}</Button>
          </DrawerClose>
          <LoadingButton loading={actionIsPending || stateIsLoading} onClick={() => actionFunction()}>
            {menuActionButtonText}
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ResponsiveDialogDrawer
