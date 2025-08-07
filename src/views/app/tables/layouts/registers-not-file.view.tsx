import { LoadingTable } from "@/components/skeletons/table-skeleton";

interface RegistersNotFileViewProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export function RegistersNotFileView({
  title,
  message,
  children,
}: RegistersNotFileViewProps) {
  return (
    <div className="w-full h-full py-5 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black z-10 flex justify-center items-center">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-white">
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
              className="flex-1 h-[200px] rounded-xl dark:bg-neutral-900 w-full"
            ></div>
          );
        })}
      </div>

      <LoadingTable rows={15} />
    </div>
  );
}
