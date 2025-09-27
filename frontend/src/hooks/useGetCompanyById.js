import { setSingleCompany } from '@/redux/companySlice'
import { setAllJobs } from '@/redux/jobSlice'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import axiosInstance from '@/lib/axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const {token} = useSelector(store=>store.auth);
    useEffect(()=>{
        const fetchSingleCompany = async () => {
            try {
                const res = await axiosInstance.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true, headers: { Authorization: `Bearer ${token}` }});
                console.log(res.data.company);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleCompany();
    },[companyId, dispatch])
}

export default useGetCompanyById