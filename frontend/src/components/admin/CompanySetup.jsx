import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { Upload } from "lucide-react";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={submitHandler}
          className="bg-white border rounded-sm shadow-sm overflow-hidden ring-1 ring-gray-100"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Acme Technologies Pvt. Ltd."
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
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
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
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
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
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
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                />
              </div>

              <div className="space-y-2.5 sm:col-span-2">
                <Label>Logo</Label>

                <div className="space-y-1.5">
                  <label
                    htmlFor="logo"
                    className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700
               hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Choose image
                  </label>

                  <span className="ml-2 align-middle text-sm text-gray-500 truncate max-w-[220px]">
                    {input?.file?.name ?? "PNG/JPG up to 2MB"}
                  </span>

                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
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
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
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
