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
  ...props
}: CardGradientProps) {
  const bgColorClass = clsx({
    "bg-gradient-to-b from-[#025206] via-[#2B7022] to-[#3E9A43]":
      value > 0 && !isNeutral,
    "bg-gradient-to-b from-[#890000] via-[#9E0E0C] to-[#C92923]":
      value < 0 && !isNeutral,
    "bg-gradient-to-b from-[#615f06] via-[#A3A114] to-[#F6F119]":
      value === 0 && !isNeutral,
    "bg-white dark:bg-black": isNeutral,
  });

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

  return (
    <div
      {...props}
      className={clsx(
        "w-full h-full rounded-2xl px-5 py-7 transition-colors duration-300",
        bgColorClass,
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

        {!usePercentage ? (
          <></>
        ) : (
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
        <p className={
          clsx("text-left rtl:text-right", isNeutral ? "text-neutral-900 dark:text-neutral-200" : "text-neutral-200")
        }>
          {description}
        </p>
        <p className={clsx("text-[12px]", isNeutral ? "text-gray-500 dark:text-gray-400" : "text-gray-200")}>{sub}</p>
      </div>
    </div>
  );
}
