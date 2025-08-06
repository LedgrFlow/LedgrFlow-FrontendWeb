import { AppLayout } from "./layouts/app";
import { AppRoute } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthContext";
import { FilesProvider } from "./contexts/FilesContext";
import { Toaster } from "react-hot-toast";
import { UIProvider } from "./contexts/UIContext";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <FilesProvider>
          <AppLayout>
            <AppRoute />
          </AppLayout>
        </FilesProvider>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{ duration: 3000, className: "bg-white dark:bg-black" }}
        />
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
