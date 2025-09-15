// src/components/Stats.jsx
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Briefcase, Building2, Sparkles } from "lucide-react";

/** Utility: random int inclusive */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Locale-aware formatting for SSR-first paint */
const fmt = (n) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

/** Single stat card */
function StatCard({
  icon,
  label,
  value,
  delay = 0,
  iconClassName = "",
}) {
  const prefersReducedMotion = useReducedMotion();
  const staticNumber = fmt(value);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.45, delay }}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-lg border bg-background text-foreground
                 ring-1 ring-border/50 hover:shadow-sm transition-shadow"
      role="group"
      aria-label={`${label}: ${staticNumber}`}
    >
      <div
        className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full grid place-items-center
                   bg-muted text-foreground/90 border border-border"
        aria-hidden="true"
      >
        {React.cloneElement(icon, {
          className: `h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${iconClassName || ""}`,
        })}
      </div>

      <div className="min-w-0">
        <div
          className="font-extrabold tracking-tight tabular-nums leading-none
                     text-xl sm:text-2xl lg:text-3xl"
        >
          {staticNumber}
        </div>
        <div className="mt-1 text-[11px] sm:text-xs lg:text-sm uppercase tracking-wide text-foreground/60">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/** Stats wrapper */
export default function Stats({ totals }) {
  const targets = useMemo(
    () => ({
      users: totals?.users ?? rand(120_000, 240_000),
      jobs: totals?.jobs ?? rand(3_500, 12_000),
      companies: totals?.companies ?? rand(280, 900),
      hires: totals?.hires ?? rand(18_000, 55_000),
    }),
    [totals]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-2">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mt-7">
          Our Stats
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-3 sm:p-4 lg:p-6 bg-background mt-3"
      >
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard icon={<Users />}     label="Users"       value={targets.users}     delay={0.00} />
          <StatCard icon={<Briefcase />} label="Jobs Posted" value={targets.jobs}      delay={0.05} />
          <StatCard icon={<Building2 />} label="Companies"   value={targets.companies} delay={0.10} />
          <StatCard icon={<Sparkles />}  label="Hires Made"  value={targets.hires}     delay={0.15} />
        </div>
      </motion.div>
    </section>
  );
}
