// --- UTILIDADES PARA BLOQUES ---

import type { Block } from "@/types/backend/ledger-back.types";
import React from "react";

/**
 * Ordena bloques por el primer índice (en caso de arrays) o índice simple.
 */
export function sortBlocks(blocks: Block[]): Block[] {
  return [...blocks].sort((a, b) => {
    const aIndex = Array.isArray(a.index) ? a.index[0] : a.index;
    const bIndex = Array.isArray(b.index) ? b.index[0] : b.index;
    return aIndex - bIndex;
  });
}

/**
 * Reindexa consecutivamente bloques tipo line y transaction.
 */
export function updateIndexes(blocksToUpdate: Block[]): Block[] {
  let currentIndex = 0;
  return blocksToUpdate.map((block) => {
    if (block.type === "line") {
      const newBlock = { ...block, index: currentIndex };
      currentIndex++;
      return newBlock;
    } else if (block.type === "transaction") {
      const length = block.lines.length;
      const newIndices = Array.from({ length }, (_, i) => currentIndex + i);
      currentIndex += length;
      return { ...block, index: newIndices };
    }
    return block;
  });
}

/**
 * Inserta una línea vacía después del índice dado y reindexa.
 * Devuelve el nuevo arreglo y el índice de la línea insertada.
 */
export function insertLineAfter(
  blocks: Block[],
  afterIndex: number
): { blocks: Block[]; insertedIndex: number | null } {
  const pos = blocks.findIndex((b) => {
    if (b.type === "line") return b.index === afterIndex;
    if (b.type === "transaction") return b.index.includes(afterIndex);
    return false;
  });
  if (pos === -1) return { blocks, insertedIndex: null };

  const newLine: Block = { type: "line", index: -1, line: "" };
  const newBlocks = [...blocks];
  newBlocks.splice(pos + 1, 0, newLine);
  const updated = updateIndexes(newBlocks);
  return { blocks: updated, insertedIndex: updated[pos + 1].index as number };
}

/**
 * Inserta una línea vacía al final y devuelve el nuevo arreglo y el índice insertado.
 */
export function insertLineAtEnd(blocks: Block[]): {
  blocks: Block[];
  insertedIndex: number;
} {
  const maxIndex = blocks.length
    ? Math.max(
        ...blocks.map((b) =>
          Array.isArray(b.index) ? Math.max(...b.index) : b.index
        )
      )
    : -1;
  const newLine: Block = { type: "line", index: maxIndex + 1, line: "" };
  const newBlocks = [...blocks, newLine];
  return { blocks: newBlocks, insertedIndex: newLine.index as number };
}

/**
 * Elimina línea por índice y devuelve el nuevo arreglo reindexado.
 */
export function deleteLineByIndex(
  blocks: Block[],
  indexToDelete: number
): Block[] {
  const filtered = blocks.filter(
    (b) => !(b.type === "line" && b.index === indexToDelete)
  );
  return updateIndexes(filtered);
}

// --- FUNCIÓN DE FOCO EN UN ELEMENTO POR REF ---
// Recibe Map de refs y un índice, enfoca el elemento (usa setTimeout para evitar problemas de render)
export function focusLine(
  editableRefs: Map<number, HTMLDivElement>,
  index: number
) {
  setTimeout(() => {
    const el = editableRefs.get(index);
    if (el) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, 0);
}

// nuevo hook para manejar el menú contextual
export function useSlashMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);

  const openMenu = (index: number, rect: DOMRect) => {
    setPosition({ x: rect.left, y: rect.bottom });
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setCurrentIndex(null);
  };

  return { isOpen, position, currentIndex, openMenu, closeMenu };
}
