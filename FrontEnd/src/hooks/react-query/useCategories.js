import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useCategories = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getCategories = async () => {
    const { data } = await baseApi.post('/categories', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addCategory = () => {
    const queryClient = useQueryClient();

    const addCategoryApi = useCallback(async (newCategory) => {
      const { data } = await baseApi.post('/categories/add', newCategory);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addCategoryApi, {
      onMutate: async (newCategory) => {
        await queryClient.cancelQueries(['project-categories', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newCategory, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-categories', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateCategory = () => {
    const queryClient = useQueryClient();

    const updateCategoryApi = useCallback(async ({ category_id, name }) => {
      const { data } = await baseApi.put(`/categories/${category_id}`, { name });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateCategoryApi, {
      onMutate: async (categoryUpdated) => {
        console.log('categoryUpdated', categoryUpdated);
        await queryClient.cancelQueries(['project-categories', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.category_id === categoryUpdated.category_id) {
              return categoryUpdated;
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

      onSettled: async (pageCount, error) => {
        await queryClient.invalidateQueries(['project-categories', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateCategories = () => {
    const queryClient = useQueryClient();

    const inactivateCategoriesApi = useCallback(
      async (categories) => {
        const { data } = await baseApi.post('/categories/delete', { category_id: categories.toString() });
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

    return useMutation(inactivateCategoriesApi, {
      onMutate: async (newCategory) => {
        queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          console.log('oldDataMAUUU', oldData, newCategory);
          return {
            ...oldData,
            items: oldData.items.filter(({ category_id }) => !newCategory.includes(category_id)),
          };
        });
      },
      onSettled: async (pageCount, error) => {
        await queryClient.invalidateQueries(['project-categories', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-categories', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  return {
    getCategories: useQuery(['project-categories', { term, pageIndex, pageSize, sortBy }], getCategories),
    addCategory: addCategory(),
    updateCategory: updateCategory(),
    inactivateCategories: inactivateCategories(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
