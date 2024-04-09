import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const usePayments = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getPayments = async () => {
    const { data } = await baseApi.post('/payments', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addPayment = () => {
    const queryClient = useQueryClient();

    const addPaymentApi = useCallback(async (newPayment) => {
      const { data } = await baseApi.post('/payments/add', newPayment);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addPaymentApi, {
      onMutate: async (newPayment) => {
        await queryClient.cancelQueries(['project-payments', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newPayment, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-payments', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updatePayment = () => {
    const queryClient = useQueryClient();

    const updatePaymentApi = useCallback(async (paymentData) => {
      const { data } = await baseApi.put(`/payments/${paymentData.get('payment_id')}`, paymentData);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updatePaymentApi, {
      onMutate: async (paymentData) => {
        await queryClient.cancelQueries(['project-payments', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.payment_id === paymentData.get('payment_id')) {
              return paymentData;
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
        await queryClient.invalidateQueries(['project-payments', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-payments', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivatePayments = () => {
    const queryClient = useQueryClient();
    const inactivatePaymentosApi = useCallback(async (payments) => {
      const { data } = await baseApi.post('/payments/delete', { payment_id: payments.toString() });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);
    return useMutation(inactivatePaymentosApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-payments', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  };

  return {
    getPayments: useQuery(['project-payments', { term, pageIndex, pageSize, sortBy }], getPayments),
    addPayment: addPayment(),
    updatePayment: updatePayment(),
    inactivatePayments: inactivatePayments(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
