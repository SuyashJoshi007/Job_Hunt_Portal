import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const shortlistingStatus = ['Accepted', 'Rejected']

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application)

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      )
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border bg-white ring-1 ring-gray-100 m-6">
      <div className="overflow-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh]">
        <Table className="min-w-[720px]">
          <TableCaption className="text-gray-500 mb-4">
            A list of your recently applied users
          </TableCaption>

          <TableHeader className="bg-gray-50/70 sticky top-0 z-10 p-1">
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="text-right w-[96px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applicants?.applications?.length ? (
              applicants.applications.map((item) => {
                const dateStr = item?.applicant?.createdAt
                  ? new Date(item.applicant.createdAt).toLocaleDateString()
                  : '—'
                const resumeName =
                  item?.applicant?.profile?.resumeOriginalName ||
                  item?.applicant?.profile?.resume?.split('/')?.pop() ||
                  ''

                return (
                  <TableRow
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell
                      className="max-w-[220px] truncate"
                      title={item?.applicant?.fullname || ''}
                    >
                      {item?.applicant?.fullname || '—'}
                    </TableCell>

                    <TableCell
                      className="max-w-[240px] truncate"
                      title={item?.applicant?.email || ''}
                    >
                      {item?.applicant?.email || '—'}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {item?.applicant?.phoneNumber || '—'}
                    </TableCell>

                    <TableCell className="max-w-[260px] truncate">
                      {item?.applicant?.profile?.resume ? (
                        <a
                          className="text-indigo-600 hover:underline"
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={resumeName}
                        >
                          {resumeName}
                        </a>
                      ) : (
                        <span className="text-gray-500">NA</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-gray-600">
                      {dateStr}
                    </TableCell>

                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label="Open actions"
                            title="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-40 p-2 rounded-lg shadow-md"
                        >
                          {shortlistingStatus.map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => statusHandler(status, item?._id)}
                              className="flex items-center justify-between w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50"
                            >
                              <span>{status}</span>
                              <span
                                className={
                                  status === 'Accepted'
                                    ? 'ml-2 inline-flex h-5 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-700'
                                    : 'ml-2 inline-flex h-5 items-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-700'
                                }
                              >
                                {status === 'Accepted' ? '✓' : '×'}
                              </span>
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                  No applicants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ApplicantsTable
