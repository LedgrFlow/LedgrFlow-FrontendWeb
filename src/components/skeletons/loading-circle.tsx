export function LoadingCircle({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-pink-400 text-2xl animate-spin flex items-center justify-center border-t-pink-400 rounded-full"></div>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
