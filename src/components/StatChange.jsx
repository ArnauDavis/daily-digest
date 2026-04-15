import React, { useState } from "react"
import { useStats } from "../context/StatsContext.jsx"

function StatChange() {
  const { addPeeStat, addWaterStat, addFoodStat } = useStats()

  // Local states for the three different inputs
  const [peeAmount, setPeeAmount] = useState("")
  const [waterAmount, setWaterAmount] = useState("")
  const [foodItem, setFoodItem] = useState("")

  // Specific Handlers
  const handlePeeSubmit = async (e) => {
    e.preventDefault()
    if (!peeAmount) return
    await addPeeStat({ pee_amount: Number(peeAmount) })
    setPeeAmount("")
  }

  const handleWaterSubmit = async (e) => {
    e.preventDefault()
    if (!waterAmount) return
    await addWaterStat({ water_amount: Number(waterAmount) })
    setWaterAmount("")
  }

  const handleFoodSubmit = async (e) => {
    e.preventDefault()
    if (!foodItem) return
    await addFoodStat({ food_amount: foodItem })
    setFoodItem("")
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col mb-12 ml-4">
        <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
          Entry No. {new Date().toLocaleDateString()}
        </span>
        <h2 className="text-5xl font-serif font-light text-base-content leading-tight">
          Body <span className="italic font-normal">Intelligence.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PEE CARD */}
        <form onSubmit={handlePeeSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-yellow-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
              </svg>
            </div>
            <button type="submit" className="btn btn-ghost btn-circle btn-sm opacity-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <input
            type="number"
            placeholder="0"
            className="w-full bg-transparent text-5xl font-serif outline-none placeholder:text-base-content/5"
            value={peeAmount}
            onChange={(e) => setPeeAmount(e.target.value)}
          />
          <p className="mt-2 text-[10px] font-black opacity-40 uppercase tracking-widest">Pee (oz)</p>
        </form>

        {/* WATER CARD */}
        <form onSubmit={handleWaterSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-blue-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
              </svg>
            </div>
            <button type="submit" className="btn btn-ghost btn-circle btn-sm opacity-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <input
            type="number"
            placeholder="0"
            className="w-full bg-transparent text-5xl font-serif outline-none placeholder:text-base-content/5"
            value={waterAmount}
            onChange={(e) => setWaterAmount(e.target.value)}
          />
          <p className="mt-2 text-[10px] font-black opacity-40 uppercase tracking-widest">Water (oz)</p>
        </form>

        {/* FOOD CARD */}
        <form onSubmit={handleFoodSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-green-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <button type="submit" className="btn btn-ghost btn-circle btn-sm opacity-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Entry..."
            className="w-full bg-transparent text-3xl font-serif outline-none placeholder:text-base-content/5"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
          />
          <p className="mt-2 text-[10px] font-black opacity-40 uppercase tracking-widest">Food Journal</p>
        </form>

      </div>

      <div className="mt-12 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Press the arrow icon within each card to sync</p>
      </div>
    </div>
  )
}

export default StatChange