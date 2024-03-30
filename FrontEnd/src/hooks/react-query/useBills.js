import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useBills = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getBills = async () => {
    const { data } = await baseApi.post('/bills', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addBill = () => {
    const queryClient = useQueryClient();

    const addBillApi = useCallback(async (newBill) => {
      const { data } = await baseApi.post('/bills/add', newBill);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addBillApi, {
      onMutate: async (newBill) => {
        await queryClient.cancelQueries(['project-bills', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newBill, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-bills', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateBill = () => {
    const queryClient = useQueryClient();
    const updateBillApi = useCallback(async (billData) => {
      const { data } = await baseApi.put(`/bills/${billData.get('bills_id')}`, billData);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);
    return useMutation(updateBillApi, {
      onMutate: async (billData) => {
        await queryClient.cancelQueries(['project-bills', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }]);
        queryClient.setQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.bills_id === billData.get('bills_id')) {
              return billData;
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
        await queryClient.invalidateQueries(['project-bills', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-bills', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };
  const deleteBills = () => {
    const queryClient = useQueryClient();
    const deleteBillsApi = useCallback(async (bills_id) => {
      const { data } = await baseApi.post('/bills/delete', bills_id);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);
    return useMutation(deleteBillsApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-bills', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  };
  return {
    getBills: useQuery(['project-bills', { term, pageIndex, pageSize, sortBy }], getBills),
    addBill: addBill(),
    updateBill: updateBill(),
    deleteBills: deleteBills(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
