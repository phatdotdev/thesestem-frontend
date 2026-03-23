type AvatarInitialProps = {
  fullName?: string;
  size?: number;
};

const AvatarInitial = ({ fullName, size = 32 }: AvatarInitialProps) => {
  const getInitial = (name?: string) => {
    if (!name) return "?";

    const parts = name.trim().split(" ");

    if (parts.length === 1) return parts[0][0];

    return parts[parts.length - 1][0];
  };

  return (
    <div
      className="rounded-full bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0"
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
