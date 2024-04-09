import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useNotifications = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getNotifications = async () => {
    const { data } = await baseApi.post('/notifications', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addNotification = () => {
    const queryClient = useQueryClient();

    const addNotificationApi = useCallback(async (newNotification) => {
      const { data } = await baseApi.post('/notifications/add', newNotification);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addNotificationApi, {
      onMutate: async (newNotification) => {
        await queryClient.cancelQueries(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newNotification, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },
      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateNotification = () => {
    const queryClient = useQueryClient();

    const updateNotificationApi = useCallback(async ({ notification_id, amount, product_id }) => {
      const { data } = await baseApi.put(`/notifications/${notification_id}`, { amount, product_id });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateNotificationApi, {
      onMutate: async (notificationData) => {
        await queryClient.cancelQueries(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.notification_id === notificationData.notification_id) {
              return notificationData;
            }
            return item;
          });
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },
      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-notificacions', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateNotifications = () => {
    const queryClient = useQueryClient();
    const inactivatenotificationsApi = useCallback(async (notifications) => {
      const { data } = await baseApi.post('/notifications/delete', { notification_id: notifications.toString() });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(inactivatenotificationsApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-notificacions', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  };

  return {
    getNotifications: useQuery(['project-notificacions', { term, pageIndex, pageSize, sortBy }], getNotifications),
    addNotification: addNotification(),
    updateNotification: updateNotification(),
    inactivateNotifications: inactivateNotifications(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
