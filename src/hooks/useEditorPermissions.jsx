import { useEffect } from 'react';
import toast from 'react-hot-toast';

const useEditorPermissions = ({ isEditMode, userPermissions, onCancel }) => {
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
};

export default useEditorPermissions;