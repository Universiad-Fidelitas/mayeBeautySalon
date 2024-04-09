import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useProducts = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getProducts = async () => {
    const { data } = await baseApi.post('/products', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addProduct = () => {
    const queryClient = useQueryClient();

    const addProductApi = useCallback(async (newProduct) => {
      const { data } = await baseApi.post('/products/add', newProduct);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addProductApi, {
      onMutate: async (newProduct) => {
        await queryClient.cancelQueries(['project-products', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-products', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-products', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newProduct, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-products', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-products', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateProduct = () => {
    const queryClient = useQueryClient();

    const updateProductApi = useCallback(async (productData) => {
      const { data } = await baseApi.put(`/products/${productData.get('product_id')}`, productData);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateProductApi, {
      onMutate: async (productData) => {
        await queryClient.cancelQueries(['project-products', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-products', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-products', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.product_id === productData.get('product_id')) {
              return productData;
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
        await queryClient.invalidateQueries(['project-products', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-products', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateProductos = () => {
    const queryClient = useQueryClient();
    const inactivateProductosApi = useCallback(async (products) => {
      const { data } = await baseApi.post('/products/delete', { product_id: products.toString() });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);
    return useMutation(inactivateProductosApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-products', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  };

  return {
    getProducts: useQuery(['project-products', { term, pageIndex, pageSize, sortBy }], getProducts),
    addProduct: addProduct(),
    updateProduct: updateProduct(),
    inactivateProductos: inactivateProductos(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
