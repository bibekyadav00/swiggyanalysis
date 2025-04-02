import { Skeleton } from "@/components/ui/skeleton"

export function FoodSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full md:w-[300px] mt-4 md:mt-0" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-10 w-full md:w-[400px] mb-4" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <Skeleton className="h-6 w-48 mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-video w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

