import { useUI } from "@/contexts/UIContext";
import clsx from "clsx";
import { useMemo } from "react";

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useUI();
  const styles = useMemo(() => {
    const currentTheme = document.documentElement.classList.toString();
    const isDark = currentTheme.includes("dark");
    const isLight = currentTheme.includes("light") || !isDark;

    if (isDark)
      return {
        backgroundColor: "hsla(0,1%,3%,1)",
        backgroundImage: `radial-gradient(at 1% 96%, hsla(287,81%,75%,0.31) 0px, transparent 50%),
radial-gradient(at 35% 2%, hsla(61,100%,71%,0.31) 0px, transparent 50%),
radial-gradient(at 77% 88%, hsla(217,65%,67%,0.42) 0px, transparent 50%)`,
      };
    else if (isLight)
      return {
        backgroundColor: `hsla(0,0%,100%,1)`,
        backgroundImage: `radial-gradient(at 1% 96%, hsla(287,81%,75%,0.63) 0px, transparent 50%),
radial-gradient(at 35% 2%, hsla(61,100%,71%,0.31) 0px, transparent 50%),
radial-gradient(at 77% 88%, hsla(217,65%,67%,0.78) 0px, transparent 50%)`,
      };
  }, [theme]);

  return (
    <div className="w-full h-full min-h-screen relative" style={styles}>
      <div className={clsx("w-full h-full absolute top-0 left-0 z-0", theme === "dark" ? "bg-black/60" : "bg-white/30")}></div>
      {children}
    </div>
  );
}
