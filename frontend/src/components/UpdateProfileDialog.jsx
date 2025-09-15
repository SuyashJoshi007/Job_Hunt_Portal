import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Camera, Upload, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    // skills as comma-separated string for a nicer text input experience
    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills.join(", ")
      : "",
    // resume resume (PDF). Keep separate from avatar.
    resume: null,
    // avatar image resume
    photo: null,
  });

  // preview for avatar
  const avatarPreview = useMemo(() => {
    if (input.photo) return URL.createObjectURL(input.photo);
    return user?.profile?.profilePhoto || "";
  }, [input.photo, user?.profile?.profilePhoto]);

  // selected resume filename
  const resumeName = useMemo(() => {
    if (input.resume?.name) return input.resume.name;
    return user?.profile?.resumeOriginalName || "";
  }, [input.resume, user?.profile?.resumeOriginalName]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const resumeChangeHandler = (e) => {
    const resume = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, resume }));
  };

  const avatarChangeHandler = (e) => {
    const resume = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, photo: resume }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills); // backend can split by comma

    // Keep your existing resume behavior: still send "resume" for resume (PDF)
    if (input.resume) formData.append("resume", input.resume);

    // NEW: Avatar image (most backends expect "profilePhoto"; harmless if ignored)
    if (input.photo) formData.append("photo", input.photo);

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data?.message || "Profile updated");
        setOpen(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[640px] rounded-2xl border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          {/* Avatar uploader */}
          <div className="flex items-center gap-4 pb-2">
            <div className="relative">
              <img
                src={
                  avatarPreview ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=U&backgroundType=gradientLinear"
                }
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
              />
              <label
                htmlFor="photo"
                className="absolute -bottom-2 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-500 cursor-pointer"
                title="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={avatarChangeHandler}
                className="sr-only"
              />
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900">{input.fullname || "Your name"}</div>
              <div className="text-xs">JPG/PNG, square works best. Max ~2–5MB (depending on backend).</div>
            </div>
          </div>

          <div className="grid gap-5 pt-4">
            {/* Full name */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="fullname" className="text-right text-sm font-medium">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3 h-10 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3 h-10 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="phoneNumber" className="text-right text-sm font-medium">
                Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3 h-10 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                placeholder="9876543210"
              />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label htmlFor="bio" className="text-right text-sm font-medium pt-2">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3 h-10 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                placeholder="Short summary about you"
              />
              {/* If you have shadcn Textarea, replace with:
                  <Textarea id="bio" name="bio" className="col-span-3 min-h-[90px] ..." /> */}
            </div>

            {/* Skills */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label htmlFor="skills" className="text-right text-sm font-medium pt-2">
                Skills
              </Label>
              <div className="col-span-3">
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="h-10 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                  placeholder="e.g. React, Node, MongoDB"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated</p>
              </div>
            </div>

            {/* Resume uploader (PDF) */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label htmlFor="resume" className="text-right text-sm font-medium pt-2">
                Resume
              </Label>

              <div className="col-span-3">
                <label
                  htmlFor="resume"
                  className="flex items-center justify-between gap-3 rounded-xl border bg-white ring-1 ring-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  title="Upload resume (PDF)"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {resumeName || "No resume selected"}
                      </div>
                      <div className="text-xs text-gray-500">PDF only</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                    <Upload className="h-4 w-4" />
                    Browse
                  </span>
                </label>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={resumeChangeHandler}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            {loading ? (
              <Button disabled className="w-full h-10">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-10 bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
