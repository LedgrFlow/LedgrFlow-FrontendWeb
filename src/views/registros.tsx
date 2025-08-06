import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLedgerRegister } from "@/hooks/services/registros";
import { LedgerTable } from "@/components/tables/table-journal";

type Entry = {
  id: string;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
};

type EditingCell = {
  id: string;
  key: keyof Entry;
} | null;

function Registers() {
  return (
    <div className="bg-white dark:bg-black pace-y-8 p-6 text-black dark:text-white">
      <h1 className="max-w-lg text-3xl font-semibold leading-loose text-gray-900 dark:text-white">
        Registros Diarios
      </h1>
      <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
        Administra y visualiza tus transacciones contables en un solo lugar.
        Añade, edita y guarda registros fácilmente.
      </p>
      {/* Tabla */}
      <div className="overflow-x-auto border rounded-lg mt-5">
        <LedgerTable transactions={[]} />

        {/* Footer */}
        {/* <div className="flex items-center justify-between p-3 border-t bg-gray-50 dark:bg-black">
          <Button
            variant="ghost"
            onClick={handleAddRow}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Añadir fila
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => alert("Cambios guardados (simulado)")}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default Registers;
