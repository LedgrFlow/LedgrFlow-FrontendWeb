import clsx from "clsx";

function WindowThemeSystem({ size = 500 }: WindowThemeProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      className="relative"
    >
      <Window size={size} theme="light" />
      <div
        className="absolute bottom-0 right-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      >
        <Window size={size} theme="dark" />
      </div>
    </div>
  );
}

interface WindowThemeProps {
  size?: number;
  theme?: `light` | `dark` | `system`;
}

function Window({ size = 500, theme = "light" }: WindowThemeProps) {
  const sidebarWidth = size * 0.15;
  const contentPadding = size * 0.03;
  const headerHeight = size * 0.06;
  const boxHeight = size * 0.1;
  const fullBoxHeight = size * 0.16;
  const halfBoxHeight = size * 0.2;
  const borderRadius = Math.max(size * 0.03, 4); // asegura que no sea menor de 4px
  const gap = Math.max(size * 0.025, 4); // mínimo 4px
  const margin = Math.max(size * 0.025, 4); // similar al gap, mínimo 4px

  const background = theme === "dark" ? "bg-neutral-950" : "bg-neutral-200";
  const components = theme === "dark" ? "bg-neutral-800" : "bg-neutral-300";

  return (
    <div
      style={{
        width: size,
        height: size,
        minHeight: size,
        minWidth: size,
        borderRadius,
      }}
      className={clsx("flex overflow-hidden", background)}
    >
      <div
        style={{
          width: sidebarWidth,
          height: size,
        }}
        className={clsx(components)}
      ></div>

      <div
        style={{
          padding: contentPadding,
          height: size,
          gap: gap + 1,
        }}
        className="flex-1 flex flex-col"
      >
        <div
          style={{
            height: headerHeight,
            borderRadius,
          }}
          className={clsx("w-full", components)}
        ></div>

        <div
          style={{
            flex: 1,
            padding: contentPadding,
            borderRadius,
          }}
          className={clsx("w-full flex flex-col", components)}
        >
          <div
            style={{
              gap: gap,
              marginBottom: margin,
            }}
            className="flex"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{ height: boxHeight, borderRadius }}
                className={clsx("w-full", background)}
              ></div>
            ))}
          </div>

          <div
            style={{
              height: fullBoxHeight,
              borderRadius,
              marginBottom: margin,
            }}
            className={clsx("w-full", background)}
          ></div>

          <div
            style={{
              gap: gap,
            }}
            className="flex flex-1 h-full"
          >
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                style={{ borderRadius }}
                className={clsx("w-full h-full", background)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WindowTheme({
  label = "",
  size = 500,
  theme = "light",
  onSelected = (string: string) => {},
  isSelected = false,
}: {
  label?: string;
  size?: number;
  theme?: `light` | `dark` | `system`;
  isSelected?: boolean;
  onSelected?: (theme: `light` | `dark` | `system`) => void;
}) {
  const borderRadius = Math.max(size * 0.03, 4) + 2; // asegura que no sea menor de 4px

  return (
    <div>
      <div
        className={clsx(
          "border-3 p-1 cursor-pointer transition-all duration-300",
          isSelected
            ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
            : "border-transparent"
        )}
        style={{
          borderRadius,
        }}
        onClick={(e) => onSelected(theme)}
      >
        <div>
          {theme === "system" ? (
            <WindowThemeSystem size={size} />
          ) : (
            <Window size={size} theme={theme} />
          )}
        </div>
      </div>
      <div className="text-sm text-center mt-2 dark:text-neutral-100/80">
        <p>{label}</p>
      </div>
    </div>
  );
}
