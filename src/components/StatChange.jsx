import React, { useState, memo } from "react"
import { useStats } from "../context/StatsContext.jsx"

function StatChange() {
  const { addPeeStat, addWaterStat, addFoodStat } = useStats()

  // Local states for inputs
  const [peeAmount, setPeeAmount] = useState("")
  const [peeNote, setPeeNote] = useState("")
  const [waterAmount, setWaterAmount] = useState("")
  const [waterNote, setWaterNote] = useState("")
  const [foodItem, setFoodItem] = useState("")

  // Success states for visual feedback
  const [success, setSuccess] = useState({ pee: false, water: false, food: false })

  const triggerSuccess = (type) => {
    setSuccess(prev => ({ ...prev, [type]: true }))
    setTimeout(() => setSuccess(prev => ({ ...prev, [type]: false })), 2000)
  }

  const handlePeeSubmit = async (e) => {
    e.preventDefault()
    const val = parseFloat(peeAmount)
    if (isNaN(val) || val <= 0) return
    
    // Pass both amount and notes to context
    await addPeeStat({ 
      pee_amount: val, 
      pee_notes: peeNote 
    })
    
    setPeeAmount("")
    setPeeNote("") // Reset note field
    triggerSuccess('pee')
  }

  const handleWaterSubmit = async (e) => {
    e.preventDefault()
    const val = parseFloat(waterAmount)
    if (isNaN(val) || val <= 0) return
    await addWaterStat({ 
      water_amount: val,
      water_notes: waterNote
     })
    setWaterAmount("")
    setWaterNote("")
    triggerSuccess('water')
  }

  const handleFoodSubmit = async (e) => {
    e.preventDefault()
    if (!foodItem.trim()) return
    await addFoodStat({ food_amount: foodItem })
    setFoodItem("")
    triggerSuccess('food')
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col mb-12 ml-4">
        <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
          Entry No. {new Date().toLocaleDateString()}
        </span>
        <h2 className="text-5xl font-serif font-light text-base-content leading-tight">
          Body <span className="italic font-normal text-primary">Intelligence.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PEE CARD */}
        <form onSubmit={handlePeeSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-yellow-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-3 rounded-2xl transition-colors duration-500 ${success.pee ? 'bg-success text-white' : 'bg-yellow-500/10 text-yellow-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
              </svg>
            </div>
            <button type="submit" className={`btn btn-circle btn-sm transition-all duration-300 ${success.pee ? 'btn-success text-white scale-110' : 'btn-ghost'}`}>
              {success.pee ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            className="w-full bg-transparent text-5xl font-serif outline-none placeholder:text-base-content/5 mb-4"
            value={peeAmount}
            onChange={(e) => setPeeAmount(e.target.value)}
          />
          
          <p className="my-4 text-[10px] font-black opacity-40 uppercase tracking-widest">Pee (cc)</p>

          {/* Textarea for Notes */}
          <textarea 
            placeholder="Experience notes..."
            className="w-full bg-base-content/5 border-none rounded-2xl p-4 text-xs font-medium outline-none placeholder:opacity-20 resize-none h-20 transition-all focus:bg-base-content/10"
            value={peeNote}
            onChange={(e) => setPeeNote(e.target.value)}
          />

          
        </form>

        {/* WATER CARD */}
        <form onSubmit={handleWaterSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-blue-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-3 rounded-2xl transition-colors duration-500 ${success.water ? 'bg-success text-white' : 'bg-blue-500/10 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
              </svg>
            </div>
            <button type="submit" className={`btn btn-circle btn-sm transition-all duration-300 ${success.water ? 'btn-success text-white scale-110' : 'btn-ghost'}`}>
              {success.water ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
            
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            className="w-full bg-transparent text-5xl font-serif outline-none placeholder:text-base-content/5 mb-4" 
            value={waterAmount}
            onChange={(e) => setWaterAmount(e.target.value)}
          />

          <p className="my-4 text-[10px] font-black opacity-40 uppercase tracking-widest">Fluid (cc)</p>
            
          {/* Textarea for Notes */}
          <textarea 
            placeholder="What did you drink?"
            className="w-full bg-base-content/5 border-none rounded-2xl p-4 text-xs font-medium outline-none placeholder:opacity-20 resize-none h-20 transition-all focus:bg-base-content/10"
            value={waterNote}
            onChange={(e) => setWaterNote(e.target.value)}
          />
        </form>

        {/* FOOD CARD */}
        <form onSubmit={handleFoodSubmit} className="group relative bg-base-200/30 p-8 rounded-[3rem] border border-transparent hover:border-green-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-3 rounded-2xl transition-colors duration-500 ${success.food ? 'bg-success text-white' : 'bg-green-500/10 text-green-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <button type="submit" className={`btn btn-circle btn-sm transition-all duration-300 ${success.food ? 'btn-success text-white scale-110' : 'btn-ghost'}`}>
              {success.food ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Entry..."
            className="w-full bg-transparent text-3xl font-serif outline-none placeholder:text-base-content/5 h-20"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
          />
          <p className="mt-20 text-[10px] font-black opacity-40 uppercase tracking-widest">Food Journal</p>
        </form>

      </div>

      <div className="mt-12 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Press the arrow icon within each card to sync</p>
      </div>
    </div>
  )
}

export default memo(StatChange)