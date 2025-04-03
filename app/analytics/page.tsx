import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { AnalyticsSkeleton } from "@/components/analytics-skeleton"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Database Analytics</h1>
          <p className="text-muted-foreground mb-6">Explore SQL query results and data insights for the swiggy dataset</p>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsDashboard />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

