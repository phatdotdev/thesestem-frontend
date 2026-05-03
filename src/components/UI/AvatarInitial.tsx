type AvatarInitialProps = {
  fullName?: string;
  size?: number;
  className?: string;
};

const AvatarInitial = ({
  fullName,
  size = 32,
  className = "",
}: AvatarInitialProps) => {
  const getInitial = (name?: string) => {
    if (!name) return "?";

    const normalizedName = name.trim();
    if (!normalizedName) return "?";

    return normalizedName[0];
  };

  return (
    <div
      className={`rounded-full bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {getInitial(fullName).toUpperCase()}
    </div>
  );
};

export default AvatarInitial;
