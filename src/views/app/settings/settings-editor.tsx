import { MiniEditorPreview } from "@/components/skeletons/editor-vscode.skeleton";
import {
  InputWithIcon,
  SelectComponent,
  SwitchComponent,
} from "@/views/app/settings/components/inputs";
import { TextIcon, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { EDITOR_THEMES as Themes } from "@/themes/index";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import clsx from "clsx";

const themesDark = Themes.filter(({ theme }) => theme?.base === "vs-dark");
const themesLight = Themes.filter(({ theme }) => theme?.base === "vs");
const themesHighContrast = Themes.filter(
  ({ theme }) => theme?.base === "hc-black"
);
const themesDefault = Themes.filter(
  ({ theme }) =>
    theme?.base !== "vs-dark" &&
    theme?.base !== "vs" &&
    theme?.base !== "hc-black"
);

const themesDivide = {
  default: themesDefault,
  dark: themesDark,
  light: themesLight,
  // highContrast: themesHighContrast,
};

export function SettingsEditorSection() {
  const { glassMode } = useUI();
  const { settings, updateTemporalSettings } = useAuth();
  const [theme, setTheme] = useState("vs-dark"); // 🎯 Temas por defecto de Monaco
  const [fontSize, setFontSize] = useState(14);
  const [autoSave, setAutoSave] = useState(false);
  const [autoFormat, setAutoFormat] = useState(false);
  // const [autoComplete, setAutoComplete] = useState(true);
  // const [autoSuggest, setAutoSuggest] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(false);
  const [numberline, setNumerLine] = useState(false);

  useEffect(() => {
    if (settings) {
      setTheme(settings.editor_theme || "vs-dark");
      setFontSize(settings.font_size || 14);
      setAutoSave(settings.auto_save_file || false);
      setAutoFormat(settings.auto_format_on_save || false);
      // setAutoComplete(settings.editor_line_numbers || true);
      // setAutoSuggest(settings.editor_minimap_enabled || true);
      setWordWrap(settings.editor_word_wrap || false);
      setMinimap(settings.editor_minimap_enabled || false);
      setNumerLine(settings.editor_line_numbers || false);
    }
  }, [settings]);

  useEffect(() => {
    updateTemporalSettings({
      editor_theme: theme as "vs-dark" | "vs-light" | string,
      font_size: fontSize,
      auto_save_file: autoSave,
      auto_format_on_save: autoFormat,
      editor_word_wrap: wordWrap,
      editor_minimap_enabled: minimap,
      editor_line_numbers: numberline,
    });
  }, [theme, fontSize, autoSave, autoFormat, wordWrap, minimap, numberline]);

  return (
    <section
      className={clsx(
        "w-full h-full flex justify-between gap-5 items-center srounded-2xl p-7 py-8",
        glassMode ? "glass-card" : "bg-white dark:bg-black"
      )}
    >
      <div className="w-full h-full max-w-xl flex flex-col gap-5 min-h-[700px]">
        <div className="w-full flex items-center gap-3">
          <Code className="w-10 h-10 text-white/60" />
          <div>
            <h1 className="max-w-lg text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
              Editor
            </h1>
            <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
              Configuraciones asociadas al editor
            </p>
          </div>
        </div>

        <div className="w-full h-full flex items-center gap-5">
          <SelectComponent
            options={themesDivide}
            placeholder="Tema del editor"
            selectedLabel="Tema"
            labelComponent="Escoge un tema para el editor"
            refId="id"
            refLabel="name"
            redValue="id"
            defaultValue={theme}
            onSelect={(value) => setTheme(value)}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <InputWithIcon
            Icon={TextIcon}
            setValue={setFontSize}
            value={fontSize}
            placeholder="12"
            label="Tamaño de fuente"
            type="number"
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <SwitchComponent
            label="Autoguardado en el editor"
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <SwitchComponent
            label="Formato automático al guardar"
            checked={autoFormat}
            onCheckedChange={setAutoFormat}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <SwitchComponent
            label="Word Wrap automático"
            checked={wordWrap}
            onCheckedChange={setWordWrap}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <SwitchComponent
            label="Minimap"
            checked={minimap}
            onCheckedChange={setMinimap}
          />
        </div>

        <div className="w-full flex items-center gap-5">
          <SwitchComponent
            label="Numoro de linea"
            checked={numberline}
            onCheckedChange={setNumerLine}
          />
        </div>
      </div>

      <div className="w-full h-full rounded-xl overflow-hidden max-w-2xl">
        <MiniEditorPreview
          height={750}
          theme={theme}
          language="ledger"
          fontSize={fontSize}
          minimap={minimap}
          wordWrap={wordWrap ? "on" : "off"}
          numberline={numberline ? "on" : "off"}
        />
      </div>
    </section>
  );
}
