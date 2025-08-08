import { GenericLineChart } from "@/components/skeletons/chart-skeleton";
import { useUI } from "@/contexts/UIContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

function generateDummyData(
  startDateStr: string,
  days: number,
  baseValue = 150,
  volatility = 40
) {
  const data = [];
  let value = baseValue;
  const startDate = new Date(startDateStr);

  for (let i = 0; i < days; i++) {
    // fecha del día i
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // fluctuación decorativa: valor anterior + cambio pequeño aleatorio + tendencia sinusoidal
    const sineWave = Math.sin(i / 10) * volatility * 0.6; // onda suave
    const randomFluctuation = (Math.random() - 0.5) * volatility; // fluctuación aleatoria

    value = Math.max(20, value + sineWave * 0.1 + randomFluctuation * 0.3); // evitar valor < 20

    data.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value),
    });
  }

  return data;
}

interface DashboardNotFileProps {
  message?: string;
  children?: React.ReactNode;
  title?: string;
}

export function DashboardNotFile({
  message,
  children,
  title,
}: DashboardNotFileProps) {
  const {glassMode} = useUI();
  const [dummyData, setDummyData] = useState(
    generateDummyData("2024-01-01", 180)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDummyData(generateDummyData("2024-01-01", 180));
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="px-7 py-9 space-y-8 text-black dark:text-white h-full min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-neutral-100/70 to-neutral-100/50 dark:via-black/30 dark:to-black/70 z-10 flex justify-center items-center">
        <div className="max-w-lg text-center text-black dark:text-white">
          <h1 className="text-3xl font-semibold">
            {title ?? "No has seleccionado ningún archivo"}
          </h1>
          <p className="text-muted-foreground text-sm mt-3">
            {message ??
              'Tus archivos aparecerán aquí una vez que subas o selecciones uno. ¡Vamos a empezar!"'}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 w-full mt-5">
            {children}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center gap-10 mb-10">
        {[1, 2, 3, 4].map((index) => {
          return (
            <div
              key={index}
              className={clsx("flex-1 h-[200px] rounded-xl w-full", glassMode ? "glass-card" : "dark:bg-neutral-900 bg-neutral-100")}
            ></div>
          );
        })}
      </div>

      <GenericLineChart
        data={dummyData}
        dataKey="value"
        title="Waiting for your action"
        description="This is a decorative chart during loading"
        colorVar="chart-2"
      />
    </div>
  );
}
