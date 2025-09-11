import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job)
  const [filterJobs, setFilterJobs] = useState(allAdminJobs)
  const navigate = useNavigate()

  useEffect(() => {
    const q = (searchJobByText || '').toLowerCase().trim()
    const filtered = (allAdminJobs || []).filter((job) => {
      if (!q) return true
      const title = (job?.title || '').toLowerCase()
      const company = (job?.company?.name || '').toLowerCase()
      return title.includes(q) || company.includes(q)
    })
    setFilterJobs(filtered)
  }, [allAdminJobs, searchJobByText])

  return (
    <div>
      <Table>
        <TableCaption className="text-gray-500 mb-4">A list of your recent posted jobs</TableCaption>

        <TableHeader className="bg-gray-50/70 sticky top-0 z-10">
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="text-right w-[96px]">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs?.length ? (
            filterJobs.map((job) => {
              const key = job?._id || `${job?.title}-${job?.createdAt}`
              const displayDate = job?.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : '—'
              const initials =
                (job?.company?.name || '?')
                  .trim()
                  .split(/\s+/)
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || '?'

              return (
                <TableRow key={key} className="hover:bg-gray-50 transition-colors">
                  {/* Company */}
                  <TableCell className="max-w-[280px]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                        <AvatarImage
                          src={job?.company?.logo}
                          alt={job?.company?.name ? `${job.company.name} logo` : 'Company logo'}
                        />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate" title={job?.company?.name || ''}>
                        {job?.company?.name || '—'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="max-w-[320px] truncate" title={job?.title || ''}>
                    {job?.title || '—'}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="whitespace-nowrap text-gray-600">
                    {displayDate}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-sm p-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          aria-label="Open actions"
                          title="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent align="end" className="w-40 p-2 rounded-sm shadow-md">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/companies/${job._id}`)}
                          className="flex items-center gap-2 w-full text-left rounded-sm px-2 py-1.5 hover:bg-gray-50"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="mt-1.5 flex items-center gap-2 w-full text-left rounded-sm px-2 py-1.5 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Applicants</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                No jobs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable
