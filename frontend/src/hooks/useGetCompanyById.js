import { setSingleCompany } from '@/redux/companySlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!companyId) return; // prevent /undefined

    const fetchSingleCompany = async () => {
      try {
        // If your route is router.get("/get/:id", ...), change URL accordingly:
        // const url = `${COMPANY_API_END_POINT}/get/${encodeURIComponent(companyId)}`;
        const url = `${COMPANY_API_END_POINT}/${encodeURIComponent(companyId)}`;

        const res = await axios.get(url, { withCredentials: true });

        if (res?.data?.success && res?.data?.company) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          console.warn('Company fetch returned unexpected payload:', res?.data);
        }
      } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;
        console.error('fetchSingleCompany error:', status, data || error?.message);
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
