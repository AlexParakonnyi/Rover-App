import { BatteryLevel } from "../types";

interface BatteryIndicatorProps {
  batteryLevel: BatteryLevel;
}

const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  batteryLevel,
}) => {
  const val = Math.floor((batteryLevel - 8) / 2);
  const levels = [1, 2, 3, 4].map((level) => {
    const color =
      level <= val
        ? level === 1
          ? "bg-red-400"
          : level === 2
          ? "bg-orange-400"
          : level === 3
          ? "bg-yellow-400"
          : "bg-green-400"
        : "bg-transparent";
    return (
      <div
        key={level}
        className={`w-2.5 h-2.5 border border-black transition-colors ${color}`}
        data-level={level}
      />
    );
  });

  return <div className="flex gap-px">{levels}</div>;
};

export default BatteryIndicator;
