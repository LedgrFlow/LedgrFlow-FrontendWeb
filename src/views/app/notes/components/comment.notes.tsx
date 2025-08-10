import { LayoutBaseNotes } from "./layout-base.notes";

export const ComponentComment = (props: any) => {
  const block = props.block;

  return (
    <LayoutBaseNotes {...props}>
      {block?.lines ? (
        block.lines.map((line, idx) => <div className="text-neutral-500/60" key={idx}>{line}</div>)
      ) : (
        <div>{block?.line}</div>
      )}
    </LayoutBaseNotes>
  );
};
