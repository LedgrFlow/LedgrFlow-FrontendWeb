import api from "@/config/axios";
import type {
  FileCreateData,
  FileItem,
  FileListResponse,
  FileUpdateData,
  ResponseGetFile,
} from "@/types/backend/files-back.types";

/**
 * Retrieves a paginated list of files.
 * @param {number} [page=1] - The current page number.
 * @param {number} [per_page=10] - The number of items per page.
 * @returns {Promise<FileListResponse>} The response containing the list of files.
 */
async function getFiles(
  page: number = 1,
  per_page: number = 10
): Promise<FileListResponse> {
  const res = await api.get("files/", {
    params: { page, per_page },
  });
  return res.data;
}

/**
 * Fetches a single file by its ID.
 * @param {string} fileId - The ID of the file to retrieve.
 * @returns {Promise<ResponseGetFile>} The response containing the file details.
 */
async function getFile(fileId: string): Promise<ResponseGetFile> {
  const res = await api.get(`files/${fileId}`);
  return res.data;
}

/**
 * Creates a new file from structured JSON data.
 * @param {FileCreateData} data - The file data to create.
 * @returns {Promise<{ file: FileItem; message: string }>} The created file and message.
 */
async function createFileFromJSON(
  data: FileCreateData
): Promise<{ file: FileItem; message: string }> {
  const res = await api.post("files/", data);
  return res.data;
}

/**
 * Uploads and creates a new file from a raw file input.
 * @param {File} file - The file to upload.
 * @returns {Promise<{ file: FileItem; message: string }>} The created file and message.
 */
async function createFileFromUpload(
  file: File
): Promise<{ file: FileItem; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("files/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

/**
 * Updates a file with new data.
 * @param {string} fileId - The ID of the file to update.
 * @param {FileUpdateData} data - The data to update the file with.
 * @returns {Promise<{ file: FileItem; message: string }>} The updated file and message.
 */
async function updateFile(
  fileId: string,
  data: FileUpdateData
): Promise<{ file: FileItem; message: string }> {
  const res = await api.put(`files/${fileId}`, data);
  return res.data;
}

/**
 * Deletes a file by its ID.
 * @param {string} fileId - The ID of the file to delete.
 * @returns {Promise<{ message: string }>} The response message after deletion.
 */
async function deleteFile(fileId: string): Promise<{ message: string }> {
  const res = await api.delete(`files/${fileId}`);
  return res.data;
}

/**
 * Searches for files using a query and/or file extension.
 * @param {string} [query] - Optional search term.
 * @param {string} [extension] - Optional file extension to filter by.
 * @returns {Promise<{ files: FileItem[]; total: number }>} Matching files and total count.
 */
async function searchFiles(
  query?: string,
  extension?: string
): Promise<{ files: FileItem[]; total: number }> {
  const res = await api.get("files/search", {
    params: {
      q: query,
      extension,
    },
  });
  return res.data;
}

export const FileService = {
  getFiles,
  getFile,
  createFileFromJSON,
  createFileFromUpload,
  updateFile,
  deleteFile,
  searchFiles,
};
