import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const useGetWeekAppointments = (selectedDay) => {
    const getWeekAppointments = async () => {
        const { data } = await baseApi.post('/appointments/service-status', {
            selected_day: selectedDay.toISOString().split('T')[0]
        });
        return data;
    };
    return useQuery(['client-appointments'], getWeekAppointments)
}

export const useGetMonthAppointments = (selectedMonth) => {
    const getMonthAppointments = async () => {
        const { data } = await baseApi.post('/appointments', {
            monthNumber: 3
        });
        return data;
    };
    return useQuery(['admin-appointments'], getMonthAppointments)
}

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();

    const updateAppointment = useCallback(async (appointment) => {
        const { data } = await baseApi.post('/appointments/update', appointment);
        return data;
    }, [])
    
    return useMutation(updateAppointment, {
        onMutate: async (newAppointment) => {
            console.log(newAppointment)
            
            queryClient.setQueryData(['admin-appointments'], (oldData) => {
                const newMonthAppointments = oldData.monthAppointments.map((appointment) => {
                    if (appointment.id === newAppointment.id) {
                        return newAppointment;
                    }
                    return appointment;
                });

                return {
                    ...oldData,
                    monthAppointments: newMonthAppointments
                };
            });
          },
    });
}

export const useAddAppointment = () => {
    const queryClient = useQueryClient();

    const addAppointment = useCallback(async (appointment) => {
        const { data } = await baseApi.post('/appointments/add-appointment', appointment);
        return data;
    }, [])
    
    return useMutation(addAppointment, {
        onMutate: async (newAppointment) => {
            queryClient.setQueryData(['admin-appointments'], (oldData) => {
                return {
                    ...oldData,
                    monthAppointments: [...oldData.monthAppointments, newAppointment]
                };
            });
          },
    });
}