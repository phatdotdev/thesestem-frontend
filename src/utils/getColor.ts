const avatarColors = [
  "bg-indigo-400",
  "bg-indigo-500",
  "bg-indigo-600",

  "bg-blue-400",
  "bg-blue-500",
  "bg-blue-600",

  "bg-teal-400",
  "bg-teal-500",
  "bg-teal-600",

  "bg-green-400",
  "bg-green-500",
  "bg-green-600",

  "bg-emerald-400",
  "bg-emerald-500",
  "bg-emerald-600",

  "bg-orange-400",
  "bg-orange-500",
  "bg-orange-600",

  "bg-red-400",
  "bg-red-500",
  "bg-red-600",

  "bg-pink-400",
  "bg-pink-500",
  "bg-pink-600",

  "bg-purple-400",
  "bg-purple-500",
  "bg-purple-600",

  "bg-cyan-400",
  "bg-cyan-500",
  "bg-cyan-600",
];

export const getColor = (value: string) => {
  if (!value) return "bg-gray-400";

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
};
