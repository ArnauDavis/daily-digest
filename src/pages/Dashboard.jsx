import { useStats } from "../context/StatsContext"
import DailyStats from "../components/DailyStats"
import StatChange from '../components/StatChange'
import TotalStats from '../components/TotalStats'
import UpdateGoals from '../components/UpdateGoals'

function Dashboard() {
  const { loading } = useStats()

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 mt-4">

      <section>
        <DailyStats />
      </section>


      <section className="mt-8 mb-4">
        <StatChange />
      </section>

      <section className="max-w-4xl mx-auto px-6 space-y-8">
        <TotalStats />
        
        <UpdateGoals />
      </section>
    </div>
  )
}

export default Dashboard