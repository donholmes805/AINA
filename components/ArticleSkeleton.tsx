
import React from 'react';

const ArticleSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse-fast overflow-hidden">
      {/* Image Placeholder */}
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700"></div>
      
      <div className="p-6 sm:p-8">
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
