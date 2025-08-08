const stylesBadges = {
  green:
    "w-fit border border-green-300/70 px-3 py-1 rounded-xl text-xs dark:text-green-200 bg-green-400/10 text-green-600",
  red: "w-fit border border-red-300/70 px-3 py-1 rounded-xl text-xs dark:text-red-200 bg-red-400/10 text-red-600",
  yellow:
    "w-fit border border-yellow-300/70 px-3 py-1 rounded-xl text-xs dark:text-yellow-200 bg-yellow-400/10 text-yellow-600",
  blue: "w-fit border border-blue-300/70 px-3 py-1 rounded-xl text-xs dark:text-blue-200 bg-blue-400/10 text-blue-600",
  pink: "w-fit border border-pink-300/70 px-3 py-1 rounded-xl text-xs dark:text-pink-200 bg-pink-400/10 text-pink-600",
  purple:
    "w-fit border border-purple-300/70 px-3 py-1 rounded-xl text-xs dark:text-purple-200 bg-purple-400/10 text-purple-600",
  gray: "w-fit border border-gray-300/70 px-3 py-1 rounded-xl text-xs dark:text-gray-200 bg-gray-400/10 text-gray-600",
};

export interface Parents {
  Assets: string;
  Liabilities: string;
  Equity: string;
  Income: string;
  Expenses: string;
}

interface BadgeColorByParentProps {
  account: string;
  parents?: Parents;
}

export function returnBadgeColorByParent(
  account: string,
  parents: Parents | undefined = undefined
) {
  if (!parents)
    parents = {
      Assets: "Assets",
      Liabilities: "Liabilities",
      Equity: "Equity",
      Income: "Income",
      Expenses: "Expenses",
    };

  if (account === parents.Assets) return stylesBadges.purple;
  if (account === parents.Liabilities) return stylesBadges.blue;
  if (account === parents.Equity) return stylesBadges.yellow;
  if (account === parents.Income) return stylesBadges.green;
  if (account === parents.Expenses) return stylesBadges.pink;
  return stylesBadges.gray;
}
