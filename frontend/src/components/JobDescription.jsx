import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, CalendarDays, BriefcaseBusiness, Coins } from 'lucide-react';

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const initiallyApplied = useMemo(
    () => Boolean(singleJob?.applications?.some((a) => a?.applicant === user?._id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [isApplied, setIsApplied] = useState(initiallyApplied);
  const [applying, setApplying] = useState(false);

  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/jobs'); // fallback route; change if you prefer "/"
    }
  }, [navigate]);

  const applyJobHandler = useCallback(async () => {
    if (isApplied || applying) return;
    try {
      setApplying(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob?.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data?.message || 'Applied successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  }, [isApplied, applying, jobId, singleJob, user?._id, dispatch]);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));
          setIsApplied(Boolean(job?.applications?.some((a) => a?.applicant === user?._id)));
        }
      } catch {}
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const displayDate = singleJob?.createdAt
    ? new Date(singleJob.createdAt).toLocaleDateString()
    : '—';

  const positionsLabel = singleJob?.position ?? singleJob?.postion ?? '—';
  const applicantsCount = singleJob?.applications?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back button row */}
        <div className="flex items-center">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="inline-flex items-center gap-2"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Summary Card */}
        <div className="bg-white/95 border rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="min-w-0">
              <h1 className="font-bold text-2xl sm:text-3xl tracking-tight truncate">
                {singleJob?.title || 'Job'}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  {positionsLabel} Positions
                </Badge>
                <Badge variant="secondary" className="bg-[#F83002]/10 text-[#F83002] ring-1 ring-[#F83002]/20">
                  {singleJob?.jobType || '—'}
                </Badge>
                <Badge variant="secondary" className="bg-violet-50 text-[#7209b7] ring-1 ring-violet-100">
                  {singleJob?.salary ? `${singleJob.salary} LPA` : '—'}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{singleJob?.location || '—'}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>Posted: {displayDate}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-gray-400" />
                  <span>Applicants: {applicantsCount}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Coins className="h-4 w-4 text-gray-400" />
                  <span>Salary: {singleJob?.salary ? `${singleJob.salary} LPA` : '—'}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                onClick={isApplied ? undefined : applyJobHandler}
                disabled={isApplied || applying}
                className={`rounded-lg min-w-[160px] h-11 px-5 ${
                  isApplied || applying
                    ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed'
                    : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                }`}
              >
                {isApplied ? 'Already Applied' : applying ? 'Applying…' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white/95 border rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold border-b border-gray-200 pb-4">Job Description</h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-[15px]">
            <p className="font-semibold">
              Role:
              <span className="pl-3 font-normal text-gray-800">{singleJob?.title || '—'}</span>
            </p>

            <p className="font-semibold">
              Location:
              <span className="pl-3 font-normal text-gray-800">{singleJob?.location || '—'}</span>
            </p>

            <p className="font-semibold md:col-span-2 leading-relaxed">
              Description:
              <span className="pl-3 font-normal text-gray-800">{singleJob?.description || '—'}</span>
            </p>

            <p className="font-semibold">
              Experience:
              <span className="pl-3 font-normal text-gray-800">
                {singleJob?.experience ? `${singleJob.experience} yrs` : '—'}
              </span>
            </p>

            <p className="font-semibold">
              Salary:
              <span className="pl-3 font-normal text-gray-800">
                {singleJob?.salary ? `${singleJob.salary} LPA` : '—'}
              </span>
            </p>

            <p className="font-semibold">
              Total Applicants:
              <span className="pl-3 font-normal text-gray-800">{applicantsCount}</span>
            </p>

            <p className="font-semibold">
              Posted Date:
              <span className="pl-3 font-normal text-gray-800">{displayDate}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
