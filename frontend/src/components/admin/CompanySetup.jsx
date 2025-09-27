import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axiosInstance from "@/lib/axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const { singleCompany } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    // can be a File OR a string URL (existing logo)
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Derive a readable name from either File or URL
  const displayLogoName =
    input?.logo instanceof File
      ? input.logo.name
      : typeof input?.logo === "string" && input.logo
      ? input.logo.split("/").pop()
      : "PNG/JPG up to 2MB";

  const changeEventHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, logo: file })); // Now a real File
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.name?.trim()) return toast.error("Company name is required");
    if (!params?.id) return toast.error("Missing company id in route");

    const formData = new FormData();
    formData.append("name", input.name || "");
    formData.append("description", input.description || "");
    formData.append("website", input.website || "");
    formData.append("location", input.location || "");

    // Only append when a NEW file was selected.
    if (input.logo instanceof File) {
      formData.append("logo", input.logo); // << field name MUST be 'logo'
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData);

      if (res?.data?.success) {
        toast.success(res.data.message || "Company updated");
        navigate("/admin/companies");
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Company update error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hydrate from store; allow logo to be a URL (existing)
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      logo: singleCompany?.logo || null, // keep existing URL, don't force File
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-clip w-full">
      <Navbar />
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-clip">
        <form
          onSubmit={submitHandler}
          className="bg-white border rounded-sm shadow-sm overflow-hidden ring-1 ring-gray-100 max-w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-5 px-6 sm:px-8 py-5 border-b bg-gray-50/70">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              type="button"
              className="flex items-center gap-2 text-gray-600 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl sm:text-2xl tracking-tight">
              Company Setup
            </h1>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
              <div className="space-y-1.5">
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Acme Technologies Pvt. Ltd."
                  className="w-full mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Short company tagline or overview"
                  className="w-full mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="https://example.com"
                  className="w-full mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="City, State / Country"
                  className="w-full mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-2.5 sm:col-span-2 min-w-0">
                <Label>Logo</Label>

                {/* File row: truncates & never overflows */}
                <div className="flex items-center gap-2 max-w-full overflow-hidden">
                  <label
                    htmlFor="logo"
                    className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer shrink-0"
                  >
                    <Upload className="h-4 w-4" />
                    Choose image
                  </label>

                  <span className="flex-1 min-w-0 truncate text-sm text-gray-500">
                    {displayLogoName}
                  </span>

                  <Input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={changeFileHandler}
                    className="sr-only"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  PNG/JPG up to 2MB recommended.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t bg-gray-50/70 px-6 sm:px-8 py-4">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600"
              >
                Update
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
