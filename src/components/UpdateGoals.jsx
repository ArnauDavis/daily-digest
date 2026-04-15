import React, { useRef } from 'react'
import { useStats } from '../context/StatsContext'

function UpdateGoals() {
  const { goals, updateGoals } = useStats()
  const checkboxRef = useRef(null) 

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    updateGoals({
      daily_goal_water: Number(formData.get('daily_water')),
      daily_goal_pee: Number(formData.get('daily_pee')),
      weekly_goal_water: Number(formData.get('weekly_water')),
      weekly_goal_pee: Number(formData.get('weekly_pee'))
    })
    if (checkboxRef.current) checkboxRef.current.checked = false
  }

  return (
    <div className="mx-auto max-w-4xl px-6 my-16">
      <div className="collapse bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-sm overflow-hidden">
        <input id="target-settings-check" type="checkbox" ref={checkboxRef} className="peer" /> 
        
        <label htmlFor="target-settings-check" className="collapse-title p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform peer-checked:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold">Focus & Objectives</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-base-content/40 font-bold">Calibration</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full hidden sm:block">Settings</span>
        </label>
        
        <div className="collapse-content bg-base-200/20 px-8">
          <form className="py-10 space-y-12" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <GoalGroup title="The Daily Path" waterKey="daily_water" peeKey="daily_pee" waterVal={goals?.daily_goal_water} peeVal={goals?.daily_goal_pee} color="primary" />
              <GoalGroup title="The Weekly Horizon" waterKey="weekly_water" peeKey="weekly_pee" waterVal={goals?.weekly_goal_water} peeVal={goals?.weekly_goal_pee} color="secondary" />
            </div>
            <div className="flex justify-center pt-8">
              <button type="submit" className="btn btn-primary rounded-full px-16 h-16 shadow-xl text-lg font-bold">Commit Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function GoalGroup({ title, waterKey, peeKey, waterVal, peeVal, color }) {
  const colorClass = color === 'primary' ? 'focus:text-primary' : 'focus:text-secondary'
  const borderClass = color === 'primary' ? 'bg-primary' : 'bg-secondary'
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
         <div className={`h-0.5 w-6 ${borderClass} rounded-full`}></div>
         <h4 className="text-xs uppercase font-black tracking-widest text-base-content/60">{title}</h4>
      </div>
      <div className="space-y-4">
        <GoalInput name={waterKey} label="Hydration Target" defaultValue={waterVal} colorClass={colorClass} />
        <GoalInput name={peeKey} label="Output Target" defaultValue={peeVal} colorClass={colorClass} />
      </div>
    </div>
  )
}

function GoalInput({ name, label, defaultValue, colorClass }) {
  return (
    <div className="flex justify-between items-end border-b border-base-content/10 pb-2">
      <label className="text-sm font-medium opacity-50 italic">{label}</label>
      <div className="flex items-center gap-2">
        <input name={name} type="number" defaultValue={defaultValue} className={`bg-transparent text-2xl font-serif w-24 text-right outline-none transition-colors ${colorClass}`} />
        <span className="text-[10px] uppercase opacity-20 font-bold">oz</span>
      </div>
    </div>
  )
}

export default UpdateGoals
