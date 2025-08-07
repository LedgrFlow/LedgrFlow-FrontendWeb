import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface ProviderProps {
  children: ReactNode;
}

interface UIContextType {
  selectTheme: (theme: string) => void;
  glassMode: boolean;
  theme: string | undefined;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * This function is used to set the theme
 * @param param0 "light" | "dark" | "system" | string
 * @returns
 */
export const UIProvider: React.FC<ProviderProps> = ({ children }) => {
  const { settings } = useAuth();
  const [theme, setTheme] = useState<string | undefined>();
  const [glassMode, setGlassMode] = useState<boolean>(true);

  /** This function is used to set the theme */
  function selectTheme(theme: string) {
    if (!theme) return;
    let selectedTheme = "";

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    if (theme === "dark") selectedTheme = "dark";
    else if (theme === "light") selectedTheme = "light";
    else selectedTheme = systemTheme;

    localStorage.setItem("theme", selectedTheme);
    setTheme(selectedTheme);
  }

  useEffect(() => {
    const classTheme = document.documentElement.classList.toString();
    if (classTheme) document.documentElement.classList.remove(classTheme);
    if (theme) document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    setTheme(settings?.app_theme || "light");
  }, [settings]);

  // DEBUG

  if (import.meta.env.MODE === "development") {
    useEffect(() => {
      console.groupCollapsed("📦 UIContext Debug");
      console.log("THEME:", theme);
      console.groupEnd();
    }, [theme]);
  }

  //  Returns

  const value: UIContextType = {
    selectTheme,
    glassMode,
    theme,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
