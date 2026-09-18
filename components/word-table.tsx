type WordTableProps = {
  items: string[];
  compact?: boolean;
};

export function WordTable({ items, compact = false }: WordTableProps) {
  return (
    <div className="border-y border-line">
      <div
        className={`mx-auto grid max-w-[1400px] ${
          compact ? "grid-cols-3 md:grid-cols-6" : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {items.map((title) => (
          <div
            key={title}
            className={
              compact
                ? "flex min-h-[52px] items-center justify-center border-b border-r border-line px-2 text-center text-xs font-semibold tracking-tight sm:min-h-[64px] sm:px-3 sm:text-sm [&:nth-child(3n)]:max-md:border-r-0 md:[&:nth-child(6n)]:border-r-0 max-md:[&:nth-last-child(-n+3)]:border-b-0 md:[&:nth-last-child(-n+6)]:border-b-0"
                : "flex min-h-[88px] items-center justify-center border-b border-r border-line px-4 text-center text-sm font-semibold tracking-tight sm:min-h-[108px] sm:text-lg even:border-r-0 md:even:border-r md:[&:nth-child(4n)]:border-r-0 max-md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+4)]:border-b-0"
            }
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
}
