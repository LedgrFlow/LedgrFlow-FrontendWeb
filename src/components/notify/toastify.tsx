// ToastElement.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastComponent() {
  return (
    <ToastContainer
      position="bottom-right" // Posición del toast
      autoClose={3000} // Duración (ms) antes de cerrarse automáticamente
      hideProgressBar={false} // Muestra la barra de progreso
      newestOnTop={true} // Toasts más nuevos arriba
      closeOnClick // Cierre al hacer clic
      rtl={false} // Soporte para idiomas RTL (como árabe o hebreo)
      pauseOnFocusLoss // Pausa si pierdes el foco de la ventana
      draggable // Permite arrastrar el toast
      pauseOnHover // Pausa al pasar el mouse
      theme="colored" // Temas: "light", "dark", "colored"
      className={'w-full'}
    />
  );
}
