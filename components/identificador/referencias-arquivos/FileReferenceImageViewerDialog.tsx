"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TbDownload, TbExternalLink } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { handleDownload } from "@/utils/methods/firebase";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_BUTTON_FACTOR = 1.25;
const WHEEL_ZOOM_FACTOR = 1.1;

type Pan = { x: number; y: number };

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

type ZoomableImageViewportProps = {
  imageUrl: string;
  title: string;
  active: boolean;
};

function ZoomableImageViewport({ imageUrl, title, active }: ZoomableImageViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ pointerId: number; startX: number; startY: number; panX: number; panY: number } | null>(
    null,
  );

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const resetView = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!active) resetView();
  }, [active, resetView]);

  useEffect(() => {
    resetView();
  }, [imageUrl, resetView]);

  const applyZoom = useCallback((nextScale: number, anchor?: { x: number; y: number }) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setScale(clampScale(nextScale));
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const anchorX = anchor?.x ?? rect.width / 2;
    const anchorY = anchor?.y ?? rect.height / 2;

    setScale((currentScale) => {
      const clamped = clampScale(nextScale);
      const ratio = clamped / currentScale;
      setPan((currentPan) => ({
        x: anchorX - (anchorX - currentPan.x) * ratio,
        y: anchorY - (anchorY - currentPan.y) * ratio,
      }));
      return clamped;
    });
  }, []);

  const zoomIn = useCallback(() => {
    applyZoom(scale * ZOOM_BUTTON_FACTOR);
  }, [applyZoom, scale]);

  const zoomOut = useCallback(() => {
    applyZoom(scale / ZOOM_BUTTON_FACTOR);
  }, [applyZoom, scale]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !active) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const factor = event.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR;
      const anchor = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setScale((currentScale) => {
        const nextScale = clampScale(currentScale * factor);
        const ratio = nextScale / currentScale;
        setPan((currentPan) => ({
          x: anchor.x - (anchor.x - currentPan.x) * ratio,
          y: anchor.y - (anchor.y - currentPan.y) * ratio,
        }));
        return nextScale;
      });
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      }
      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
      }
      if (event.key === "0") {
        event.preventDefault();
        resetView();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, resetView, zoomIn, zoomOut]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({
      x: drag.panX + (event.clientX - drag.startX),
      y: drag.panY + (event.clientY - drag.startY),
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-[0.65rem]">
          Role para zoom · Arraste quando ampliado · Teclas + / − / 0
        </p>
        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={zoomOut} aria-label="Diminuir zoom">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="min-w-12 text-center text-xs font-medium tabular-nums">{zoomPercent}%</span>
          <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={zoomIn} aria-label="Aumentar zoom">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={resetView}
            disabled={scale === 1 && pan.x === 0 && pan.y === 0}
            aria-label="Redefinir zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={cn(
          "relative h-[min(75vh,720px)] w-full overflow-hidden rounded-md bg-black/5 touch-none",
          scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="relative h-full w-full will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="pointer-events-none object-contain select-none"
            sizes="(max-width: 1100px) 92vw, 1100px"
            priority
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

type FileReferenceImageViewerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
};

function FileReferenceImageViewerDialog({
  open,
  onOpenChange,
  imageUrl,
  title,
}: FileReferenceImageViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed top-[50%] left-[50%] z-[200] grid w-full max-w-[min(92vw,1100px)] translate-x-[-50%] translate-y-[-50%] gap-3 border bg-background p-4 shadow-lg duration-200 sm:rounded-lg sm:p-6",
            "flex max-h-[92vh] flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <DialogHeader>
            <DialogTitle className="pr-8 text-sm leading-snug">{title}</DialogTitle>
            <DialogDescription className="sr-only">Visualização ampliada do anexo de imagem com zoom.</DialogDescription>
          </DialogHeader>
          <ZoomableImageViewport imageUrl={imageUrl} title={title} active={open} />
          <DialogFooter className="gap-2 sm:justify-between">
            <Button type="button" variant="outline" size="sm" className="gap-1" asChild>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <TbExternalLink className="h-3.5 w-3.5" />
                ABRIR EM NOVA GUIA
              </a>
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1"
              onClick={() => handleDownload({ fileName: title, fileUrl: imageUrl })}
            >
              <TbDownload className="h-3.5 w-3.5" />
              BAIXAR
            </Button>
          </DialogFooter>
          <DialogPrimitive.Close
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}

export default FileReferenceImageViewerDialog;
