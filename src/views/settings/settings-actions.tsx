import { useEffect, useState } from "react";
import { Trash, KeyIcon, XIcon, Save } from "lucide-react";
import { InputWithIcon } from "./components/inputs";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsActionsButton() {
  const [showModal, setShowModal] = useState(false);
  const { updateSettings, updateUser, user } = useAuth();

  const handleSaveSettings = () => {
    updateSettings();
    updateUser();
  };

  return (
    <>
      <section className="w-full h-full flex flex-col items-start justify-between gap-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-7 py-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="max-w-lg text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
              Guardar configuraciones
            </h1>
            <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
              Guarda tu configuración actual para recuperarla más tarde.
            </p>
          </div>

          <button
            // disabled={isLoadingUploadSettings}
            onClick={() => handleSaveSettings()}
            className="transition-all duration-300 w-[fit-content] text-white px-4 py-1 rounded-md text-md bg-black dark:bg-neutral-500/30 border-2 border-white-500/70 flex items-center gap-2 hover:bg-neutral-500/50"
          >
            <Save className="w-4 h-4 text-white-400" />
            Guardar configuraciones
          </button>
        </div>

        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="max-w-lg text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
              Eliminar cuenta
            </h1>
            <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
              Recuerda que si eliminas tu cuenta, no podrás recuperarla y tus
              datos se borrarán definitivamente.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="transition-all duration-300 w-[fit-content] text-white px-4 py-1 rounded-md text-md bg-red-500/30 border-2 border-red-500/70 flex items-center gap-2 hover:bg-red-500/50"
          >
            <Trash className="w-4 h-4 text-red-400" />
            Eliminar cuenta
          </button>
        </div>
      </section>

      {showModal && (
        <ModalDeleteAccount
          keyword={`@delete/${user?.username}`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
function ModalDeleteAccount({
  onClose,
  keyword = "delete/@bruce",
}: {
  onClose: () => void;
  keyword?: string;
}) {
  const { deleteUser } = useAuth();
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);

  const isMatch = input.trim() === keyword;

  // Activar animación después del montaje
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative w-full max-w-xl bg-neutral-900 rounded-xl p-5 py-12 border border-neutral-500/50 shadow-lg transform transition-all duration-300 ease-out",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <button
          onClick={onClose}
          className="p-2 bg-neutral-950/70 rounded-md absolute top-2 right-2 cursor-pointer hover:bg-neutral-900/80 transition"
        >
          <XIcon className="w-4 h-4" />
        </button>

        <h1 className="text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
          Eliminar cuenta
        </h1>
        <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
          Al eliminar tu cuenta, toda tu información será borrada de forma
          permanente. Esta acción no se puede deshacer.
        </p>

        <div className="w-full p-4 bg-red-700/10 border border-neutral-500/40 rounded-lg mt-5">
          <p>
            Para confirmar, escribe exactamente{" "}
            <span className="text-red-400 font-extrabold">{keyword}</span> en el
            cuadro de texto.
          </p>
        </div>

        <div className="mt-3">
          <InputWithIcon
            Icon={KeyIcon}
            value={input}
            setValue={setInput}
            placeholder="Escribe la clave de confirmación"
            label="Palabra clave"
          />
        </div>

        <button
          disabled={!isMatch}
          onClick={() => deleteUser()}
          className={clsx(
            "w-full py-2 border-2 flex items-center gap-2 rounded-md text-md justify-center mt-9 transition-all duration-300",
            isMatch
              ? "bg-red-500/30 border-red-500/70 text-white hover:bg-red-500/50 cursor-pointer"
              : "bg-neutral-800 border-neutral-600 text-gray-400 cursor-not-allowed"
          )}
        >
          <Trash className="w-4 h-4 text-red-400" />
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}
