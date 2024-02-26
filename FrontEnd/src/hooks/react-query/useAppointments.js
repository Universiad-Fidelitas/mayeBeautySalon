import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useGetWeekAppointments = (selectedDay) => {
    const getWeekAppointments = async () => {
        const { data } = await baseApi.post('/appointments/service-status', {
            selected_day: selectedDay.toISOString().split('T')[0]
        });
        return data;
    };
    return useQuery(['client-appointments'], getWeekAppointments)
}