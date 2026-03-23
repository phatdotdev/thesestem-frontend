const ScrollBox = ({
  children,
  height = "260px",
}: {
  children: React.ReactNode;
  height?: string;
}) => (
  <div
    className="overflow-auto space-y-2 pr-0.5"
    style={{
      height,
      scrollbarWidth: "thin",
      scrollbarColor: "#e5e7eb transparent",
    }}
  >
    {children}
  </div>
);
export default ScrollBox;
