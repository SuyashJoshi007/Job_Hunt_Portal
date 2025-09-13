// src/components/TestimonialsCardsMotion.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Frontend Engineer",
    company: "SkyStack",
    quote:
      "Found my role in under two weeks. Filtering and alerts were spot on.",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
  },
  {
    name: "Ishita Verma",
    role: "Data Scientist",
    company: "NovaLabs",
    quote:
      "Loved the clean UX and relevant matches. The process felt effortless.",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 5,
  },
  {
    name: "Kunal Mehta",
    role: "Backend Developer",
    company: "FlowByte",
    quote:
      "Great selection of startups and clear job details. Highly recommend!",
    avatar: "https://i.pravatar.cc/80?img=24",
    rating: 4,
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count ? "fill-yellow-400 text-yellow-400" : "text-foreground/20"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function Card({ t, i }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.45, delay: i * 0.07 }}
      className="rounded-lg border bg-background text-foreground ring-1 ring-border/50 p-4 sm:p-5
                 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={t.avatar}
          alt={`${t.name} avatar`}
          loading="lazy"
          className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-1 ring-border"
        />
        <div className="min-w-0">
          <h4 className="font-semibold leading-tight truncate">{t.name}</h4>
          <p className="text-xs sm:text-sm text-foreground/60 truncate">
            {t.role} • {t.company}
          </p>
        </div>
      </div>

      <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
        “{t.quote}”
      </p>

      <div className="mt-4">
        <Stars count={t.rating} />
      </div>
    </motion.article>
  );
}

export default function TestimonialsCardsMotion() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <h3 className="text-base sm:text-lg font-semibold mb-3">What people say</h3>

      {/* Responsive grid: 1 col (phones) → 2 (tablets) → 3 (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {TESTIMONIALS.map((t, i) => (
          <Card key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}
