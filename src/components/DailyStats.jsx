import React, { useMemo } from 'react'
import { useStats } from '../context/StatsContext'

function DailyStats() {
  const { peeStat, waterStat } = useStats()

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
    
    const isToday = (dateStr) => {
      if (!dateStr) return false
      return dateStr.startsWith(today)
    }

    const water = waterStat
      .filter(item => isToday(item.created_at))
      .reduce((sum, item) => sum + Number(item.water_amount || 0), 0)

    const pee = peeStat
      .filter(item => isToday(item.created_at))
      .reduce((sum, item) => sum + Number(item.pee_amount || 0), 0)

    const total = water + pee
    const net = water - pee

    // returns an object containing the calculated daily totals and visual bar widths
    return {
      water,
      pee,
      net,
      waterWidth: total > 0 ? (water / total) * 100 : 50,
      peeWidth: total > 0 ? (pee / total) * 100 : 50
    }
  }, [peeStat, waterStat])

  return (
    <div className="w-full">
      <div className="bg-base-100 border border-base-content/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary opacity-60">System Balance</span>
          <h2 className="text-4xl font-serif mt-2 italic">In <span className="not-italic text-base-content/20 mx-2">vs</span> Out</h2>
        </div>

        {/* Comparison Bar */}
        <div className="relative h-20 w-full bg-base-200 rounded-2xl flex overflow-hidden border border-base-content/5">
          <div 
            style={{ width: `${stats.waterWidth}%` }} 
            className="bg-blue-500/80 h-full flex items-center justify-start px-6 transition-all duration-1000"
          >
            <span className="text-info-content text-[10px] font-black uppercase tracking-widest">Hydration</span>
          </div>
          <div 
            style={{ width: `${stats.peeWidth}%` }} 
            className="bg-yellow-500/80 h-full flex items-center justify-end px-6 transition-all duration-1000"
          >
            <span className="text-warning-content text-[10px] font-black uppercase tracking-widest">Output</span>
          </div>
          
          <div className="absolute top-0 bottom-0 left-[calc(50%-1px)] w-0.5 bg-base-100/30 z-10"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          <StatItem label="Total In" value={stats.water} color="text-blue-500" />
          <div className="text-center border-x border-base-content/5">
            <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Net Retained</p>
            <p className={`font-serif text-2xl ${stats.net >= 0 ? 'text-success' : 'text-error'}`}>
              {stats.net > 0 ? `+${stats.net}` : stats.net}
              <span className="text-xs ml-1 font-sans">cc</span>
            </p>
          </div>
          <StatItem label="Total Out" value={stats.pee} color="text-yellow-600" />
        </div>

        {/* Narrative Insight */}
        <div className="mt-8 pt-8 border-t border-base-content/5 text-center">
          <p className="text-xs font-serif italic opacity-50">
            {stats.net > 20 
              ? "Your body is holding onto significant fluids. Keep moving!" 
              : stats.net < 0 
              ? "Output exceeds intake. Consider increasing hydration."
              : "Your fluid exchange is currently balanced."}
          </p>
        </div>

      </div>
    </div>
  )
}

// Simple internal helper to keep the JSX clean
function StatItem({ label, value, color }) {
  return (
    <div className="text-center">
      <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">{label}</p>
      <p className={`font-serif text-2xl ${color}`}>
        {value}<span className="text-xs ml-1 font-sans">cc</span>
      </p>
    </div>
  )
}

export default DailyStats