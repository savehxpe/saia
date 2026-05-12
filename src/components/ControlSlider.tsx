interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export default function ControlSlider({
  label, value, min, max, step = 1, unit = "", onChange,
}: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] tracking-[0.2em] text-[#777]">{label}</span>
        <span className="text-[11px] font-bold text-[#E0E0E0]">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-px bg-[#222] w-full">
        <div
          className="absolute top-0 left-0 h-px bg-[#E0E0E0]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full -top-[7px] opacity-0 cursor-pointer h-4"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#E0E0E0] pointer-events-none"
          style={{ left: `calc(${pct}% - 4px)` }}
        />
      </div>
    </div>
  );
}
