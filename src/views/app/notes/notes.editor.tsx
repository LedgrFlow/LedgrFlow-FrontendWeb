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
  const [isDragging, setIsDragging] = useState(false);

  // refs index -> elemento contentEditable
  const editableRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Asignar IDs únicos a cada bloque
  useEffect(() => {
    const withIds = blocks.map((b) => ({
      ...b,
      id: b.id || crypto.randomUUID(),
    }));
    setOrderedBlocks(sortBlocks(withIds));
  }, [blocks]);

  const onDragStart = () => setIsDragging(true);
  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    if (!result.destination) return;

    const reordered = Array.from(orderedBlocks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updated = updateIndexes(reordered);
    setOrderedBlocks(updated);
    onChange?.(updated);
  };

  const onLineChange = useCallback(
    (index: number, newText: string) => {
      if (isDragging) return;
      setOrderedBlocks((old) =>
        old.map((b) =>
          b.type === "line" && b.index === index ? { ...b, line: newText } : b
        )
      );
    },
    [isDragging]
  );

  const insertLineAfterIndex = useCallback(
    (afterIndex: number) => {
      if (isDragging) return;
      setOrderedBlocks((old) => {
        const { blocks: updated, insertedIndex } = insertLineAfter(
          old,
          afterIndex
        );
        if (insertedIndex !== null) {
          focusLine(editableRefs.current, insertedIndex);
        }
        onChange?.(updated);
        return updated;
      });
    },
    [isDragging, onChange]
  );

  const insertLineAtEndHandler = useCallback(() => {
    if (isDragging) return;
    setOrderedBlocks((old) => {
      const { blocks: updated, insertedIndex } = insertLineAtEnd(old);
      focusLine(editableRefs.current, insertedIndex);
      onChange?.(updated);
      return updated;
    });
  }, [isDragging, onChange]);

  const onUpdateBlock = useCallback(
    (index, updatedBlock) => {
      if (isDragging) return;
      setOrderedBlocks((oldBlocks) => {
        const newBlocks = oldBlocks.map((b, i) =>
          i === index ? updatedBlock : b
        );
        onChange?.(newBlocks);
        return newBlocks;
      });
    },
    [isDragging, onChange]
  );

  const deleteLineIfEmptyHandler = useCallback(
    (index: number) => {
      if (isDragging) return;
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
        onChange?.(updated);
        return updated;
      });
    },
    [isDragging, onChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, block: Block, idx: number) => {
      if (isDragging) return;
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
      isDragging,
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
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
                <Draggable key={block.id} draggableId={block.id} index={i}>
                  {(provided, snapshot) => (
                    <Renderer
                      block={block}
                      key={block.id}
                      index={i}
                      indexBlock={block.index}
                      onLineChange={onLineChange}
                      onKeyDown={onKeyDown}
                      insertLineAfterIndex={insertLineAfterIndex}
                      onUpdateBlock={onUpdateBlock}
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
