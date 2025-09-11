import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
  useGetAllJobs()
  const { allJobs = [] } = useSelector((store) => store.job)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''))
    }
    // keeping dispatch in deps avoids lint warnings; no behavior change
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <section className="max-w-7xl mx-auto pl-4 pr-3 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Search Results
            <span className="ml-2 align-middle text-base sm:text-lg font-semibold text-gray-600">
              ({allJobs.length})
            </span>
          </h1>
          {/* space for future filters/sorting if needed */}
        </div>

        {/* Results grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allJobs.length > 0 ? (
            allJobs.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <div className="col-span-full">
              <div className="mx-auto max-w-xl text-center rounded-2xl border bg-white ring-1 ring-gray-100 p-8 shadow-sm">
                <h3 className="font-semibold text-lg">No results found</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try a different keyword or remove some filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Browse
