import {
  useCreateBlockNote,
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { useEffect, useRef } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";

// ==========================
// Schema personalizado
// ==========================
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

type MyEditor = typeof schema.BlockNoteEditor;

// ==========================
// Hook de debounce
// ==========================
function useDebouncedCallback(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };
}

// ==========================
// Componente principal
// ==========================
export function BlockNoteEditorComponent({
  cuentasContables = ["Cuenta 1", "Cuenta 2", "Cuenta 3"],
  initialMarkdown = "",
  onChange,
}: {
  cuentasContables: string[];
  initialMarkdown?: string;
  onChange?: (markdown: string) => void;
}) {
  const editor = useCreateBlockNote({ schema });

  // --------------------------
  // Inicializar contenido
  // --------------------------
  useEffect(() => {
    if (initialMarkdown.trim()) {
      editor.tryParseMarkdownToBlocks(initialMarkdown).then((blocks) => {
        editor.replaceBlocks(editor.document, blocks);
      });
    }
  }, [initialMarkdown, editor]);

  // --------------------------
  // Manejar cambios con debounce
  // --------------------------
  const debouncedChange = useDebouncedCallback(async () => {
    if (onChange) {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      onChange(markdown);
    }
  }, 500);

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      debouncedChange();
    });
    return () => unsubscribe();
  }, [editor, debouncedChange]);

  // --------------------------
  // Sugerencias de slash menu
  // --------------------------
  const createCuentaItem = (
    editor: MyEditor,
    cuenta: string
  ): DefaultReactSuggestionItem => ({
    title: cuenta,
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: cuenta,
            styles: {
              bold: false,
              italic: false,
              underline: false,
              strike: false,
              textColor: "default",
              backgroundColor: "default",
            },
          },
        ],
      });
    },
    group: "Cuentas Contables",
    icon: <HiOutlineClipboardList size={18} />,
  });

  const getCustomSlashMenuItems = (
    editor: MyEditor
  ): DefaultReactSuggestionItem[] => {
    const cuentasItems = cuentasContables.map((c) =>
      createCuentaItem(editor, c)
    );
    const defaultItems = getDefaultReactSlashMenuItems(editor).filter(
      (item) => !["Image", "Video", "Audio", "File"].includes(item.title)
    );
    return [...defaultItems, ...cuentasItems];
  };

  // --------------------------
  // Render
  // --------------------------
  return (
    <BlockNoteView editor={editor} theme="dark" className="py-5">
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) => {
          const items = getCustomSlashMenuItems(editor);
          return filterSuggestionItems(
            items.filter((item) =>
              query.length === 0
                ? true
                : item.title.toLowerCase().includes(query.toLowerCase())
            ),
            query
          );
        }}
      />
    </BlockNoteView>
  );
}
