import type { Block } from "@/types/backend/ledger-back.types";

interface TransactionProps {
  block: Block;
  index: number;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    block: Block,
    idx: number
  ) => void;
  draggableProvided: any;
  draggableSnapshot: any;
}

export const ComponentTransaction: React.FC<TransactionProps> = ({
  block,
  index,
  onKeyDown,
  draggableProvided,
  draggableSnapshot,
}) => (
  <div
    ref={draggableProvided.innerRef}
    {...draggableProvided.draggableProps}
    style={{
      userSelect: "none",
      padding: 8,
      marginBottom: 8,
      border: "1px solid #ccc",
      borderRadius: 4,
      backgroundColor: draggableSnapshot.isDragging ? "#e0f7fa" : "#f9f9f9",
      display: "flex",
      alignItems: "flex-start",
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
      contentEditable
      suppressContentEditableWarning
      style={{ flex: 1, cursor: "text" }}
      onKeyDown={(e) => onKeyDown(e, block, index)}
    >
      {block.lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </div>
  </div>
);
