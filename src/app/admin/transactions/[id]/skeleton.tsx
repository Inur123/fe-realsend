import { Skeleton } from "@/components/ui/skeleton";

export function TransactionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-3 w-80" />
          </div>
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-6 p-6">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/10">
            <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded" />
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-full max-w-4xl" />
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-6 w-64" />

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/50"
                >
                  <Skeleton className="h-4 w-40" />
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950">
                    <Skeleton className="h-5 w-44" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950/30">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </div>
                <div className="space-y-4 px-6 pb-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/10"
                    >
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="mt-3 h-5 w-64" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950/30">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-56" />
                  </div>
                </div>
                <div className="space-y-4 px-6 pb-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/10"
                    >
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="mt-3 h-5 w-56" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/50 sm:flex-row">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 shrink-0 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-72" />
                </div>
              </div>
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
              <Skeleton className="h-4 w-full max-w-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
