import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2 } from 'lucide-react'

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState();
  const dispatch = useDispatch();

  const {token} = useSelector(store=>store.auth);

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const length = (companyName?.length ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 border rounded-sm shadow-sm ring-1 ring-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-3 px-6 sm:px-8 py-6 border-b bg-gray-50/70">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-sm bg-indigo-50 ring-1 ring-indigo-100">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your Company Name</h1>
              <p className="text-sm text-gray-500">
                What would you like to name your company? You can change this later.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                className="h-11 mt-1 focus-visible:ring-2 focus-visible:ring-[#6A38C2]/40"
                placeholder="e.g., JobHunt, Microsoft"
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tip: Keep it short and recognizable.</span>
                <span>{length}/60</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t bg-gray-50/70 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/companies")}
              className="hover:shadow-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={registerNewCompany}
              className="bg-[#6A38C2] hover:bg-[#5b30a6] min-w-[120px]"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate
