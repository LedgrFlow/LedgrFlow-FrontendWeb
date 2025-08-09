import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type RefObject,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import type { Block } from "@/types/backend/ledger-back.types";
import {
  sortBlocks,
  updateIndexes,
  insertLineAfter,
  insertLineAtEnd,
  deleteLineByIndex,
  focusLine,
} from "./notes.controller";

// --- COMPONENTE REACT ---

interface NotionLikeEditorProps {
  blocks: Block[];
  onChange?: (newBlocks: Block[]) => void;
  renderComponents?: Record<string, any>;
}

export const NotionLikeEditor: React.FC<NotionLikeEditorProps> = ({
  blocks,
  onChange,
  renderComponents,
}) => {
  const [orderedBlocks, setOrderedBlocks] = useState<Block[]>([]);

  // refs index -> elemento contentEditable
  const editableRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // ordenar y setear bloques al inicio
  useEffect(() => {
    setOrderedBlocks(sortBlocks(blocks));
  }, [blocks]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const reordered = Array.from(orderedBlocks);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);

      const updated = updateIndexes(reordered);
      setOrderedBlocks(updated);
      if (onChange) onChange(updated);
    },
    [orderedBlocks, onChange]
  );

  const onLineChange = useCallback((index: number, newText: string) => {
    setOrderedBlocks((old) =>
      old.map((b) => {
        if (b.type === "line" && b.index === index) {
          return { ...b, line: newText };
        }
        return b;
      })
    );
  }, []);

  const insertLineAfterIndex = useCallback(
    (afterIndex: number) => {
      setOrderedBlocks((old) => {
        const { blocks: updated, insertedIndex } = insertLineAfter(
          old,
          afterIndex
        );
        if (insertedIndex !== null) {
          focusLine(editableRefs.current, insertedIndex);
        }
        if (onChange) onChange(updated);
        return updated;
      });
    },
    [onChange]
  );

  const insertLineAtEndHandler = useCallback(() => {
    setOrderedBlocks((old) => {
      const { blocks: updated, insertedIndex } = insertLineAtEnd(old);
      focusLine(editableRefs.current, insertedIndex);
      if (onChange) onChange(updated);
      return updated;
    });
  }, [onChange]);

  const deleteLineIfEmptyHandler = useCallback(
    (index: number) => {
      setOrderedBlocks((old) => {
        const pos = old.findIndex(
          (b) => b.type === "line" && b.index === index
        );
        if (pos === -1) return old;

        const updated = deleteLineByIndex(old, index);

        if (pos - 1 >= 0 && updated.length > 0) {
          const prevBlock = updated[Math.min(pos - 1, updated.length - 1)];
          if (prevBlock.type === "line") {
            focusLine(editableRefs.current, prevBlock.index as number);
          } else {
            const firstLine = updated.find((b) => b.type === "line");
            if (firstLine)
              focusLine(editableRefs.current, firstLine.index as number);
          }
        } else if (updated.length > 0) {
          const firstLine = updated.find((b) => b.type === "line");
          if (firstLine)
            focusLine(editableRefs.current, firstLine.index as number);
        }
        if (onChange) onChange(updated);
        return updated;
      });
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, block: Block, idx: number) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const isLast = idx === orderedBlocks.length - 1;
        if (isLast && block.type === "line") {
          insertLineAtEndHandler();
        } else {
          if (block.type === "line") {
            insertLineAfterIndex(block.index as number);
          } else if (block.type === "transaction") {
            insertLineAfterIndex(block.index[block.index.length - 1]);
          }
        }
      } else if (e.key === "Backspace") {
        if (block.type === "line") {
          const text = (e.currentTarget.textContent || "").trim();
          if (text === "") {
            e.preventDefault();
            deleteLineIfEmptyHandler(block.index as number);
          }
        }
      }
    },
    [
      orderedBlocks.length,
      insertLineAfterIndex,
      insertLineAtEndHandler,
      deleteLineIfEmptyHandler,
    ]
  );

  // sincronizar contenido editable sin romper cursor
  useEffect(() => {
    orderedBlocks.forEach((block) => {
      if (block.type === "line") {
        const el = editableRefs.current.get(block.index as number);
        if (el && el.innerText !== block.line) {
          el.innerText = block.line;
        }
      }
    });
  }, [orderedBlocks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="notion-editor">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
          >
            {orderedBlocks.map((block, i) => {
              const Renderer = renderComponents[block.type];
              if (!Renderer) return null;

              return (
                <Draggable
                  key={
                    Array.isArray(block.index)
                      ? block.index.join(",")
                      : block.index
                  }
                  draggableId={
                    Array.isArray(block.index)
                      ? block.index.join(",")
                      : String(block.index)
                  }
                  index={i}
                >
                  {(provided, snapshot) => (
                    <Renderer
                      block={block}
                      index={i}
                      onLineChange={onLineChange}
                      onKeyDown={onKeyDown}
                      insertLineAfterIndex={insertLineAfterIndex}
                      editableRefs={editableRefs}
                      isLast={i === orderedBlocks.length - 1}
                      draggableProvided={provided}
                      draggableSnapshot={snapshot}
                    />
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
