import { AppLayout } from "./layouts/app/app";
import { AppRoute } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthContext";
import { FilesProvider } from "./contexts/FilesContext";
import { UIProvider } from "./contexts/UIContext";
import { BaseLayout } from "./layouts/base/base.index";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <BaseLayout>
          <FilesProvider>
            <AppLayout>
              <AppRoute />
            </AppLayout>
          </FilesProvider>
        </BaseLayout>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
