import { DB_TABLE_ROLS } from 'data/rolsData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useUserPermissions = () => {
  const [permissionsList, setPermissionsList] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser.permissions) {
      setPermissionsList(currentUser.permissions);
    }
  }, [currentUser]);

  const userHasPermission = (permission) => permissionsList.includes(permission);
  return { userHasPermission };
};

export const useExportAllPermissions = () =>
  DB_TABLE_ROLS.flatMap(({ permissionKey }) => ['C', 'R', 'U', 'D'].map((permissionType) => `${permissionType}_${permissionKey}`));
