import { ChartLineStep } from "@/components/charts/chart-step";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/contexts/FilesContext";
import { DateFormatter } from "@/utils/date";
import { formatCurrency } from "@/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { File } from "lucide-react";
import { useEffect, useMemo } from "react";

const dateFormater = new DateFormatter();

type Event = {
  created_at: string; // formato ISO
  event: string;
};
function countEventsByDate(events: Event[]) {
  if (events.length === 0) return [];

  // Extraer todas las fechas base (solo YYYY-MM-DD)
  const uniqueDates = new Set(
    events.map((e) => new Date(e.created_at).toISOString().split("T")[0])
  );

  // Si solo hay una fecha, agrupamos por hora
  const byHour = uniqueDates.size === 1;

  const counts: Record<string, number> = {};

  for (const event of events) {
    const date = new Date(event.created_at);
    const key = byHour
      ? `${date.getHours().toString().padStart(2, "0")}:00`
      : date.toISOString().split("T")[0];

    counts[key] = (counts[key] || 0) + 1;
  }

  // Convertir a array para graficar o mostrar
  return Object.entries(counts).map(([date, activity]) => ({
    date,
    activity,
  }));
}

export default function ProfileView() {
  const { userActivities, getUserActivity } = useAuth();
  const { dataFiles } = useFiles();
  const { user } = useAuth();

  const activityByDay = useMemo(() => {
    return countEventsByDate(userActivities);
  }, [userActivities]);

  useEffect(() => {
    getUserActivity();
  }, []);

  return (
    <div className="w-full p-4 space-y-6">
      <div className="w-full min-h-[200px] rounded-xl bg-no-repeat bg-cover bg-center relative bg-[url(https://images.pexels.com/photos/1398431/pexels-photo-1398431.jpeg?_gl=1*y7tygp*_ga*MTk0MTMwMDExNi4xNzUzMzI1NzY4*_ga_8JE65Q40S6*czE3NTQyNzk4MTkkbzQkZzEkdDE3NTQyNzk4NDEkajM4JGwwJGgw)]">
        <div className="absolute -bottom-[65%] left-[5%]">
          <div className="p-3 bg-background rounded-lg w-[fit-content]">
            <Avatar className="w-32 h-32 flex items-center justify-center ">
              <AvatarImage
                src={user?.avatar_url}
                alt="profile avatar"
                className="rounded-md object-cover"
              />
              <AvatarFallback className="text-5xl">
                {user?.first_name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-1">
            <div className="w-full h-full flex flex-col">
              <h1 className="text-2xl font-semibold leading-loose text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name}{" "}
                <span className="text-[12px] text-gray-400 dark:text-gray-500">
                  {user?.username}
                </span>
              </h1>
              <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-screen gap-4 mt-48 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-foreground/70">Pendiente</h1>
        <p className="text-lg mt-2 text-foreground/50">
          Futura sección de perfil ...
        </p>
      </div>

      {/* <div className="w-full h-screen flex gap-4 mt-48">
        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full h-[300px] rounded-xl relative flex gap-3">
            <div className="w-full h-full rounded-xl bg-card">
              <ChartLineStep
                title="Actividad"
                description="From January to June 2024"
                data={activityByDay}
                config={{
                  activity: {
                    label: "Actividad",
                    color: "#4eb3de",
                  },
                }}
                dataKey="activity"
                // height={250}
              />
            </div>

            <div className="rounded-xl w-full h-full max-w-[300px] bg-gradient-to-t from-blue-800 to-blue-500 flex flex-col justify-between px-6 py-12">
              <div className="flex flex-col w-full">
                <p className="text-md text-neutral-50 font-bold">
                  Meta de Ahorro
                </p>
                <p className="text-[12px] text-neutral-200">
                  {formatCurrency(900, "USD")}/{formatCurrency(1000, "USD")}
                </p>
              </div>
              <p className="dark:text-white text-7xl font-extrabold">95%</p>

              <p className="text-sm dark:text-neutral-50">
                Sigue asi mejorando tus finanzas
              </p>
            </div>
          </div>

          <div className="w-full h-full flex-1 rounded-xl bg-card p-4"></div>
        </div>
        <div className="w-full min-h-screen h-full max-w-[400px] rounded-xl bg-card px-1 py-4">
          <div className="h-full w-full flex flex-col justify-start items-start">
            {dataFiles?.map((file) => (
              <div
                key={file.id}
                className="w-full flex items-center justify-between text-sm dark:bg-black/70 px-3 py-2"
              >
                <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400 flex gap-2 font-bold">
                  <File className="w-4 h-4" /> {file.name}
                </p>
                <p className="text-left rtl:text-right text-[12px] text-gray-500 dark:text-gray-400">
                  {dateFormater.toRelative(file.modified_at)}
                </p>
              </div>
            ))}
          </div>
        </div> 
      </div> */}
    </div>
  );
}
