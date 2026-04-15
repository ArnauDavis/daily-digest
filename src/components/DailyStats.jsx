import React from 'react'
import { useStats } from '../context/StatsContext'

function DailyStats() {
  const { peeStat, waterStat } = useStats()

  // --- Logic to get today's data ---
  const today = new Date().toLocaleDateString()
  const isToday = (timestamp) => new Date(timestamp).toLocaleDateString() === today

  const dailyWater = waterStat
    .filter(item => isToday(item.created_at))
    .reduce((sum, item) => sum + Number(item.water_amount || 0), 0)

  const dailyPee = peeStat
    .filter(item => isToday(item.created_at))
    .reduce((sum, item) => sum + Number(item.pee_amount || 0), 0)

  // Net calculation
  const netFluid = dailyWater - dailyPee
  
  // Calculate percentage for a "split" progress bar
  // We'll base the visual on total fluid handled (In + Out)
  const totalVolume = dailyWater + dailyPee
  const waterWidth = totalVolume > 0 ? (dailyWater / totalVolume) * 100 : 50
  const peeWidth = totalVolume > 0 ? (dailyPee / totalVolume) * 100 : 50

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-6">
      <div className="bg-base-100 border border-base-content/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary opacity-60">System Balance</span>
          <h2 className="text-4xl font-serif mt-2 italic">In <span className="not-italic text-base-content/20 mx-2">vs</span> Out</h2>
        </div>

        {/* Comparison Bar */}
        <div className="relative h-20 w-full bg-base-200 rounded-2xl flex overflow-hidden border border-base-content/5">
          <div 
            style={{ width: `${waterWidth}%` }} 
            className="bg-blue-500/80 h-full flex items-center justify-start px-6 transition-all duration-1000"
          >
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Hydration</span>
          </div>
          <div 
            style={{ width: `${peeWidth}%` }} 
            className="bg-yellow-500/80 h-full flex items-center justify-end px-6 transition-all duration-1000"
          >
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Output</span>
          </div>
          
          {/* Center Divider */}
          <div className="absolute top-0 bottom-0 left-[calc(50%-1px)] w-0.5 bg-base-100/30 z-10"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="text-center">
            <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Total In</p>
            <p className="font-serif text-2xl text-blue-500">{dailyWater}<span className="text-xs ml-1">oz</span></p>
          </div>

          <div className="text-center border-x border-base-content/5">
            <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Net Retained</p>
            <p className={`font-serif text-2xl ${netFluid >= 0 ? 'text-success' : 'text-error'}`}>
              {netFluid > 0 ? `+${netFluid}` : netFluid}
              <span className="text-xs ml-1">oz</span>
            </p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Total Out</p>
            <p className="font-serif text-2xl text-yellow-600">{dailyPee}<span className="text-xs ml-1">oz</span></p>
          </div>
        </div>

        {/* Narrative Insight */}
        <div className="mt-8 pt-8 border-t border-base-content/5 text-center">
          <p className="text-xs font-serif italic opacity-50">
            {netFluid > 20 
              ? "Your body is holding onto significant fluids. Keep moving!" 
              : netFluid < 0 
              ? "Output exceeds intake. Consider increasing hydration."
              : "Your fluid exchange is currently balanced."}
          </p>
        </div>

      </div>
    </div>
  )
}

export default DailyStats