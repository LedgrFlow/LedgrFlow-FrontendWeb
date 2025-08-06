// ✅ Esta función sí puede ser dinámica
function parseThemes(modules: Record<string, any>) {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const name = path
        .replace(/^\.\/(editor|app)\//, "")
        .replace(".json", "")
        .replace(/['"]/g, "");

      return {
        id: name
          .replace(/[()]/g, "")
          .replace(/[_\s]+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
          .toLowerCase(),
        name,
        theme: (mod as any).default,
      };
    })
    .filter((theme) => theme.name !== "themelist");
}

// ✅ Importaciones con rutas literales (requerido por Vite)
const editorModules = import.meta.glob("./editor/*.json", { eager: true });

// ✅ Aplicamos parseo
const EDITOR_THEMES = [
  { id: "vs-dark", name: "vs-dark", theme: {} },
  { id: "vs", name: "vs", theme: {} },
  { id: "hc-black", name: "hc-black", theme: {} },
  ...parseThemes(editorModules),
];

export { EDITOR_THEMES };
