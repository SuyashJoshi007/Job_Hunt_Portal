// src/components/CategoryGrid.jsx
import React, { useCallback } from "react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const DEFAULT_CATEGORIES = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Data Science",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "UX/UI Designer",
  "Graphic Designer",
];

export default function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
  onSelect,                 // optional callback(query)
  title = "Browse by category",
  className = "",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = useCallback(
    (query) => {
      if (typeof onSelect === "function") onSelect(query);
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    },
    [dispatch, navigate, onSelect]
  );

  const list = Array.isArray(categories) ? categories : [];

  return (
    <section aria-label={title} className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {/* Optional "View all" link/button can go here */}
      </div>

      {list.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {list.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant="outline"
              onClick={() => searchJobHandler(cat)}
              className="h-11 w-full rounded-lg border-border bg-background text-foreground
                         hover:bg-muted hover:text-foreground
                         focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                         transition-colors"
              aria-label={`Search ${cat} jobs`}
              title={cat}
            >
              <span className="truncate">{cat}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="h-28 rounded-lg border border-dashed border-border grid place-items-center text-foreground/60">
          No categories available
        </div>
      )}
    </section>
  );
}
