import { WindowTheme } from "@/components/common/window-theme";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { SelectComponent } from "@/views/settings/components/inputs";
import { AppWindow } from "lucide-react";
import { useEffect, useState } from "react";

export function SettingsApplicationSection() {
  const { selectTheme } = useUI();
  const { settings, updateTemporalSettings } = useAuth();
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("es");
  const [timeFormat, setTimeFormat] = useState("24h");

  useEffect(() => {
    if (settings) {
      setTheme(settings.app_theme || "light");
      setLanguage(settings.language || "es");
      setTimeFormat(settings.time_format || "24h");
    }
  }, [settings]);

  useEffect(() => {
    updateTemporalSettings({
      app_theme: theme as "light" | "dark",
      language,
      time_format: timeFormat as "24h" | "12h",
    });
  }, [theme, language, timeFormat]);

  useEffect(() => {
    selectTheme(theme);
  }, [theme]);

  return (
    <section className="w-full h-full flex items-start justify-between gap-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-7 py-8">
      <div className="w-full h-full flex flex-col gap-5 rounded-xl flex-1">
        <div className="w-full flex flex-col gap-5 max-w-xl">
          <div className="w-full flex items-center gap-3">
            <AppWindow className="w-10 h-10 text-white/60" />
            <div>
              <h1 className="max-w-lg text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
                Aplicacion
              </h1>
              <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
                Configuraciones asociadas a tu aplicacion
              </p>
            </div>
          </div>

          <div className="w-full flex items-center gap-5">
            <WindowTheme
              size={230}
              label="Claro"
              onSelected={setTheme}
              isSelected={theme === "light"}
            />
            <WindowTheme
              size={230}
              label="Oscuro"
              theme="dark"
              onSelected={setTheme}
              isSelected={theme === "dark"}
            />
            <WindowTheme
              size={230}
              label="Sistema"
              theme="system"
              onSelected={setTheme}
              isSelected={theme === "system"}
            />
          </div>

          <div>
            <SelectComponent
              disabled
              labelComponent="Selecciona un idioma"
              placeholder="Idioma"
              defaultValue={language}
              onSelect={setLanguage}
              options={[
                {
                  label: "Español",
                  value: "es",
                },
                {
                  label: "Inglés",
                  value: "en",
                },
              ]}
            />
          </div>

          <div>
            <SelectComponent
              labelComponent="Selecciona formato de fecha"
              placeholder="Formato de fecha"
              defaultValue={timeFormat}
              onSelect={setTimeFormat}
              options={[
                {
                  label: "24h (23:59)",
                  value: "24h",
                },
                {
                  label: "12h (11:59 PM)",
                  value: "12h",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
