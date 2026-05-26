import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSecuritySkeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-[400px] max-w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Password Form Card */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <div className="p-6 space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex justify-end">
              <Skeleton className="h-11 w-40 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Security Info Card */}
        <div>
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-800 space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
              <Skeleton className="h-5 w-32 bg-white/20" />
              <Skeleton className="h-3 w-48 bg-white/10" />
            </div>
            <div className="p-5 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
