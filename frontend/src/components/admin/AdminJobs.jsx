import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, Plus, X } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]); // include dispatch for linting

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Jobs (Admin)</h1>
          <p className="text-sm text-gray-500">
            Manage postings and quickly filter by title, role, or keyword.
          </p>
        </div>

        {/* Actions row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* Search with icon + clear */}
          <div className="relative w-full sm:max-w-sm">
            <label htmlFor="job-search" className="sr-only">Search jobs</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="job-search"
              className="pl-9 pr-9 h-10 rounded-sm focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
              placeholder="Search by title, role, keyword"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              aria-label="Search jobs"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Clear search"
                title="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="inline-flex items-center gap-2 bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </div>

        {/* Table card */}
        <div className="bg-white border rounded-sm shadow-sm overflow-hidden ring-1 ring-gray-100">
          <div className="px-4 sm:px-6 py-3 border-b bg-gray-50/70 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Job Listings</h2>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Tip: Try keywords like “frontend”, “remote”, “intern”.
            </span>
          </div>
          <div className="p-0">
            <AdminJobsTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminJobs
