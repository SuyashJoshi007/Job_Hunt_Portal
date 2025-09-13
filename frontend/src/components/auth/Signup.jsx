import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, UserPlus } from 'lucide-react'

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: ""
  });

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    if (user) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileName = typeof input.file === "object" && input.file ? input.file.name : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-10">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-md bg-white/95 border rounded-sm shadow-sm ring-1 ring-gray-100 p-6 sm:p-8"
          >
            <div className="mb-6 text-center">
              <h1 className="font-bold text-2xl">Sign Up</h1>
              <p className="text-sm text-gray-500">Create your account to get started.</p>
            </div>

            <div className="space-y-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullname"
                    type="text"
                    value={input.fullname}
                    name="fullname"
                    onChange={changeEventHandler}
                    placeholder="Enter your full name"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="Enter your email"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="text"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="Enter your phone number"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="••••••••"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <Label className="mb-2 block">Role</Label>
                <RadioGroup className="grid grid-cols-2 gap-2 my-1">
                  <div>
                    <Input
                      type="radio"
                      id="role-student"
                      name="role"
                      value="student"
                      checked={input.role === 'student'}
                      onChange={changeEventHandler}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="role-student"
                      className="flex items-center justify-center rounded-sm border px-4 py-2 cursor-pointer text-sm font-medium
                                 hover:bg-gray-50 peer-checked:border-[#6A38C2] peer-checked:text-[#6A38C2]"
                    >
                      Student
                    </Label>
                  </div>
                  <div>
                    <Input
                      type="radio"
                      id="role-recruiter"
                      name="role"
                      value="recruiter"
                      checked={input.role === 'recruiter'}
                      onChange={changeEventHandler}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="role-recruiter"
                      className="flex items-center justify-center rounded-sm border px-4 py-2 cursor-pointer text-sm font-medium
                                 hover:bg-gray-50 peer-checked:border-[#6A38C2] peer-checked:text-[#6A38C2]"
                    >
                      Recruiter
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Profile (file) */}
              <div className="space-y-1.5">
                <Label htmlFor="profile">Profile</Label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="profile"
                    className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700
                               hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Choose image
                  </label>
                  <span className="text-sm text-gray-500 truncate max-w-[220px]">
                    {fileName || "PNG/JPG up to 2MB"}
                  </span>
                </div>
                <Input
                  id="profile"
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="sr-only"
                />
              </div>

              {/* Submit */}
              {loading ? (
                <Button disabled className="w-full h-11">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#6A38C2] hover:bg-[#5b30a6] inline-flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Signup
                </Button>
              )}

              <p className="text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
