import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "sm";

const styles: Record<Variant, string> = {
  primary:
    "bg-cream text-plum hover:bg-white",
  ghost:
    "bg-transparent text-cream border border-cream/20 hover:border-cream/50 hover:bg-cream/5",
  outline:
    "bg-transparent text-cream border border-cream/70 hover:bg-cream hover:text-plum",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const cls = `group inline-flex items-center rounded-full font-semibold tracking-tight active:scale-[0.98] ${
    size === "sm" ? "gap-1.5 px-3 py-1.5 text-xs" : "gap-3 px-6 py-3 text-sm"
  } ${styles[variant]} ${className}`;

  const inner = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      <span
        className={`flex items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px ${
          size === "sm" ? "h-5 w-5" : "h-8 w-8"
        }`}
      >
        <ArrowUpRight size={size === "sm" ? 11 : 16} weight="bold" />
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
