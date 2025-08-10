import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Block } from "@/types/backend/ledger-back.types";
import { LayoutBaseNotes } from "./layout-base.notes";

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

export const ComponentLine: React.FC<LineProps> = (props: LineProps) => {
  const { block, index, onLineChange, onKeyDown, editableRefs } = props;

  return (
    <LayoutBaseNotes {...props}>
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
        className="work-sans-400 outline-none"
      >
        {block?.line || ""}
      </div>
    </LayoutBaseNotes>
  );
};
