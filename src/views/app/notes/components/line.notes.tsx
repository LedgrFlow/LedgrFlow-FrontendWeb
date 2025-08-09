import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Block } from "@/types/backend/ledger-back.types";

interface LineProps {
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
}

export const ComponentLine: React.FC<LineProps> = ({
  block,
  index,
  onLineChange,
  onKeyDown,
  insertLineAfterIndex,
  editableRefs,
  isLast,
  draggableProvided,
  draggableSnapshot,
}) => (
  <div
    ref={draggableProvided.innerRef}
    {...draggableProvided.draggableProps}
    style={{
      userSelect: "none",
      padding: 8,
      marginBottom: 4,
      borderBottom: "1px solid #ddd",
      backgroundColor: draggableSnapshot.isDragging ? "#e0f7fa" : "white",
      display: "flex",
      alignItems: "center",
      ...draggableProvided.draggableProps.style,
    }}
  >
    <div
      {...draggableProvided.dragHandleProps}
      style={{
        marginRight: 8,
        cursor: "grab",
        padding: "4px 6px",
        backgroundColor: "#ccc",
        borderRadius: 4,
        userSelect: "none",
      }}
      aria-label="drag handle"
    >
      ☰
    </div>
    <div
      ref={(el) => {
        if (el) editableRefs.current.set(block.index as number, el);
        else editableRefs.current.delete(block.index as number);
      }}
      contentEditable
      suppressContentEditableWarning
      style={{ flex: 1, cursor: "text" }}
      onInput={(e) =>
        onLineChange(block.index as number, e.currentTarget.textContent || "")
      }
      onKeyDown={(e) => onKeyDown(e, block, index)}
      tabIndex={0}
    />
    {!isLast && (
      <button
        onClick={() => insertLineAfterIndex(block.index as number)}
        style={{
          marginLeft: 8,
          cursor: "pointer",
          userSelect: "none",
        }}
        aria-label="Agregar línea después"
      >
        +
      </button>
    )}
  </div>
);
