import React, { useState, useRef } from 'react'

function TotalStats({stats, goals, updateGoals}) {
  const [view, setView] = useState('daily') // Toggle between 'daily' and 'weekly'
  const checkboxRef = useRef(null) // To toggle dropdown form

  // Basic totals (All time)
  let totalCals = stats.reduce((sum, stat)=> sum + stat.calories, 0)
  const totalProtein = stats.reduce((sum, stat)=> sum + stat.protein, 0)

  // Date Logic
  const today = new Date().toLocaleDateString()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  // Calculate Daily Totals
  const dailyTotals = stats
    .filter(stat => new Date(stat.created_at).toLocaleDateString() === today)
    .reduce((acc, stat) => {
      return {
        calories: acc.calories + Number(stat.calories || 0),
        protein: acc.protein + Number(stat.protein || 0)
      }
    }, { calories: 0, protein: 0 })

  // Calculate Weekly Totals (Last 7 days)
  const weeklyTotals = stats
    .filter(stat => new Date(stat.created_at) >= oneWeekAgo)
    .reduce((acc, stat) => {
      return {
        calories: acc.calories + Number(stat.calories || 0),
        protein: acc.protein + Number(stat.protein || 0)
      }
    }, { calories: 0, protein: 0 })

  // Determine which goal set to use based on the toggle
  const activeGoals = view === 'daily' 
    ? {
        calories: goals?.daily_goal_calories || 2000,
        protein: goals?.daily_goal_protein || 150 
      }
    : {
        calories: goals?.weekly_goal_calories || 14000,
        protein: goals?.weekly_goal_protein || 1050
      }

  const currentProgress = view === 'daily' ? dailyTotals : weeklyTotals

  return (
    <>
    {/* --- PROGRESS OBSERVATORY --- */}
    <div className="w-full max-w-4xl mx-auto my-12 px-6">
      
      {/* Refined Segmented Control */}
      <div className="flex justify-center mb-12">
        <div className="bg-base-200/50 p-1 rounded-full flex items-center border border-base-content/5">
          <button 
            onClick={() => setView('daily')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              view === 'daily' 
                ? 'bg-base-100 text-primary shadow-sm' 
                : 'text-base-content/40 hover:text-base-content'
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => setView('weekly')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              view === 'weekly' 
                ? 'bg-base-100 text-secondary shadow-sm' 
                : 'text-base-content/40 hover:text-base-content'
            }`}
          >
            Week
          </button>
        </div>
      </div>
          
      {/* Main Visualization Card */}
      <div className="relative overflow-hidden bg-base-100 border border-base-content/5 rounded-[4rem] p-10 md:p-16 shadow-sm">
          
        {/* Decorative background typography */}
        <div className="absolute -top-10 -right-10 text-[12rem] font-serif italic opacity-[0.02] select-none pointer-events-none">
          {view === 'daily' ? 'D' : 'W'}
        </div>
          
        <div className="flex flex-col md:flex-row items-center justify-around gap-16 relative z-10">
          
          {/* Energy (Calories) Focus */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>
              
              <svg className="w-48 h-48 transform -rotate-90 relative">
                {/* Background Track */}
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="2" fill="transparent"
                  className="text-base-content/5"
                />
                {/* Progress Track */}
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(currentProgress.calories / (activeGoals.calories || 1), 1))}
                  strokeLinecap="round"
                  className="text-secondary transition-all duration-[1500ms] ease-in-out"
                />
              </svg>
          
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-5xl font-light tracking-tighter">
                  {activeGoals.calories > 0 ? Math.round((currentProgress.calories / activeGoals.calories) * 100) : 0}
                  <span className="text-xl italic opacity-30">%</span>
                </span>
                <span className="text-[9px] uppercase font-black tracking-[0.3em] opacity-40 mt-1">Energy</span>
              </div>
            </div>
          
            <div className="mt-8 text-center">
              <p className="font-serif italic text-lg opacity-60">
                {currentProgress.calories.toLocaleString()} <span className="text-xs not-italic font-sans opacity-40">/ {activeGoals.calories.toLocaleString()}</span>
              </p>
              <p className="text-[9px] uppercase font-black tracking-widest opacity-20 mt-1">Caloric Flux</p>
            </div>
          </div>
          
          {/* Divider for Desktop */}
          <div className="hidden md:block h-32 w-px bg-base-content/5"></div>
          
          {/* Build (Protein) Focus */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
              
              <svg className="w-48 h-48 transform -rotate-90 relative">
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="2" fill="transparent"
                  className="text-base-content/5"
                />
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(currentProgress.protein / (activeGoals.protein || 1), 1))}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-[1500ms] ease-in-out"
                />
              </svg>
          
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-5xl font-light tracking-tighter">
                  {activeGoals.protein > 0 ? Math.round((currentProgress.protein / activeGoals.protein) * 100) : 0}
                  <span className="text-xl italic opacity-30">%</span>
                </span>
                <span className="text-[9px] uppercase font-black tracking-[0.3em] opacity-40 mt-1">Build</span>
              </div>
            </div>
          
            <div className="mt-8 text-center">
              <p className="font-serif italic text-lg opacity-60">
                {currentProgress.protein}g <span className="text-xs not-italic font-sans opacity-40">/ {activeGoals.protein}g</span>
              </p>
              <p className="text-[9px] uppercase font-black tracking-widest opacity-20 mt-1">Protein Synthesis</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>

     {/* Total stats */}
      <div className="w-full max-w-5xl mx-auto my-16 px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-base-content/5"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20">
            Lifetime Narrative
          </span>
          <div className="h-px flex-1 bg-base-content/5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Protein Milestone */}
          <div className="relative group flex flex-col items-center text-center">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative">
              <span className="text-sm font-bold tracking-widest text-primary uppercase opacity-60">Protein</span>
              <div className="flex items-baseline gap-1 mt-2">
                <h3 className="text-6xl font-serif font-light text-base-content tracking-tighter">
                  {totalProtein}
                </h3>
                <span className="text-lg font-serif italic text-base-content/30">g</span>
              </div>
              <p className="mt-4 text-[11px] font-medium text-base-content/40 leading-relaxed uppercase tracking-widest">
                Accumulated <br /> Vitality
              </p>
            </div>
          </div>

          {/* Calories Milestone - The Centerpiece */}
          <div className="relative group flex flex-col items-center text-center py-8 px-12 bg-base-200/20 rounded-[4rem] border border-base-content/5">
            <div className="relative">
              <span className="text-sm font-bold tracking-widest text-secondary uppercase opacity-60">Energy</span>
              <div className="mt-2">
                <h3 className="text-7xl font-serif font-light text-base-content tracking-tighter">
                  {totalCals.toLocaleString()}
                </h3>
              </div>
              <p className="mt-4 text-[11px] font-medium text-secondary/60 leading-relaxed uppercase tracking-widest">
                Total Calories <br /> Catalogued
              </p>
            </div>
            {/* Decorative center ring */}
            <div className="absolute inset-0 border-2 border-secondary/5 rounded-[4rem] scale-110 group-hover:scale-105 transition-transform duration-700"></div>
          </div>

          {/* Records Milestone */}
          <div className="relative group flex flex-col items-center text-center">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative">
              <span className="text-sm font-bold tracking-widest text-accent uppercase opacity-60">Volume</span>
              <div className="flex items-baseline gap-1 mt-2">
                <h3 className="text-6xl font-serif font-light text-base-content tracking-tighter">
                  {stats.length}
                </h3>
                <span className="text-lg font-serif italic text-base-content/30">#</span>
              </div>
              <p className="mt-4 text-[11px] font-medium text-base-content/40 leading-relaxed uppercase tracking-widest">
                Entries in <br /> your journal
              </p>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}

export default TotalStats