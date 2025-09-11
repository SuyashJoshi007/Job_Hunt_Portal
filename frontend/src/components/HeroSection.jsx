import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-10 sm:py-14 lg:py-20">
          {/* Tagline pill */}
          <span className="inline-flex items-center rounded-full bg-[#F83002]/10 text-[#F83002] px-4 py-1.5 text-sm font-medium ring-1 ring-[#F83002]/20">
            No. 1 Job Hunt Website
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
            Search, Apply &<br className="hidden sm:block" />
            Get Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
              Dream Jobs
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-600">
            Discover roles tailored to you. One profile, multiple opportunities, zero hassle.
          </p>

          {/* Search pill */}
          <div
            role="search"
            className="mx-auto mt-8 w-full max-w-2xl"
          >
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-4 pr-1 py-1.5 shadow-lg/50 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[#6A38C2]/40">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search jobs"
                placeholder="Find your dream jobs"
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-none bg-transparent outline-none placeholder:text-gray-400 text-sm sm:text-base py-2"
              />
              <Button
                onClick={searchJobHandler}
                className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-4 sm:px-5 h-10 sm:h-11"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="h-5 w-5 sm:ml-2" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Try keywords like <span className="font-medium text-gray-700">“Frontend”</span>, <span className="font-medium text-gray-700">“Node.js”</span>, or <span className="font-medium text-gray-700">“Designer”</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative blur (purely visual) */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center opacity-70">
        <div className="h-48 w-[32rem] rounded-full bg-gradient-to-r from-[#6A38C2]/15 to-[#F83002]/15 blur-3xl" />
      </div>
    </section>
  );
};

export default HeroSection;
