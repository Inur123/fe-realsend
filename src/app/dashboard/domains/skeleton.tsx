import { Skeleton } from "@/components/ui/skeleton";

export function DomainsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-[420px] max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg shrink-0" />
      </div>

      {/* Filter Bar */}
      <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
        <div className="space-y-1.5 flex-2 min-w-[280px]">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>

        {/* Table Header Row */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 px-6 py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-full col-span-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-3 w-6" />
              <div className="col-span-2 space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="flex gap-2 ml-auto">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-24 rounded-lg" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DomainDetailSkeleton() {
  const dnsRows = [
    { title: "SPF Record (TXT)", hostWidth: "w-16", valueWidth: "w-3/5" },
    { title: "DKIM Record (TXT)", hostWidth: "w-44", valueWidth: "w-11/12" },
    { title: "DMARC Record (TXT)", hostWidth: "w-24", valueWidth: "w-2/3" },
    { title: "Return-Path CNAME", hostWidth: "w-20", valueWidth: "w-1/2" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-10 w-[420px] max-w-full" />
            <Skeleton className="h-4 w-[360px] max-w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/10">
              <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full max-w-[620px]" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-[520px] max-w-full" />
            </div>

            <div className="mt-6 space-y-5">
              {dnsRows.map((row) => (
                <div
                  key={row.title}
                  className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className={`h-3 ${row.hostWidth}`} />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                    <Skeleton className={`h-5 ${row.valueWidth}`} />
                    <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-full max-w-[420px]" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="mt-7 space-y-4">
              {["Host", "Port", "Username", "Password / API Key"].map(
                (label, idx) => (
                  <div key={label} className="space-y-2">
                    <Skeleton
                      className={`h-3 ${idx === 3 ? "w-32" : "w-20"}`}
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <Skeleton
                        className={`h-5 ${
                          idx === 0
                            ? "w-40"
                            : idx === 1
                              ? "w-12"
                              : idx === 2
                                ? "w-24"
                                : "w-28"
                        }`}
                      />
                      <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-7 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
