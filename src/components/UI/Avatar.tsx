import { getInitials } from "../../utils/getInitials";
import { getColor } from "../../utils/getColor";

type AvatarProps = {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
};

const Avatar = ({ name, size = "sm", className = "" }: AvatarProps) => {
  return (
    <div
      className={`
        rounded-full flex items-center justify-center
        text-white font-bold shrink-0
        ${sizeMap[size]}
        ${getColor(name as string)}
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
