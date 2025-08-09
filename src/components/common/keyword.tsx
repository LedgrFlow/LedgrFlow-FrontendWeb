export function ShortcutCtrlS() {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {/* <Keyboard className="w-4 h-4" /> */}
      <kbd className="px-2 py-1 rounded border text-xs">Ctrl</kbd>
      <span>+</span>
      <kbd className="px-2 py-1 rounded border text-xs">S</kbd>
    </div>
  );
}
