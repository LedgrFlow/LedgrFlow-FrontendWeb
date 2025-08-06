import * as monaco from "monaco-editor";

export const linterLedger: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      // Comentarios con ;
      [/^\s*;+.*/, "comment"],

      // Enlaces tipo Markdown
      [/\[([^\]]+)\]\(([^)]+)\)/, "string.link"],

      // Hashtags tipo #tag
      [/#\w+/, "keyword.tag"],

      // Arrobas tipo @tag
      [/@\w+/, "type.annotation"],

      // Expresiones de impuestos: +{IVA}, -{ISR}, ={RETIRO}
      [/[+\-=]{\w+}/, "keyword.tax"],

      // Fechas comunes
      [/\b\d{2,4}[-\/\\]\d{2}[-\/\\]\d{2,4}\b/, "constant.date"],

      // Palabra clave account
      [/\baccount\b/, "keyword"],

      // Campos de cuenta
      [/\b(description|alias|type):/, "attribute.name"],

      // Metadatos entre corchetes
      [/^;;;?\s*\[[^\]]+\]/, "annotation.key"],

      // Valores bajo metadatos (cualquier línea que comience con ;;; pero no metakey)
      [/^;;;?.*/, "annotation.value"],

      // Dinero como $7,500.00 o $monto
      [/\$\d+(,\d{3})*(\.\d+)?|\$[a-zA-Z_]\w*/, "constant.numeric"],

      // Números
      [/\b\d{1,3}(,\d{3})*(\.\d+)?\b/, "number"],

      // Identificadores generales
      [/[a-zA-Z_][\w:\-]*/, "identifier"],

      // Indentación de cuentas
      [/[a-zA-Z_][\w-]*(?::[a-zA-Z_][\w-]*)+/, "type.account"],

      
    ],
  },
};
