import React from 'react';

const UserAvatar = ({ username = '?', size = 'md', isOnline = false }) => {
  const initials = username.trim().charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className="relative inline-block select-none">
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-md shadow-indigo-500/10`}>
        {initials}
      </div>
      <span className={`absolute -bottom-0.5 -right-0.5 block rounded-full ring-2 ring-panelBg ${
        isOnline 
          ? 'w-3 h-3 bg-green-500 shadow-sm shadow-green-500/50' 
          : 'w-3 h-3 bg-gray-500'
      }`} />
    </div>
  );
};

export default UserAvatar;