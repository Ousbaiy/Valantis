import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const ProductSkeleton = () => {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 11 }).map((_, index) => (
        <div key={index} className="p-4 rounded border shadow-md space-y-3">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[150px]" />

          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
