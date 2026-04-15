import React, { useState } from 'react'
import { useStats } from '../context/StatsContext'

function TotalStats() {
  const { peeStat, waterStat, goals } = useStats()
  const [view, setView] = useState('daily')

  // --- Date Logic ---
  const today = new Date().toLocaleDateString()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const isToday = (timestamp) => new Date(timestamp).toLocaleDateString() === today
  const isThisWeek = (timestamp) => new Date(timestamp) >= oneWeekAgo

  // --- Calculation Helpers ---
  const calculateTotal = (data, filterFn, key) => {
    return data
      .filter(item => filterFn(item.created_at))
      .reduce((sum, item) => sum + Number(item[key] || 0), 0)
  }

  const currentPee = view === 'daily' 
    ? calculateTotal(peeStat, isToday, 'pee_amount')
    : calculateTotal(peeStat, isThisWeek, 'pee_amount')

  const currentWater = view === 'daily' 
    ? calculateTotal(waterStat, isToday, 'water_amount')
    : calculateTotal(waterStat, isThisWeek, 'water_amount')

  // --- Goal Logic (Context based) ---
  const activeGoals = view === 'daily' 
    ? {
        pee: goals?.daily_goal_pee || 50,
        water: goals?.daily_goal_water || 64
      }
    : {
        pee: goals?.weekly_goal_pee || 350,
        water: goals?.weekly_goal_water || 448
      }

  // --- Lifetime Milestone Logic ---
  const lifetimePee = peeStat.reduce((sum, item) => sum + Number(item.pee_amount || 0), 0)
  const lifetimeWater = waterStat.reduce((sum, item) => sum + Number(item.water_amount || 0), 0)
  const combinedEntryCount = peeStat.length + waterStat.length

  return (
    <>
      <div className="w-full max-w-4xl mx-auto my-12 px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-base-content/5"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20">Goals</span>
          <div className="h-px flex-1 bg-base-content/5"></div>
        </div>
        <div className="flex justify-center mb-12">
          <div className="bg-base-200/50 p-1 rounded-full flex items-center border border-base-content/5">
            {['daily', 'weekly'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  view === v ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/40 hover:text-base-content'
                }`}
              >
                {v === 'daily' ? 'Day' : 'Week'}
              </button>
            ))}
          </div>
        </div>
          
        <div className="relative overflow-hidden bg-base-100 border border-base-content/5 rounded-[4rem] p-10 md:p-16 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-around gap-16 relative z-10">
            <StatCircle label="Hydration" value={currentWater} goal={activeGoals.water} unit="oz" color="text-blue-500" glow="bg-blue-500/10" />
            <div className="hidden md:block h-32 w-px bg-base-content/5"></div>
            <StatCircle label="Output" value={currentPee} goal={activeGoals.pee} unit="oz" color="text-yellow-500" glow="bg-yellow-500/10" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto my-16 px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-base-content/5"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20">Lifetime Narrative</span>
          <div className="h-px flex-1 bg-base-content/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <MilestoneStat label="Water Total" value={lifetimeWater} unit="oz" color="text-blue-500" />
          <MilestoneStat label="Pee Total" value={lifetimePee} unit="oz" color="text-yellow-500" centerpiece={true} />
          <MilestoneStat label="Records" value={combinedEntryCount} unit="#" color="text-accent" subtitle="Pee + Water" />
        </div>
      </div>
    </>
  )
}

function StatCircle({ label, value, goal, unit, color, glow }) {
  const percentage = goal > 0 ? Math.round((value / goal) * 100) : 0
  const radius = 88
  const circ = 2 * Math.PI * radius
  const offset = circ - (Math.min(value / goal, 1) * circ)

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className={`absolute inset-0 ${glow} rounded-full blur-3xl`}></div>
        <svg className="w-48 h-48 transform -rotate-90 relative">
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-base-content/5" />
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className={`${color} transition-all duration-1000`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-5xl font-light tracking-tighter">{percentage}<span className="text-xl italic opacity-30">%</span></span>
          <span className="text-[9px] uppercase font-black tracking-[0.3em] opacity-40 mt-1">{label}</span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="font-serif italic text-lg opacity-60">{value} <span className="text-xs not-italic font-sans opacity-40">/ {goal} {unit}</span></p>
      </div>
    </div>
  )
}

function MilestoneStat({ label, value, unit, color, centerpiece, subtitle }) {
  return (
    <div className={`flex flex-col items-center text-center ${centerpiece ? 'py-8 px-12 bg-base-200/20 rounded-[4rem] border border-base-content/5' : ''}`}>
      <span className={`text-sm font-bold tracking-widest ${color} uppercase opacity-60`}>{label}</span>
      <div className="flex items-baseline gap-1 mt-2">
        <h3 className={`${centerpiece ? 'text-7xl' : 'text-6xl'} font-serif font-light text-base-content tracking-tighter`}>{value}</h3>
        <span className="text-lg font-serif italic text-base-content/30">{unit}</span>
      </div>
      {subtitle && <p className="mt-4 text-[11px] font-medium text-base-content/40 uppercase tracking-widest">{subtitle}</p>}
    </div>
  )
}

export default TotalStats