import React from 'react';
import { Skeleton, Card } from '../ui';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="bg-[#1A1A1A] border border-white/12 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-32 rounded-2xl" />
            <Skeleton className="h-11 w-44 rounded-full" />
          </div>
        </div>
      </div>

      {/* Overview Metrics Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-5 flex items-center justify-between bg-[#1A1A1A]">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="w-11 h-11 rounded-2xl" />
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 bg-[#1A1A1A] space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </Card>

          <Card className="p-6 bg-[#1A1A1A] space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6 bg-[#1A1A1A] space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </Card>

          <Card className="p-6 bg-[#1A1A1A] space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};
