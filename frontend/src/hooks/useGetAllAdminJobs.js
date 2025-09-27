import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axiosInstance from '@/lib/axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const {token} = useSelector(store=>store.auth);
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axiosInstance.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true, headers: { Authorization: `Bearer ${token}` }});
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminJobs