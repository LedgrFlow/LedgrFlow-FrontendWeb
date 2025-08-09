import * as monaco from "monaco-editor";

export function validateLedger(model: monaco.editor.ITextModel) {
  const text = model.getValue().split("\n");
  const markers: monaco.editor.IMarkerData[] = [];

  // Para validación de impuestos desde YAML
  const taxes = new Set<string>();

  let inYaml = false;
  for (let i = 0; i < text.length; i++) {
    const line = text[i];

    // Detectar inicio y fin de YAML
    if (line.trim() === "---") {
      inYaml = !inYaml;
      continue;
    }

    if (inYaml) {
      const matchTax = /^\s*([\w]+):\s*['"]?([\d\.]+)['"]?$/.exec(line);
      if (matchTax && text[i - 1]?.trim() === "taxes:") {
        taxes.add(matchTax[1]);
      }
      continue;
    }

    // Validar fecha en primera palabra de una transacción
    if (/^\d/.test(line) && !/^\d{4}-\d{2}-\d{2}/.test(line)) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "La transacción debe comenzar con fecha en formato YYYY-MM-DD",
        startLineNumber: i + 1,
        startColumn: 1,
        endLineNumber: i + 1,
        endColumn: line.length + 1,
      });
    }

    // Validar cuentas con monto sin moneda
    const cuentaMonto =
      /^ {2,}([A-Za-z_][\w:]+)\s+([\d\.,]+)(?:\s+([A-Z]{3}))?/.exec(line);
    if (cuentaMonto) {
      const moneda = cuentaMonto[3];
      if (!moneda) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: "Monto sin moneda especificada",
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1,
        });
      }
    }

    // Validar impuestos desconocidos
    const impuesto = /[+\-=]{(\w+)}/.exec(line);
    if (impuesto && !taxes.has(impuesto[1])) {
      markers.push({
        severity: monaco.MarkerSeverity.Info,
        message: `Impuesto desconocido: ${impuesto[1]}`,
        startLineNumber: i + 1,
        startColumn: 1,
        endLineNumber: i + 1,
        endColumn: line.length + 1,
      });
    }
  }

  monaco.editor.setModelMarkers(model, "ledger", markers);
}
