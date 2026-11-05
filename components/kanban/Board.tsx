"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

type BoardElement = ReactElement<HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }>;

export type KanbanDropResult = {
  draggableId: string;
  source: { droppableId: string };
  destination: { droppableId: string };
};

const ColumnContext = createContext<string | null>(null);

// These boards persist status changes, rather than an order within each column.
// Keyboard navigation therefore moves directly between columns, including empty ones.
const columnCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
  if (event.code !== "ArrowLeft" && event.code !== "ArrowRight") return;
  event.preventDefault();
  const { active, over, collisionRect, droppableContainers, droppableRects } = context;
  if (!active || !collisionRect) return;
  const columns = droppableContainers
    .getEnabled()
    .filter((column) => droppableRects.has(column.id))
    .sort((a, b) => droppableRects.get(a.id)!.left - droppableRects.get(b.id)!.left);
  const current = columns.findIndex((column) =>
    over ? column.id === over.id : column.data.current?.columnId === active.data.current?.columnId,
  );
  const target = columns[current + (event.code === "ArrowRight" ? 1 : -1)];
  const rect = target && droppableRects.get(target.id);
  if (current < 0 || !rect) return;
  return { x: rect.left + (rect.width - collisionRect.width) / 2, y: rect.top };
};

export function KanbanBoard({
  children,
  onDragEnd,
}: {
  children: ReactNode;
  onDragEnd: (result: KanbanDropResult) => void;
}) {
  const id = useId();
  const [mounted, setMounted] = useState(false);
  const [overlay, setOverlay] = useState<BoardElement | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnCoordinates }),
  );
  useEffect(() => setMounted(true), []);

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={(args) => (args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args))}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Para mover o cartão, pressione espaço ou Enter. Use as setas esquerda e direita para escolher a coluna. Pressione espaço ou Enter para confirmar, ou Escape para cancelar.",
        },
        announcements: {
          onDragStart: () => "Cartão selecionado.",
          onDragOver: ({ over }) => (over ? `Coluna ${over.data.current?.columnId}.` : "Fora das colunas."),
          onDragEnd: ({ over }) =>
            over ? `Cartão solto na coluna ${over.data.current?.columnId}.` : "Movimento cancelado.",
          onDragCancel: () => "Movimento cancelado.",
        },
      }}
      onDragStart={({ active }) => setOverlay(active.data.current?.renderOverlay?.() ?? null)}
      onDragCancel={() => setOverlay(null)}
      onDragEnd={({ active, over }) => {
        setOverlay(null);
        const from = active.data.current?.columnId;
        const to = over?.data.current?.columnId;
        if (typeof from !== "string" || typeof to !== "string" || from === to) return;
        onDragEnd({
          draggableId: String(active.id),
          source: { droppableId: from },
          destination: { droppableId: to },
        });
      }}
    >
      {children}
      {mounted &&
        createPortal(
          <DragOverlay dropAnimation={null} zIndex={1000}>
            {overlay && (
              <div aria-hidden="true" inert style={{ pointerEvents: "none" }}>
                {overlay}
              </div>
            )}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}

export function KanbanColumn({ id, children }: { id: string; children: BoardElement }) {
  const { setNodeRef, isOver } = useDroppable({ id: `column:${id}`, data: { columnId: id } });
  return (
    <ColumnContext.Provider value={id}>
      {cloneElement(children, {
        ref: setNodeRef,
        style: {
          ...children.props.style,
          minHeight: 120,
          flexShrink: 0,
          outline: isOver ? "2px solid var(--primary)" : undefined,
          outlineOffset: -2,
        },
      })}
    </ColumnContext.Provider>
  );
}

export function KanbanCard({ id, children }: { id: string; children: BoardElement }) {
  const columnId = useContext(ColumnContext);
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id,
    data: { columnId, renderOverlay: () => children },
  });
  return cloneElement(children, {
    ref: setNodeRef,
    ...attributes,
    ...listeners,
    // Controls inside a card keep their normal click, text selection and keyboard behavior.
    onMouseDown: (event) => {
      if (!isInteractiveTarget(event.target, event.currentTarget)) listeners?.onMouseDown?.(event);
    },
    onTouchStart: (event) => {
      if (!isInteractiveTarget(event.target, event.currentTarget)) listeners?.onTouchStart?.(event);
    },
    onKeyDown: (event) => {
      if (event.target === event.currentTarget) listeners?.onKeyDown?.(event);
    },
    style: { ...children.props.style, opacity: isDragging ? 0.35 : undefined },
  });
}

function isInteractiveTarget(target: EventTarget, card: HTMLElement) {
  const control = (target as HTMLElement).closest(
    "button, a, input, textarea, select, [contenteditable], [role='button']",
  );
  return control !== null && control !== card;
}
