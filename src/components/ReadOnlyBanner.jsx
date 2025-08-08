import React from 'react';
import { Lock } from 'lucide-react';

const ReadOnlyBanner = ({ isReadOnly, currentUserRole }) => {
  if (!isReadOnly) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-center gap-2 text-yellow-400">
        <Lock className="w-5 h-5" />
        <span className="font-medium">Read-Only Access</span>
      </div>
      <p className="text-sm text-yellow-300 mt-1">
        You have {currentUserRole} permissions. Contact the workspace owner to request editing access.
      </p>
    </div>
  );
};

export default ReadOnlyBanner;