import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useBrands = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getBrands = async () => {
    const { data } = await baseApi.post('/brands', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addBrand = () => {
    const queryClient = useQueryClient();

    const addBrandApi = useCallback(async (newBrand) => {
      const { data } = await baseApi.post('/brands/add', newBrand);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addBrandApi, {
      onMutate: async (newBrand) => {
        await queryClient.cancelQueries(['project-brands', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newBrand, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-brands', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateBrand = () => {
    const queryClient = useQueryClient();

    const updateBrandApi = useCallback(async ({ brand_id, name }) => {
      const { data } = await baseApi.put(`/brands/${ brand_id }`, { name });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateBrandApi, {
      onMutate: async (brandUpdated) => {
        await queryClient.cancelQueries(['project-brands', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.brand_id === brandUpdated.brand_id) {
              return brandUpdated;
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

      onSettled: async (pageCount , error) => {
        await queryClient.invalidateQueries(['project-brands', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateBrands = () => {
    const queryClient = useQueryClient();
  
    const inactivateBrandsApi = useCallback(
      async (brands) => {
        const { data } = await baseApi.post('/brands/delete', { brand_id: brands.toString() });
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
  
    return useMutation(inactivateBrandsApi, {
      onMutate: async (newBrand) => {
        queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          return {
            ...oldData,
            items: oldData.items.filter(({ brand_id }) => !newBrand.includes(brand_id)),
          };
        });
      },
      onSettled: async (pageCount , error) => {
        await queryClient.invalidateQueries(['project-brands', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-brands', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  return {
    getBrands: useQuery(['project-brands', { term, pageIndex, pageSize, sortBy }], getBrands),
    addBrand: addBrand(),
    updateBrand: updateBrand(),
    inactivateBrands: inactivateBrands(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
