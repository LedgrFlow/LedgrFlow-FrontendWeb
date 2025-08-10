// menú contextual tipo Notion
export function SlashMenu({
  position,
  onSelect,
}: {
  position: { x: number; y: number };
  onSelect: (type: string) => void;
}) {
  const options = [
    { label: "Título", type: "title" },
    { label: "Párrafo", type: "line" },
    { label: "Transacción", type: "transaction" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        zIndex: 9999,
      }}
    >
      {options.map((opt) => (
        <div
          key={opt.type}
          onClick={() => onSelect(opt.type)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}
