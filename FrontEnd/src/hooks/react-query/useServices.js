import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export const useServices = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();
  const getServices = async () => {
    const { data } = await baseApi.post('/services', {
        term,
        pageIndex,
        pageSize,
        sortBy
      });
      return data;
  };

  const addServices = () => {
    const queryClient = useQueryClient();
  
    const addServicesApi = useCallback( async (newService) => {
        const { data } = await baseApi.post('/services/add', newService);
        const { success, message } = data;
        if (success) {
          toast(f({ id: message }), { className: 'success' });
        } else {
          toast(f({ id: message }), { className: 'danger' });
        }
        return data;
    },[f]);
  
    return useMutation(addServicesApi, {
      onMutate: async (newService) => {
        await queryClient.cancelQueries(['project-services', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-services', { term, pageIndex, pageSize, sortBy }]);
  
        queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newService, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });
  
        return { previousData };
      },
  
      onSettled: async ({ pageCount }, error, _) => {
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  }

  const updateServices = () => {
    const queryClient = useQueryClient();
  
    const updateServicesApi = useCallback( async (newService) => {
        const { data } = await baseApi.put(`/services/${newService.service_id}`, newService);
        const { success, message } = data;
        if (success) {
          toast(f({ id: message }), { className: 'success' });
        } else {
          toast(f({ id: message }), { className: 'danger' });
        }
        return data;
    },[f]);
  
    return useMutation(updateServicesApi, {
      onMutate: async (newService) => {
        await queryClient.cancelQueries(['project-services', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-services', { term, pageIndex, pageSize, sortBy }]);
  
        queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.service_id === newService.service_id) {
              return newService;
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
  
      onSettled: async ({ pageCount }, error, _) => {
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  }

  const deleteServices = () => {
    const queryClient = useQueryClient();
  
    const deleteServicesApi = useCallback( async (service_ids) => {
        const { data } = await baseApi.post('/services/delete', service_ids);
        const { success, message } = data;
        if (success) {
          toast(f({ id: message }), { className: 'success' });
        } else {
          toast(f({ id: message }), { className: 'danger' });
        }
        return data;
    },[f]);
  
    return useMutation(deleteServicesApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy }]);
      },
    });
  }

  return { 
    getServices: useQuery(['project-services', { term, pageIndex, pageSize, sortBy }], getServices),
    addServices: addServices(),
    updateServices: updateServices(),
    deleteServices: deleteServices()
  }
};