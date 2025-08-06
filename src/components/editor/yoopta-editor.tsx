import YooptaEditor, {
  createYooptaEditor,
  type YooptaContentValue,
  type YooptaOnChangeOptions,
} from "@yoopta/editor";
import { useMemo, useState } from "react";
import Paragraph from "@yoopta/paragraph";

const plugins = [Paragraph];

export function YooptaEditorComponent({ initialMarkdown = "" }: { initialMarkdown?: string }) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(value);
  };

  return (
    <div>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
