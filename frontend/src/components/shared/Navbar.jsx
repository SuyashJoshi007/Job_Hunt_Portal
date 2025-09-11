import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LogOut, User2 } from "lucide-react";
import { toast } from "sonner";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data?.message || "Logged out successfully.");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to log out.");
    }
  };

  const initials =
    (user?.fullname ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Brand (avoid nested h1 to prevent hydration issues) */}
        <Link to="/" className="group inline-flex items-center gap-2" aria-label="Home">
          <span className="text-xl sm:text-2xl font-bold tracking-tight transition-transform group-hover:scale-[1.02]">
            Job<span className="text-[#F83002]">Portal</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Nav links — always visible */}
          <ul className="flex font-medium items-center gap-5 text-gray-700">
            {user?.role === "recruiter" ? (
              <>
                <li className="hover:text-gray-900 transition-colors">
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className="hover:text-gray-900 transition-colors">
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li className="hover:text-gray-900 transition-colors">
                  <Link to="/">Home</Link>
                </li>
                <li className="hover:text-gray-900 transition-colors">
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li className="hover:text-gray-900 transition-colors">
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth actions */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] hover:scale-105 transition-transform">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Open user menu"
                  className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-red-400 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={`Profile picture of ${user?.fullname || "user"}`}
                    />
                    <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-0 overflow-hidden rounded-sm shadow-xl">
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-1 ring-gray-200">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={`Profile picture of ${user?.fullname || "user"}`}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base truncate">
                      {user?.fullname || "User"}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {user?.profile?.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-2">
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 justify-start text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-sm hover:bg-gray-100 mb-2"
                    >
                      <User2 size={18} />
                      <span className="font-medium">View Profile</span>
                    </Link>
                  )}
                  <Button
                    onClick={logoutHandler}
                    className="justify-start gap-2 px-3 bg-red-500 hover:bg-red-600 hover:scale-102 transition-transform"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
