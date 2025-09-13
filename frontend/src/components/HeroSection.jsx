// src/components/HeroSection.jsx
import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Search, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = ({ nextId }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = useCallback(() => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }, [dispatch, navigate, query]);

  const scrollDown = useCallback(() => {
    if (nextId) {
      const el = document.getElementById(nextId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight * 0.9, left: 0, behavior: "smooth" });
  }, [nextId]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-10 sm:py-14 lg:py-20">
          {/* Tagline pill */}
          <span className="inline-flex items-center rounded-full bg-[#F83002]/10 text-[#F83002] px-4 py-1.5 text-sm font-medium ring-1 ring-[#F83002]/20">
            No. 1 Job Hunt Website
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
            Search, Apply &<br className="hidden sm:block" />
            Get Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
              Dream Jobs
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-foreground/70">
            Discover roles tailored to you. One profile, multiple opportunities, zero hassle.
          </p>

          {/* Search pill */}
          <div role="search" className="mx-auto mt-8 w-full max-w-2xl">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background pl-4 pr-1 py-1.5 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
              <Search className="h-5 w-5 text-foreground/50" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search jobs"
                placeholder="Find your dream jobs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchJobHandler();
                }}
                className="w-full border-none bg-transparent outline-none placeholder:text-foreground/50 text-sm sm:text-base py-2 text-foreground"
              />
              <Button
                onClick={searchJobHandler}
                className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-4 sm:px-5 h-10 sm:h-11"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="h-5 w-5 sm:ml-2" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">
              Try keywords like <span className="font-medium text-foreground">“Frontend”</span>,{" "}
              <span className="font-medium text-foreground">“Node.js”</span>, or{" "}
              <span className="font-medium text-foreground">“Designer”</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative blur */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center opacity-70">
        <div className="h-48 w-[32rem] rounded-full bg-gradient-to-r from-[#6A38C2]/15 to-[#F83002]/15 blur-3xl" />
      </div>

      {/* Scroll down CTA — hidden on mobile */}
      <div className="absolute bottom-4 inset-x-0 hidden sm:flex justify-center">
        <motion.button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll down for more"
          className="group inline-flex flex-col items-center gap-1 rounded-full px-3 py-2 text-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xs sm:text-sm">Scroll for more</span>
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full border border-border/60 bg-background/60 p-1"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
