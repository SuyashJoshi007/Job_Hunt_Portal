import React from "react";
import { motion } from "framer-motion";
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

const Stars = ({ count = 5 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const Card = ({ t, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: i * 0.07 }}
    className="rounded-sm border bg-white ring-1 ring-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-3">
      <img
        src={t.avatar}
        alt={`${t.name} avatar`}
        className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
      />
      <div className="min-w-0">
        <div className="font-semibold leading-tight">{t.name}</div>
        <div className="text-xs text-gray-500 truncate">{t.role} • {t.company}</div>
      </div>
    </div>
    <p className="text-gray-700 text-sm leading-relaxed">“{t.quote}”</p>
    <div className="mt-4">
      <Stars count={t.rating} />
    </div>
  </motion.div>
);

const TestimonialsCardsMotion = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <h3 className="text-lg font-semibold mb-3">What people say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <Card key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCardsMotion;
