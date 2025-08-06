export interface FileDetails {
  file_content: string;
  file_extension: string;
  file_size: number;
  id: string;
  modified_at: string;
  name: string;
  uploaded_at: string;
  user_id: string;
}

export interface ResponseGetFile {
  file: FileDetails;
}

// FIX Tipos ya creados

// Tipos base
export interface FileItem {
  id: string;
  name: string;
  file_extension: string;
  file_size: number;
  modified_at: string;
  uploaded_at: string;
}

export interface FileWithContent extends FileItem {
  file_content: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface FileListResponse {
  files: FileItem[];
  pagination: PaginationInfo;
}

export interface FileCreateData {
  name: string;
  file_content: string;
  file_extension?: string;
}

export interface FileUpdateData {
  name?: string;
  file_content?: string;
}
