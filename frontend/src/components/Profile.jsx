import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Download } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);

  const initials =
    (user?.fullname || 'U')
      .trim()
      .split(/\s+/)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const skills = Array.isArray(user?.profile?.skills) ? user.profile.skills : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top Card */}
        <div className="bg-white border rounded-sm shadow-sm ring-1 ring-gray-100 p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Left: Avatar + name/bio */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-2 ring-gray-100">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                    alt={`${user?.fullname || 'User'} avatar`}
                  />
                  <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h1 className="font-bold text-2xl leading-tight truncate">
                    {user?.fullname || 'User'}
                  </h1>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {user?.profile?.bio || 'No bio added yet.'}
                  </p>
                </div>
              </div>

              {/* Edit button */}
              <div className="shrink-0">
                <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
                  <Pen className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Contact strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="inline-flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{user?.email || '—'}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-gray-700">
                <Contact className="h-4 w-4 text-gray-400" />
                <span className="truncate">{user?.phoneNumber || '—'}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="pt-2">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Skills</h2>
              {skills.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {skills.map((item, idx) => (
                    <Badge
                      key={`${item}-${idx}`}
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500">NA</span>
              )}
            </div>

            {/* Resume */}
            <div className="grid w-full max-w-xl items-start gap-1.5">
              <Label className="text-sm font-semibold">Resume</Label>
              {isResume && user?.profile?.resume ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={user.profile.resume}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
                  title={user?.profile?.resumeOriginalName || 'Resume'}
                >
                  <Download className="h-4 w-4" />
                  {user?.profile?.resumeOriginalName || user.profile.resume}
                </a>
              ) : (
                <span className="text-sm text-gray-500">NA</span>
              )}
            </div>
          </div>
        </div>

        {/* Applied Jobs */}
        <div className="mt-8 bg-white border rounded-sm shadow-sm ring-1 ring-gray-100 p-6 sm:p-8">
          <h2 className="font-semibold text-lg mb-4">Applied Jobs</h2>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile
