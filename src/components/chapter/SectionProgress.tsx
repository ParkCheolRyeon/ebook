interface SectionProgressProps { total: number; current: number; }
export default function SectionProgress({ total, current }: SectionProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${i <= current ? "bg-indigo-500" : "bg-zinc-200"}`} />
      ))}
    </div>
  );
}
