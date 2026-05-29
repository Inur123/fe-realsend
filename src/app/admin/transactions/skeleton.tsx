import { Skeleton } from "@/components/ui/skeleton";

export function TransactionListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-5 w-full max-w-[820px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="mt-8 h-7 w-32" />
            <Skeleton className="mt-3 h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="flex w-full flex-wrap items-end gap-4 md:flex-nowrap">
        <div className="min-w-[280px] flex-2 space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="min-w-[150px] flex-1 space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between px-6 py-5">
          <div className="space-y-2">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[56px_210px_240px_110px_150px_250px_110px_120px_72px] items-center gap-4 bg-slate-50/50 px-6 py-4 dark:bg-slate-900/30">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="ml-auto h-4 w-10" />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[56px_210px_240px_110px_150px_250px_110px_120px_72px] items-center gap-4 px-6 py-5"
                >
                  <Skeleton className="h-4 w-5" />
                  <Skeleton className="h-5 w-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-900 dark:bg-slate-950/20">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
