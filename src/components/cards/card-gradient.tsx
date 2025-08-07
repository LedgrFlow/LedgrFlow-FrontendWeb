import { useUI } from "@/contexts/UIContext";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CardGradientProps extends React.ComponentProps<"div"> {
  isNeutral?: boolean;
  value: number;
  percentage?: number;
  title?: string;
  subs?: string[];
  usePercentage?: boolean;
  useStylePercentage?: boolean;
  useStyleNormal?: boolean;
  descriptions?: string[];
  useStyleNeutral?: boolean;
  useBackground?: boolean;
  currency?: string | undefined;
}

export function CardGradient({
  isNeutral = false,
  value = 250000,
  percentage = 0,
  title = "Balance",
  subs = ["Balance del último periodo"],
  usePercentage = false,
  useStylePercentage = false,
  descriptions = [],
  useStyleNeutral = false,
  currency,
  useBackground = true,
  ...props
}: CardGradientProps) {
  const { glassMode } = useUI();

  const isPositive = percentage > 0;
  const isNegative = percentage < 0;

  const formattedPercentage = `${Math.abs(percentage).toFixed(1)}%`;

  const description =
    percentage > 0
      ? descriptions[0]
      : percentage < 0
      ? descriptions[1]
      : descriptions[2];
  const sub = percentage > 0 ? subs[0] : percentage < 0 ? subs[1] : subs[2];

  const bgColorClass = clsx({
    // Normal (no glass)
    "bg-gradient-to-b from-[#025206] via-[#2B7022] to-[#3E9A43]":
      value > 0 && !isNeutral && !glassMode,
    "bg-gradient-to-b from-[#890000] via-[#9E0E0C] to-[#C92923]":
      value < 0 && !isNeutral && !glassMode,
    "bg-gradient-to-b from-[#615f06] via-[#A3A114] to-[#F6F119]":
      value === 0 && !isNeutral && !glassMode,

    // Glass mode con colores más saturados en modo claro
    "bg-gradient-to-b from-[rgba(2,82,6,0.75)] via-[rgba(43,112,34,0.75)] to-[rgba(62,154,67,0.75)] dark:from-[rgba(2,82,6,0.3)] dark:via-[rgba(43,112,34,0.3)] dark:to-[rgba(62,154,67,0.3)]":
      glassMode && value > 0 && !isNeutral,

    "bg-gradient-to-b from-[rgba(175,0,0,0.75)] via-[rgba(198,20,18,0.75)] to-[rgba(235,64,59,0.75)] dark:from-[rgba(137,0,0,0.3)] dark:via-[rgba(158,14,12,0.3)] dark:to-[rgba(201,41,35,0.3)]":
      glassMode && value < 0 && !isNeutral,

    "bg-gradient-to-b from-[rgba(120,118,10,0.75)] via-[rgba(200,198,30,0.75)] to-[rgba(255,252,50,0.75)] dark:from-[rgba(97,95,6,0.3)] dark:via-[rgba(163,161,20,0.3)] dark:to-[rgba(246,241,25,0.3)]":
      glassMode && value === 0 && !isNeutral,

    // Neutro
    "bg-white/90 dark:bg-neutral-900/60": isNeutral,
  });

  const glassEffectClass = clsx({
    "backdrop-blur-md border border-white/20 shadow-md": glassMode,
  });

  return (
    <div
      {...props}
      className={clsx(
        "w-full h-full rounded-2xl px-5 py-7 transition-colors duration-300",
        useBackground ? bgColorClass : "",
        useBackground ? glassEffectClass : "",
        isNeutral ? "text-black dark:text-white" : "text-white"
      )}
    >
      <div className="flex items-center justify-between py-2">
        <p
          className={clsx(
            "font-medium",
            isNeutral ? "text-neutral-950 dark:text-white" : "text-white"
          )}
        >
          {title}
        </p>

        {usePercentage && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full",
              {
                "bg-green-100 text-green-700": isPositive,
                "bg-red-100 text-red-700": isNegative,
                "bg-gray-200 text-gray-700": percentage === 0,
              }
            )}
          >
            {isPositive && <ArrowUpRight className="w-4 h-4" />}
            {isNegative && <ArrowDownRight className="w-4 h-4" />}
            {formattedPercentage}
          </span>
        )}
      </div>

      <p className="font-extrabold text-4xl">
        {useStylePercentage
          ? `${Math.abs(value).toFixed(1)}%`
          : useStyleNeutral
          ? value
          : formatCurrency(value, currency)}
      </p>

      <div className="mt-5">
        <p
          className={clsx(
            "text-left rtl:text-right",
            isNeutral
              ? "text-neutral-900 dark:text-neutral-200"
              : "text-neutral-200"
          )}
        >
          {description}
        </p>
        <p
          className={clsx(
            "text-[12px]",
            isNeutral ? "text-gray-500 dark:text-gray-400" : "text-gray-200"
          )}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
