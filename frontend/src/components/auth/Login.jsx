import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '', role: '' });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keep a ref to the current request so we can cancel on unmount
  const reqControllerRef = useRef(null);

  useEffect(() => {
    // Safety reset in case loading was persisted or a refresh happened mid-request
    dispatch(setLoading(false));

    // If already logged in, redirect
    if (user) navigate('/');

    // Cleanup: abort any in-flight request to avoid setState after unmount
    return () => {
      try {
        reqControllerRef.current?.abort();
      } catch {}
      dispatch(setLoading(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Create a fresh AbortController for this submission
    const controller = new AbortController();
    reqControllerRef.current = controller;

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        signal: controller.signal, // <-- tie request to controller
      });

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data?.message || 'Logged in');
        navigate('/');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      // If aborted, don't show an error toast
      if (error?.name === 'CanceledError' || axios.isCancel?.(error)) {
        // silently ignore
      } else {
        toast.error(error?.response?.data?.message || 'Login failed');
      }
    } finally {
      dispatch(setLoading(false));
      reqControllerRef.current = null;
    }
  };

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
              <h1 className="font-bold text-2xl">Login</h1>
              <p className="text-sm text-gray-500">Welcome back! Sign in to continue.</p>
            </div>

            <div className="space-y-4">
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
                    placeholder="Enter a valid email address"
                    autoComplete="email"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                    disabled={loading}
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="pl-9 h-11 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              )}

              <p className="text-sm text-center">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
