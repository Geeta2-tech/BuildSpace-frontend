const Avatar = ({ children, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-md bg-blue-500 flex items-center justify-center text-white font-medium ${className}`}
    >
      {children}
    </div>
  );
};

export default Avatar;
