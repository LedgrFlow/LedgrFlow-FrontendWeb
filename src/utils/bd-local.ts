// fileStorage.ts
import { openDB } from "idb";

const DB_NAME = "ledger-temp-storage";
const STORE = "files";

interface StoredFileMeta {
  file: File;
  timestamp: number;
}

export class FileStorage {
  private static ttlMs: number = 60 * 60 * 1000; // por defecto 1h

  static configureTTL(ms: number) {
    this.ttlMs = ms;
  }

  private static async getDB() {
    return await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }

  static isValidFileType(file: File): boolean {
    const allowedTypes = ["text/plain", "text/markdown"];
    const allowedExtensions = [".ledger", ".md"];

    const nameValid = allowedExtensions.some((ext) => file.name.endsWith(ext));
    const typeValid = allowedTypes.includes(file.type) || file.type === "";

    return nameValid && typeValid;
  }

  static async saveFile(file: File): Promise<void> {
    if (!this.isValidFileType(file)) {
      throw new Error("Archivo no permitido. Solo se aceptan .ledger y .md");
    }

    const db = await this.getDB();
    const key = file.name;

    const record: StoredFileMeta = {
      file,
      timestamp: Date.now(),
    };
    await db.put(STORE, record, key);
  }

  static async getAllFiles(): Promise<File[]> {
    const db = await this.getDB();
    const all: File[] = [];

    for (
      const cursor = await db.transaction(STORE).store.openCursor();
      cursor;
      await cursor.continue()
    ) {
      const record = cursor.value as StoredFileMeta;
      const expired = Date.now() - record.timestamp > this.ttlMs;
      if (!expired) {
        all.push(record.file);
      } else {
        await cursor?.delete(); // eliminar expirado
      }
    }

    return all;
  }

  static async deleteFile(key: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE, key);
  }

  static async clearAll(): Promise<void> {
    const db = await this.getDB();
    await db.clear(STORE);
  }
}
