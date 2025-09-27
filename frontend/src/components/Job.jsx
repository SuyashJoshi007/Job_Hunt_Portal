// src/components/Job.jsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '@/lib/axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const daysAgo = (ts) => {
    const d = ts ? new Date(ts) : null;
    if (!d || isNaN(d.getTime())) return null;
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  };
  const days = daysAgo(job?.createdAt);
  const postedLabel = days === null ? '—' : days === 0 ? 'Today' : `${days} days ago`;

  const initials =
    (job?.company?.name || '?')
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  const derivedAppliedFromProp = useMemo(
    () => Boolean(job?.applications?.some((a) => a?.applicant === user?._id)),
    [job?.applications, user?._id]
  );

  const [isApplied, setIsApplied] = useState(derivedAppliedFromProp);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (derivedAppliedFromProp) setIsApplied(true);
  }, [derivedAppliedFromProp]);

  const applyJobHandler = useCallback(async () => {
    if (isApplied || applying) return;
    try {
      setApplying(true);
      const res = await axiosInstance.get(`${APPLICATION_API_END_POINT}/apply/${job?._id}`, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.data?.success) {
        setIsApplied(true);
        toast.success(res.data?.message || 'Applied successfully');
      } else {
        toast.error('Failed to apply');
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please log in to apply.');
        navigate('/login');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to apply');
      }
    } finally {
      setApplying(false);
    }
  }, [isApplied, applying, job?._id, navigate]);

  return (
    <div
      className="group p-5 rounded-sm border bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow
                 h-full flex flex-col"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-500">{postedLabel}</p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          aria-label="Save job"
          title="Save job"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company row */}
      <div className="flex items-center gap-3 sm:gap-4 my-3">
        <div className="shrink-0">
          <Button className="p-0 rounded-sm" variant="outline" size="icon" aria-label="Company logo">
            <Avatar className="h-10 w-10 ring-1 ring-gray-200">
              <AvatarImage src={job?.company?.logo} alt={`${job?.company?.name || 'Company'} logo`} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-base sm:text-lg truncate">
            {job?.company?.name || '—'}
          </h2>
          <p className="text-sm text-gray-500 truncate">India</p>
        </div>
      </div>

      {/* Main content grows to push actions to bottom */}
      <div className="flex-1">
        {/* Title + description */}
        <div>
          <h3 className="font-bold text-lg sm:text-xl my-2 leading-tight">
            {job?.title || '—'}
          </h3>
          <p className="text-sm text-gray-600">
            {job?.description || '—'}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            {job?.position ?? job?.postion ?? '—'} Positions
          </Badge>
          <Badge variant="secondary" className="bg-[#F83002]/10 text-[#F83002] ring-1 ring-[#F83002]/20">
            {job?.jobType || '—'}
          </Badge>
          <Badge variant="secondary" className="bg-violet-50 text-[#7209b7] ring-1 ring-violet-100">
            {job?.salary ? `${job.salary} LPA` : '—'}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-5">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="hover:shadow-sm"
        >
          Details
        </Button>

        <Button
          onClick={isApplied ? undefined : applyJobHandler}
          disabled={isApplied || applying}
          aria-disabled={isApplied || applying}
          className={`min-w-[120px]
            ${isApplied
              ? 'bg-emerald-600 hover:bg-emerald-600 cursor-default'
              : 'bg-[#7209b7] hover:bg-[#5f32ad]'}
            ${applying ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isApplied ? (
            <span className="inline-flex items-center gap-2" aria-live="polite">
              <Check className="h-4 w-4" />
              Applied
            </span>
          ) : applying ? (
            'Applying…'
          ) : (
            'Apply Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Job;
