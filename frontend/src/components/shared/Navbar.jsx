import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";
import { LogOut, User2, Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get(`${USER_API_END_POINT}/logout`);
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

  // Shared nav links (desktop + mobile) — no separate "Home" here since brand is Home
  const NavLinks = () =>
    user?.role === "recruiter" ? (
      <>
        <li>
          <Link className="hover:text-foreground transition-colors" to="/admin/companies">
            Companies
          </Link>
        </li>
        <li>
          <Link className="hover:text-foreground transition-colors" to="/admin/jobs">
            Jobs
          </Link>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link className="hover:text-foreground transition-colors" to="/jobs">
            Jobs
          </Link>
        </li>
        <li>
          <Link className="hover:text-foreground transition-colors" to="/browse">
            Browse
          </Link>
        </li>
      </>
    );

  return (
    <header className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand as Home */}
        <Link
          to="/"
          aria-label="Go to Home"
          className="group inline-flex items-center gap-2 select-none"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight transition-transform group-hover:scale-[1.02]">
            Job<span className="text-[#F83002]">Portal</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex items-center gap-6 text-sm font-medium text-foreground/80">
            <NavLinks />
          </ul>

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
                  className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-ring transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <Avatar className="h-12 w-12 ring-1 ring-border">
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
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {user?.profile?.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-2">
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 justify-start text-foreground/80 transition-colors px-3 py-2 rounded-sm hover:bg-muted mb-2"
                    >
                      <User2 size={18} />
                      <span className="font-medium">View Profile</span>
                    </Link>
                  )}
                  <Button
                    onClick={logoutHandler}
                    className="w-full justify-start gap-2 px-3 bg-red-500 hover:bg-red-600 hover:scale-[1.02] transition-transform"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t transition-[max-height,opacity] duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          <ul
            className="grid gap-2 text-sm font-medium text-foreground/80"
            onClick={() => setMobileOpen(false)}
          >
            <NavLinks />
          </ul>

          {!user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {user?.role === "student" && (
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <User2 size={18} />
                    Profile
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  logoutHandler();
                }}
                className="justify-start gap-2 px-3 bg-red-500 hover:bg-red-600 hover:scale-102 transition-transform"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
