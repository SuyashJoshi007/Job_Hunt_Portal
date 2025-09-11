import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
  const { allJobs = [] } = useSelector((store) => store.job);
  const jobsToShow = allJobs.slice(0, 6);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
              Latest & Top
            </span>{" "}
            Job Openings
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Fresh roles curated for you — updated frequently.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {jobsToShow.length > 0 ? (
            jobsToShow.map((job) => <LatestJobCards key={job._id} job={job} />)
          ) : (
            <div className="col-span-full">
              <div className="mx-auto max-w-xl text-center rounded-sm border bg-white ring-1 ring-gray-100 p-8 shadow-sm">
                <h3 className="font-semibold text-lg">No Jobs Available</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Check back soon or try adjusting your filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
