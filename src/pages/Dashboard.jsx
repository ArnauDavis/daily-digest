import DailyStats from "../components/DailyStats"
import StatChange from '../components/StatChange'
import TotalStats from '../components/TotalStats'
import UpdateGoals from '../components/UpdateGoals'

function Dashboard() {
  return (
    <div className="grow space-y-8 pb-20 mt-5 mx-1">
      <DailyStats />
      <StatChange />
      <TotalStats />
      <UpdateGoals />
    </div>
  )
}

export default Dashboard