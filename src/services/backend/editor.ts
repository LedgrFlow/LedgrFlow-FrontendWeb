import axios from "axios";
import { LedgerApi } from "./ledger";

const API_BASE_URL = "http://localhost:8000/api/ledger/editor";

// Enviar archivo .md o .ledger
async function uploadEditorFile(file: File): Promise<{
  content: string;
  download_url: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/upload-file`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// Enviar contenido como texto y nombre de archivo
async function uploadEditorContent(
  text: string,
  filename = "manual.md"
): Promise<{
  content: string;
  download_url: string;
}> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("filename", filename);

  const response = await axios.post(`${API_BASE_URL}/upload-content`, formData);
  return response.data;
}

// Obtener contenido actual como string
async function getEditorContent(): Promise<{
  content: string;
  filename: string;
  download_url: string;
}> {
  const response = await axios.get(`${API_BASE_URL}/content`);
  return response.data;
}

// Actualizar el contenido del archivo actual
async function updateEditorContent(text: string): Promise<{
  message: string;
  download_url: string;
}> {
  const formData = new FormData();
  formData.append("text", text);

  const response = await axios.post(`${API_BASE_URL}/update`, formData);
  return response.data;
}

// Descargar el archivo directamente (puedes usar esta URL para href de un <a>)
function getDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/download/${encodeURIComponent(filename)}`;
}

// Exportar las funciones como módulo
export const EditorApi = {
  uploadFile: uploadEditorFile,
  uploadContent: uploadEditorContent,
  getContent: getEditorContent,
  updateContent: updateEditorContent,
  getDownloadUrl,
};
