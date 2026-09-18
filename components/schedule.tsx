import { CalendarBlank, Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import type { ClassGroup } from "@/lib/types";

export function Schedule({ groups }: { groups: ClassGroup[] }) {
  const visible = groups.filter((group) => group.slots.length > 0);

  if (!visible.length) {
    return (
      <p className="text-sm text-cream-dim">Timings will be posted here.</p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((group) => (
        <article
          key={group.id}
          className="flex h-full flex-col rounded-2xl border border-cream/20 bg-plum/80 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">{group.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-cream-dim">
                <CalendarBlank size={13} weight="regular" className="shrink-0 text-coral" />
                {group.days}
              </p>
            </div>
            {group.note ? (
              <span className="rounded-full border border-cream/15 px-2 py-0.5 text-[10px] text-cream-dim">
                {group.note}
              </span>
            ) : null}
          </div>

          <ul className="mt-3 space-y-1">
            {group.slots.map((slot, i) => {
              const morning = slot.kind === "morning";
              return (
                <li key={slot.id}>
                  {i > 0 && group.eitherOr ? (
                    <p className="py-0.5 text-center text-xs text-cream-dim">
                      <em className="font-serif font-normal italic">or</em>
                    </p>
                  ) : null}
                  <div className="flex overflow-hidden rounded-xl border border-cream/15 bg-cream/[0.08]">
                    <span
                      className={`w-1 shrink-0 ${morning ? "bg-coral" : "bg-cream/75"}`}
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-1.5">
                      <span className="text-sm font-semibold tracking-tight">{slot.time}</span>
                      <span className="flex items-center gap-1 text-[11px] text-cream-dim">
                        {morning ? <Sun size={13} weight="regular" /> : <Moon size={13} weight="regular" />}
                        {morning ? "Morning" : "Evening"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}
