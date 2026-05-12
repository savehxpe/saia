interface Props<T extends string> {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (tag: T) => void;
}

export default function TagSelector<T extends string>({
  label, options, selected, onToggle,
}: Props<T>) {
  return (
    <div className="mb-6">
      <div className="text-[10px] tracking-[0.25em] text-[#555] mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={[
                "px-3 py-1 text-[10px] tracking-widest border transition-colors",
                active
                  ? "border-[#E0E0E0] text-[#050505] bg-[#E0E0E0]"
                  : "border-[#2a2a2a] text-[#555] hover:border-[#555] hover:text-[#999]",
              ].join(" ")}
            >
              {tag.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
