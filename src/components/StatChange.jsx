import React from 'react'
import { useState } from "react"

function StatChange({addStat}) {
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")


   async function handleSubmit(e) {
    e.preventDefault()

    const newStat = {
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
    }
    await addStat(newStat)
    setCalories("")
    setProtein("")
   }


  return (
    <>
      <div className="w-full max-w-4xl mx-auto my-12 px-6">
        {/* Header Section - Off-center for a modern editorial look */}
        <div className="flex flex-col mb-12 ml-4">
          <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
            Entry No. {new Date().toLocaleDateString()}
          </span>
          <h2 className="text-5xl font-serif font-light text-base-content leading-tight">
            Body <span className="italic font-normal">Intelligence.</span>
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          {/* The "Track" Grid - breaking away from the single column box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Calories Card */}
            <div className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-primary/20 transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">Fuel</span>
              </div>
              
              <input
                type="number"
                placeholder="0"
                className="w-full bg-transparent text-6xl font-serif outline-none placeholder:text-base-content/5"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <p className="mt-2 text-sm font-medium opacity-40 uppercase tracking-widest">Total Calories</p>
            </div>
        
            {/* Protein Card */}
            <div className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-secondary/20 transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">Build</span>
              </div>
        
              <input
                type="number"
                placeholder="0"
                className="w-full bg-transparent text-6xl font-serif outline-none placeholder:text-base-content/5"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <p className="mt-2 text-sm font-medium opacity-40 uppercase tracking-widest">Grams Protein</p>
            </div>
          </div>
        
          {/* The Action - Floating slightly off the grid */}
          <div className="mt-12 flex justify-end">
            <button 
              type="submit"
              className="btn btn-primary btn-lg rounded-full px-12 h-20 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group"
            >
              <span className="text-lg font-bold tracking-tight">Sync Entry</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>

    </>
  )
}

export default StatChange