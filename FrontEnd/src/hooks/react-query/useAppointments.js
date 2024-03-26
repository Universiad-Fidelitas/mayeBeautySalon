import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export const useGetWeekAppointments = (selectedDay) => {
  const getWeekAppointments = async () => {
    const { data } = await baseApi.post('/appointments/service-status', {
      selected_day: selectedDay.toISOString().split('T')[0],
    });
    return data;
  };
  return useQuery(['client-appointments'], getWeekAppointments);
};

export const useGetMonthAppointments = () => {
  const getMonthAppointments = async () => {
    const { data } = await baseApi.post('/appointments', {
      monthNumber: 3,
    });
    return data;
  };
  return useQuery(['admin-appointments'], getMonthAppointments);
};

export const useUpdateAppointment = () => {
  const { formatMessage: f } = useIntl();
  const queryClient = useQueryClient();

  const updateAppointment = useCallback(
    async (appointment) => {
      const { data } = await baseApi.post('/appointments/update', appointment);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    },
    [f]
  );

  return useMutation(updateAppointment, {
    onMutate: async (newAppointment) => {
      console.log(newAppointment);

      queryClient.setQueryData(['admin-appointments'], (oldData) => {
        const newMonthAppointments = oldData.monthAppointments.map((appointment) => {
          if (appointment.id === newAppointment.id) {
            return newAppointment;
          }
          return appointment;
        });

        return {
          ...oldData,
          monthAppointments: newMonthAppointments,
        };
      });
    },
  });
};

export const useAddAppointment = () => {
  const { formatMessage: f } = useIntl();
  const queryClient = useQueryClient();

  const addAppointment = useCallback(
    async (appointment) => {
      const { data } = await baseApi.post('/appointments/add-appointment', appointment);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    },
    [f]
  );

  return useMutation(addAppointment, {
    onMutate: async (newAppointment) => {
      console.log('newAppointment', newAppointment);
      queryClient.setQueryData(['admin-appointments'], (oldData) => {
        return {
          ...oldData,
          monthAppointments: [...oldData.monthAppointments, newAppointment],
        };
      });
      return newAppointment;
    },
    onSuccess: (data, _, newAppointment) => {
      const { insertId } = data;
      queryClient.setQueryData(['admin-appointments'], (oldData) => {
        return {
          ...oldData,
          monthAppointments: oldData.monthAppointments.map((appointment) => {
            if (appointment === newAppointment) {
              return { ...appointment, id: insertId };
            }
            return appointment;
          }),
        };
      });
    },
  });
};

export const useDeleteAppointment = () => {
  const { formatMessage: f } = useIntl();
  const queryClient = useQueryClient();

  const deleteAppointment = useCallback(
    async (appointment) => {
      const { data } = await baseApi.post('/appointments/disable-appointment', appointment);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    },
    [f]
  );

  return useMutation(deleteAppointment, {
    onMutate: async (newAppointment) => {
      queryClient.setQueryData(['admin-appointments'], (oldData) => {
        return {
          ...oldData,
          monthAppointments: oldData.monthAppointments.filter((appointment) => appointment.id !== newAppointment.id),
        };
      });
    },
  });
};

export const useGetAppointmentUsers = () => {
  const getWeekAppointments = async () => {
    const { data } = await baseApi.post('/appointments/appointment-users');
    return data;
  };
  return useQuery(['appointment-users'], getWeekAppointments);
};
