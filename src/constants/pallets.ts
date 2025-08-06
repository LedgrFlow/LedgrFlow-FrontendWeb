// /**
//  * Return the current theme of the user
//  * @returns The current theme of the user
//  */
// const getCurrentTheme = () => {
//   const theme = localStorage.getItem("theme");
//   return theme || "light";
// };

// /**
//  * This function defines the color based on the current theme.
//  * 1.- Light
//  * 2.- Dark
//  * default: Light
//  * @param colors Colors for themes
//  * @returns
//  */
// const defineColor = (...colors: string[] | string[][]) => {
//   const theme = getCurrentTheme();

//   if (theme === "light") return colors[0];
//   else if (theme === "dark") return colors[1];
//   else return colors[0];
// };

// const Base = {
//   background: defineColor("bg-white", "bg-black"),
//   foreground: defineColor("bg-neutral-50", "bg-neutral-900"),
//   titles: defineColor("text-neutral-900", "text-neutral-200"),
//   subtitles: defineColor("text-neutral-500", "text-neutral-400"),
//   accent: defineColor("text-red-500", "text-green-500"),
//   border: defineColor("border-neutral-500", "border-neutral-900"),
//   alerts: {
//     error: {
//       color: defineColor("text-red-500", "text-red-900"),
//       text: defineColor("text-red-500", "text-red-900"),
//       border: defineColor("border-red-500", "border-red-900"),
//       background: defineColor("bg-red-600/20", "bg-red-900/20"),
//     },
//     warning: defineColor("bg-yellow-500", "bg-yellow-900"),
//     info: defineColor("bg-blue-500", "bg-blue-900"),
//   },
// };

// const Dashboard = {
//   graphLine: {
//     expense: defineColor(, "#cb260e"),
//     income: defineColor(, "var(--chart-2)"),
//   },

//   graphPie: {
//     income: defineColor(
     
//       [
//         "#35fec2",
//         "#28ebb0",
//         "#1bd79e",
//         "#0dc48c",
//         "#00b07a",
//         "#84ccad",
//         "#a3d9c2",
//         "#c1e6d6",
//         "#e0f2eb",
//         "#ffffff",
//         "#c4e5d7",
//         "#a0c0b3",
//         "#7c9c8e",
//         "#59776a",
//         "#355246",
//       ]
//     ),
//     expense: defineColor(
     
//       [
//         "#c32945",
//         "#af1f37",
//         "#9a1528",
//         "#860a1a",
//         "#71000b",
//         "#ad2338",
//         "#b17171",
//         "#c59494",
//         "#d8b8b8",
//         "#ecdbdb",
//         "#ffffff",
//         "#be3244",
//         "#ce4251",
//         "#df515d",
//         "#ef616a",
//       ]
//     ),
//   },

//   graphBalance: {
//     balance: defineColor(, "#f6f3ba"),
//   },
// };

// const PalletHighlightStyle = {
//   date: "#f5ba90",
//   header: "#eb7072",
//   account: "#91c09e",
//   currency: "#eac761",
//   number: "#a2caa5",
//   comment: "#7d7769",
//   heading: "#f75e50",
//   list: "#e8df9c",
//   debug: "#5f545c",
// };

// export const Pallets = {
//   Base,
//   Dashboard,
// };

export default {
  // PalletHighlightStyle,
};
