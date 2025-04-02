import { Skeleton } from "@/components/ui/skeleton"

export function RestaurantSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Skeleton className="h-10 w-full md:w-[400px]" />
        <Skeleton className="h-10 w-full md:w-[200px]" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full md:w-[400px]" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>

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

export function RestaurantDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="aspect-video w-full rounded-lg mb-6" />

          <div className="mb-6">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <div className="flex flex-wrap gap-3 mb-4">
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>

        <div>
          <Skeleton className="h-[200px] w-full rounded-lg mb-6" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

