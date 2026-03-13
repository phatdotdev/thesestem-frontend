const Loader = ({ size = 40 }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Loader;
