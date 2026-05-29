import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-[680px] max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Overview stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-slate-100 bg-white/60 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
          >
            <Skeleton className="absolute left-0 top-0 h-[3px] w-full rounded-none" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="mt-10 h-9 w-24" />
            <Skeleton className="mt-3 h-4 w-48" />
          </div>
        ))}
      </div>

      {/* Analytics area */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white/60 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 lg:col-span-2">
          <div className="space-y-2">
            <Skeleton className="h-7 w-80" />
            <Skeleton className="h-4 w-[520px] max-w-full" />
          </div>
          <div className="mt-8 flex h-[280px] items-end justify-between gap-3 px-6 pb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-3">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-36 w-full rounded-t-lg" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/60 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="mt-8 space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-4 w-60" />
              </div>
            ))}
            <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-3">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs */}
      <div className="rounded-xl border border-slate-100 bg-white/60 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-[520px] max-w-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-72 max-w-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-32 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
