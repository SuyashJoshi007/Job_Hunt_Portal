// src/components/Jobs.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery?.trim()) {
      const q = searchedQuery.toLowerCase();
      const filtered = allJobs.filter((job) =>
        [job.title, job.description, job.location]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      );
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Page grid: sidebar + content (stacks on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <FilterCard />
          </aside>

          {/* Content area */}
          <section className="lg:col-span-9">
            {filterJobs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-foreground/70">
                No jobs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
