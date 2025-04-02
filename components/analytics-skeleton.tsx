import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>

      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  )
}

