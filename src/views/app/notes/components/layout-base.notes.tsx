import type { Block } from "@/types/backend/ledger-back.types";
import { PlusIcon } from "lucide-react";

import * as React from "react";

const SvgGrid3x3Icon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? "24"}
    height={props.height ?? "24"}
    className={props.className}
    viewBox="43 40 21 21" // Ajustado para que incluya el área del path
    fill="currentColor"
  >
    <path d="M60.85 51H57.7c-1.74 0-3.15 1.343-3.15 3v3c0 1.657 1.41 3 3.15 3h3.15c1.74 0 3.15-1.343 3.15-3v-3c0-1.657-1.41-3-3.15-3M49.3 51h-3.15C44.41 51 43 52.343 43 54v3c0 1.657 1.41 3 3.15 3h3.15c1.74 0 3.15-1.343 3.15-3v-3c0-1.657-1.41-3-3.15-3m11.55-11H57.7c-1.74 0-3.15 1.343-3.15 3v3c0 1.657 1.41 3 3.15 3h3.15c1.74 0 3.15-1.343 3.15-3v-3c0-1.657-1.41-3-3.15-3m-8.4 3v3c0 1.657-1.41 3-3.15 3h-3.15C44.41 49 43 47.657 43 46v-3c0-1.657 1.41-3 3.15-3h3.15c1.74 0 3.15 1.343 3.15 3" />
  </svg>
);

interface BaseLayoutProps {
  block: Block;
  index: number;
  onLineChange: (index: number, newText: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    block: Block,
    idx: number
  ) => void;
  insertLineAfterIndex: (index: number) => void;
  editableRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  isLast: boolean;
  draggableProvided: any;
  draggableSnapshot: any;
  children: React.ReactNode;
}

export function LayoutBaseNotes({
  block,
  insertLineAfterIndex,
  isLast,
  draggableProvided,
  draggableSnapshot,
  children,
}: BaseLayoutProps) {
  return (
    <div
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
      style={{
        userSelect: "none",
        padding: 8,
        marginBottom: 4,

        backgroundColor: draggableSnapshot.isDragging ? "#e0f7fa" : "white",
        display: "flex",
        alignItems: "center",
        ...draggableProvided.draggableProps.style,
      }}
      className="border-b border-transparent hover:border-b-neutral-400/40 transition duration-200"
    >
      {/* {!isLast && (
        <button
          onClick={() => insertLineAfterIndex(block.index as number)}
          style={{
            marginLeft: 8,
            cursor: "pointer",
            userSelect: "none",
          }}
          className="p-2 hover:bg-neutral-500/10 rounded-2xl mr-2 transition duration-200"
          aria-label="Agregar línea después"
        >
          <PlusIcon className="w-6 h-6 fill-current text-gray-600/20" />
        </button>
      )} */}
      <button
        onClick={() => insertLineAfterIndex(block.index as number)}
        style={{
          marginLeft: 8,
          cursor: "pointer",
          userSelect: "none",
        }}
        className="p-2 hover:bg-neutral-500/10 rounded-2xl mr-2 transition duration-200"
        aria-label="Agregar línea después"
      >
        <PlusIcon className="w-6 h-6 fill-current text-gray-600/20" />
      </button>
      <div
        {...draggableProvided.dragHandleProps}
        className="p-3 hover:bg-neutral-500/10 rounded-2xl transition duration-200"
        aria-label="drag handle"
      >
        <SvgGrid3x3Icon className="w-5 h-5 fill-current text-gray-600/20" />
      </div>
      <div className="w-full ml-3 bg-transparent hover:bg-neutral-400/5 transition-all duration-200 p-2">
        {children}
      </div>
    </div>
  );
}
