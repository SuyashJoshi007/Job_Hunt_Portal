import React, { useMemo, useState, useEffect } from 'react'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axiosInstance from '@/lib/axios'
import { Button } from '../ui/button'

const SHORTLIST_STATUSES = ['Accepted', 'Rejected']
const FILTERS = ['All', 'Pending', 'Accepted', 'Rejected']

const normalizeStatus = (raw) => {
  if (!raw) return 'Pending'
  const t = String(raw).trim().toLowerCase()
  if (t === 'accepted') return 'Accepted'
  if (t === 'rejected') return 'Rejected'
  return 'Pending'
}

const getItemStatus = (item) => {
  const raw =
    item?.status ??
    item?.shortlistingStatus ??
    item?.applicationStatus ??
    item?.appStatus
  return normalizeStatus(raw)
}

const StatusBadge = ({ status }) => {
  const s = normalizeStatus(status)
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  if (s === 'Accepted') return <span className={`${base} bg-green-100 text-green-700`}>Accepted</span>
  if (s === 'Rejected') return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>
  return <span className={`${base} bg-gray-100 text-gray-700`}>Pending</span>
}

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application)
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    setRows(applicants?.applications ?? [])
  }, [applicants])

  const statusHandler = async (status, id) => {
    try {
      const res = await axiosInstance.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        // Optimistic update so the row moves immediately
        setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    }
  }

  const grouped = useMemo(() => {
    const g = { Pending: [], Accepted: [], Rejected: [] }
    for (const item of rows) g[getItemStatus(item)].push(item)
    return g
  }, [rows])

  const counts = {
    All: rows.length,
    Pending: grouped.Pending.length,
    Accepted: grouped.Accepted.length,
    Rejected: grouped.Rejected.length
  }

  const visibleRows = useMemo(() => {
    if (filter === 'All') return null
    return grouped[filter] || []
  }, [grouped, filter])

  const renderActions = (item) => (
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
      <PopoverContent align="end" sideOffset={6} className="w-40 p-2 rounded-lg shadow-md">
        {SHORTLIST_STATUSES.map((status) => (
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
        <button
          type="button"
          onClick={() => statusHandler('Pending', item?._id)}
          className="mt-1.5 flex items-center justify-between w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50"
        >
          <span>Pending</span>
          <span className="ml-2 inline-flex h-5 items-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700">
            •
          </span>
        </button>
      </PopoverContent>
    </Popover>
  )

  const renderRow = (item) => {
    const dateStr = item?.applicant?.createdAt
      ? new Date(item.applicant.createdAt).toLocaleDateString()
      : '—'
    const resumeName =
      item?.applicant?.profile?.resumeOriginalName ||
      item?.applicant?.profile?.resume?.split('/')?.pop() ||
      ''

    return (
      <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
        <TableCell className="max-w-[220px] truncate" title={item?.applicant?.fullname || ''}>
          {item?.applicant?.fullname || '—'}
        </TableCell>
        <TableCell className="max-w-[240px] truncate" title={item?.applicant?.email || ''}>
          {item?.applicant?.email || '—'}
        </TableCell>
        <TableCell className="whitespace-nowrap">{item?.applicant?.phoneNumber || '—'}</TableCell>
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
        <TableCell className="whitespace-nowrap text-gray-600">{dateStr}</TableCell>
        <TableCell className="text-right">{renderActions(item)}</TableCell>
      </TableRow>
    )
  }

  const SectionHeaderRow = ({ label }) => (
    <TableRow>
      <TableCell colSpan={6} className="bg-gray-50 text-gray-700 font-medium">
        {label}
      </TableCell>
    </TableRow>
  )

  // ---------- MOBILE CARD VIEW (sm and below) ----------
  const CardList = ({ list }) => {
    if (!list.length) {
      return (
        <div className="py-8 text-center text-gray-500">No applicants found</div>
      )
    }
    return (
      <ul className="space-y-3 p-3">
        {list.map((item) => {
          const dateStr = item?.applicant?.createdAt
            ? new Date(item.applicant.createdAt).toLocaleDateString()
            : '—'
          const resumeName =
            item?.applicant?.profile?.resumeOriginalName ||
            item?.applicant?.profile?.resume?.split('/')?.pop() ||
            ''
          const status = getItemStatus(item)

          return (
            <li
              key={item._id}
              className="rounded-md border ring-1 ring-gray-100 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{item?.applicant?.fullname || '—'}</div>
                  <div className="text-sm text-gray-600 truncate">{item?.applicant?.email || '—'}</div>
                </div>
                <StatusBadge status={status} />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Phone</div>
                <div className="text-gray-800 text-right">{item?.applicant?.phoneNumber || '—'}</div>

                <div className="text-gray-500">Date</div>
                <div className="text-gray-800 text-right">{dateStr}</div>

                <div className="text-gray-500">Resume</div>
                <div className="text-right">
                  {item?.applicant?.profile?.resume ? (
                    <a
                      className="text-indigo-600 hover:underline break-all"
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
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                {renderActions(item)}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  // Choose which rows to show for mobile list
  const mobileList = (() => {
    if (!rows.length) return []
    if (filter === 'All') return [...grouped.Pending, ...grouped.Accepted, ...grouped.Rejected]
    return visibleRows || []
  })()

  return (
    <div className="overflow-hidden rounded-sm border bg-white ring-1 ring-gray-100 m-3 sm:m-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3 border-b bg-gray-50/70">
        {FILTERS.map((f) => (
          <Button
            key={f}
            type="button"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className={filter === f ? 'h-8 px-3 bg-indigo-600 hover:bg-indigo-600 text-white' : 'h-8 px-3'}
          >
            {f}
            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700">
              {counts[f]}
            </span>
          </Button>
        ))}
      </div>

      {/* MOBILE (≤ sm): card list */}
      <div className="sm:hidden">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No applicants found</div>
        ) : (
          <CardList list={mobileList} />
        )}
      </div>

      {/* DESKTOP (≥ md): table */}
      <div className="hidden sm:block overflow-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh]">
        <Table className="min-w-[720px]">
          <TableCaption className="text-gray-500 mb-4">
            Applicants grouped by status
          </TableCaption>

          <TableHeader className="bg-gray-50/70 sticky top-0 z-10">
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
            {!rows.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                  No applicants found
                </TableCell>
              </TableRow>
            )}

            {rows.length > 0 && filter !== 'All' && (
              <>
                {(visibleRows?.length || 0) > 0 ? (
                  visibleRows.map(renderRow)
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                      No {filter.toLowerCase()} applicants
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}

            {rows.length > 0 && filter === 'All' && (
              <>
                <SectionHeaderRow label={`Pending (${counts.Pending})`} />
                {grouped.Pending.length ? (
                  grouped.Pending.map(renderRow)
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                      No pending applicants
                    </TableCell>
                  </TableRow>
                )}

                <SectionHeaderRow label={`Accepted (${counts.Accepted})`} />
                {grouped.Accepted.length ? (
                  grouped.Accepted.map(renderRow)
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                      No accepted applicants
                    </TableCell>
                  </TableRow>
                )}

                <SectionHeaderRow label={`Rejected (${counts.Rejected})`} />
                {grouped.Rejected.length ? (
                  grouped.Rejected.map(renderRow)
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                      No rejected applicants
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ApplicantsTable
