import React, { useState, useMemo } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axiosInstance from "@/lib/axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const { token } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (c) => c?.name?.toLowerCase() === value
    );
    if (selectedCompany?._id) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const selectedCompanyValue = useMemo(() => {
    const c = companies.find((x) => x._id === input.companyId);
    return c?.name?.toLowerCase();
  }, [companies, input.companyId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!input.title?.trim()) return toast.error("Title is required");
      if (!input.description?.trim())
        return toast.error("Description is required");
      if (!input.companyId) return toast.error("Please select a company");

      setLoading(true);
      const res = await axiosInstance.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 overflow-x-clip">
      <Navbar />

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={submitHandler}
          className="bg-white border rounded-md shadow-sm ring-1 ring-gray-100"
        >
          {/* Header with Back button */}
          <div className="px-5 sm:px-8 py-5 border-b bg-gray-50/70 flex items-center justify-between gap-5">
            <Button
              onClick={() => navigate("/admin/jobs")}
              variant="outline"
              type="button"
              className="flex items-center gap-2 text-gray-600 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Post a New Job
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the job details below. Fields marked with * are required.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-8 py-6">
            {/* Company select */}
            <div className="mb-5">
              <Label className="mb-1.5 inline-block">
                Company<span className="text-red-500">*</span>
              </Label>
              {companies.length > 0 ? (
                <Select
                  onValueChange={selectChangeHandler}
                  defaultValue={selectedCompanyValue}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company?._id}
                          value={company?.name?.toLowerCase()}
                        >
                          {company?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-red-600 font-semibold">
                  * Please register a company first, before posting jobs.
                </p>
              )}
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0">
              <div className="space-y-1.5 min-w-0">
                <Label>
                  Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="e.g., Frontend Developer"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>
                  Description<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Short role summary (one line)"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>Requirements</Label>
                <Input
                  type="text"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="e.g., React, Node.js, 1+ yrs"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>Salary</Label>
                <Input
                  type="text"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g., ₹6–10 LPA"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="City, State / Country or Remote"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>Job Type</Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="e.g., Full-time, Intern, Contract"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>Experience Level</Label>
                <Input
                  type="text"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="e.g., 0–1 yrs, 2–4 yrs"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label>No. of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  min={0}
                  onChange={changeEventHandler}
                  placeholder="e.g., 3"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 py-4 border-t bg-gray-50/70">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#6A38C2] hover:bg-[#5b2fb0]"
                disabled={companies.length === 0}
              >
                Post New Job
              </Button>
            )}
            {companies.length === 0 && (
              <p className="text-xs text-red-600 font-semibold text-center mt-2">
                * Please register a company first, before posting jobs.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
