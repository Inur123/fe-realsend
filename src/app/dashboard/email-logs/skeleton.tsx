import { Skeleton } from "@/components/ui/skeleton";

export function LogsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-[480px] max-w-full" />
      </div>

      {/* Filter Bar */}
      <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
        <div className="space-y-1.5 flex-2 min-w-[280px]">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5 flex-1 min-w-[180px]">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 space-y-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>

        {/* Table Header Row */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 px-6 py-3 grid grid-cols-6 gap-4">
          <Skeleton className="h-3 w-full col-span-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-6 gap-4 items-center">
              <div className="col-span-2 space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-full max-w-[160px]" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-16 rounded-lg ml-auto" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-24 rounded-lg" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
