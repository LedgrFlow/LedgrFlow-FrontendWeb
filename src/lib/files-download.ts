type FileExtension = "txt" | "csv" | "pdf" | "xlsx" | "ledger";

class DownloadLinks {
  // Genera link para contenido textual genérico (txt, csv, etc)
  static fromString(content: string, filename: string, ext: FileExtension) {
    const newExt = ext?.replaceAll(".", "") as FileExtension; // eliminamos puntos y espacios
    // Limpiamos el nombre para que no tenga extensión previa
    const mime = DownloadLinks.getMimeType(newExt);
    const blob = new Blob([content], { type: mime });
    return DownloadLinks.createDownloadLink(blob, filename, newExt);
  }

  private static createDownloadLink(
    blob: Blob,
    filename: string,
    ext: FileExtension
  ) {
    const newExt = ext?.replaceAll(".", "") as FileExtension; // eliminamos puntos y espacios
    // Limpiamos el nombre para que no tenga extensión previa
    const cleanName = DownloadLinks.removeExtension(filename);
    const fullFilename = `${cleanName}.${newExt}`;

    const url = URL.createObjectURL(blob);

    return {
      url,
      filename: fullFilename,
      revoke: () => URL.revokeObjectURL(url),
    };
  }

  // Elimina la extensión si existe (lo que va después del último punto)
  private static removeExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) return filename; // no tiene extensión

    // Obtenemos la parte antes del último punto
    let baseName = filename.substring(0, lastDotIndex);

    // Quitamos puntos y espacios al final por si acaso
    baseName = baseName.replace(/[.\s]+$/, "");

    return baseName;
  }

  private static getMimeType(ext: FileExtension): string {
    switch (ext) {
      case "txt":
        return "text/plain"; // default
      case "ledger":
        return "text/plain";
      // caso para otras extensiones si agregas después
      default:
        return "application/octet-stream";
    }
  }
}

export default DownloadLinks;
