import { Skeleton } from "@/components/ui/skeleton";

export function ApiKeysSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-[400px] max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg shrink-0" />
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-52" />
        </div>

        {/* Table Header Row */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 px-6 py-3 grid grid-cols-7 gap-4">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-full col-span-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-7 gap-4 items-center">
              <Skeleton className="h-3 w-4" />
              <div className="col-span-2">
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-3 w-24 font-mono" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
