import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useExpenses = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getExpenses = async () => {
    const { data } = await baseApi.post('/expenses', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };
  const getExpenseTypes = async () => {
    const { data } = await baseApi.get(`/expenses/types`);
    return data.items;
  };

  const addExpense = () => {
    const queryClient = useQueryClient();

    const addExpenseApi = useCallback(async (newExpense) => {
      const { data } = await baseApi.post('/expenses/add', newExpense);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addExpenseApi, {
      onMutate: async (newExpense) => {
        await queryClient.cancelQueries(['project-expenses', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newExpense, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-expenses', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateExpense = () => {
    const queryClient = useQueryClient();

    const updateCategoryApi = useCallback(async ({ expense_id, expense_type, price }) => {
      const { data } = await baseApi.put(`/expenses/${expense_id}`, { expense_type, price });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateCategoryApi, {
      onMutate: async (expenseUpdated) => {
        console.log('expenseUpdated', expenseUpdated);
        await queryClient.cancelQueries(['project-expenses', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.expense_id === expenseUpdated.expense_id) {
              return expenseUpdated;
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
        await queryClient.invalidateQueries(['project-expenses', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-expenses', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateExpenses = () => {
    const queryClient = useQueryClient();
    const inactivateExpensesApi = useCallback(async (expenses) => {
      const { data } = await baseApi.post('/expenses/delete', { expense_id: expenses.toString() });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(inactivateExpensesApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-expenses', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  };

  return {
    getExpenses: useQuery(['project-expenses', { term, pageIndex, pageSize, sortBy }], getExpenses),
    addExpense: addExpense(),
    updateExpense: updateExpense(),
    getExpenseTypes: useQuery('expense-types', getExpenseTypes),
    inactivateExpenses: inactivateExpenses(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
