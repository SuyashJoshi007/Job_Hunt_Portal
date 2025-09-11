import React, { useMemo } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Users, Briefcase, Building2, Sparkles } from "lucide-react";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const StatCard = ({ icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3 p-4 rounded-sm border bg-white ring-1 ring-gray-100 hover:shadow-sm transition-shadow"
  >
    <div className="h-10 w-10 rounded-full grid place-items-center bg-indigo-50 text-indigo-600">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-extrabold tracking-tight tabular-nums">
        <CountUp
          end={value}
          duration={1.4}
          separator=","
          enableScrollSpy
          scrollSpyOnce
        />
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  </motion.div>
);

const Stats = ({ totals }) => {
  // Generate once; can be overridden by `totals` prop
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
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="rounded-sm p-4 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Users" value={targets.users} />
          <StatCard icon={<Briefcase className="h-5 w-5" />} label="Jobs Posted" value={targets.jobs} delay={0.05} />
          <StatCard icon={<Building2 className="h-5 w-5" />} label="Companies" value={targets.companies} delay={0.1} />
          <StatCard icon={<Sparkles className="h-5 w-5" />} label="Hires Made" value={targets.hires} delay={0.15} />
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;
