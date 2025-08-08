import toast from 'react-hot-toast';
import { useEffect } from 'react';
const PermissionCheck = ({ isEditMode, userPermissions, onCancel, onPageCreated, createdPageData }) => {
  useEffect(() => {
    if (isEditMode && !userPermissions.canView) {
      toast.error('You don\'t have permission to view this page');
      onCancel && onCancel();
      return;
    }

    if (!isEditMode && !userPermissions.canCreatePages) {
      toast.error('You don\'t have permission to create pages');
      onCancel && onCancel();
      return;
    }
  }, [isEditMode, userPermissions, onCancel]);

  return null; // This component doesn't render anything
};

export default PermissionCheck;
