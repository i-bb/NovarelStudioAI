type CircularProgressProps = {
  value: number;
  total: number;
  label?: string;
  color?: string;
};

export const CircularProgressBar = ({
  value,
  total,
  label = "GB",
}: CircularProgressProps) => {
  const percentage = total > 0 ? value / total : 0;

  const radius = 52;
  const strokeWidth = 8;
  const fullCircumference = 2 * Math.PI * radius;

  const arcLength = fullCircumference * 0.75;
  const usedOffset = arcLength * (1 - percentage);

  return (
    <div>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="rotate-[135deg]">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${fullCircumference}`}
            strokeLinecap="round"
          />

          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#6d28d9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${fullCircumference}`}
            strokeDashoffset={usedOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">
            {value}/{total}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
};
