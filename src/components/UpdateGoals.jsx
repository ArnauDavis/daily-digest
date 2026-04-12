import React from 'react'
import { useRef } from 'react'

function UpdateGoals({goals, updateGoals}) {
    const checkboxRef = useRef(null) // To toggle dropdown form
    return (
        <>
        {/* Form to manage all goals */}
          <div className="mx-auto max-w-4xl px-6 my-16">
            <div className="collapse bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-sm transition-all duration-500 ease-in-out hover:shadow-md overflow-hidden">
              <input 
                id="target-settings-check"
                type="checkbox" 
                ref={checkboxRef} 
                className="peer" 
              /> 
              
              <label 
                htmlFor="target-settings-check"
                className="collapse-title p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform peer-checked:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold tracking-tight">Focus & Objectives</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-base-content/40 mt-1 font-bold">Calibration for your lifestyle</p>
                  </div>
                </div>
                
                {/* Visual toggle indicator instead of standard arrow */}
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full hidden sm:block">
                  Expand Settings
                </span>
              </label>
              
              <div className="collapse-content bg-base-200/20 px-8">
                <form 
                  className="py-10 space-y-12"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    updateGoals({
                      daily_goal_calories: Number(formData.get('daily_cals')),
                      daily_goal_protein: Number(formData.get('daily_protein')),
                      weekly_goal_calories: Number(formData.get('weekly_cals')),
                      weekly_goal_protein: Number(formData.get('weekly_protein'))
                    })
                    if (checkboxRef.current) checkboxRef.current.checked = false
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    
                    {/* Daily Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="h-0.5 w-6 bg-primary rounded-full"></div>
                         <h4 className="text-xs uppercase font-black tracking-widest text-base-content/60">The Daily Path</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-base-content/10 pb-2">
                          <label className="text-sm font-medium opacity-50 italic">Caloric Limit</label>
                          <div className="flex items-center gap-2">
                            <input name="daily_cals" type="number" defaultValue={goals?.daily_goal_calories} className="bg-transparent text-2xl font-serif w-24 text-right outline-none focus:text-primary transition-colors" />
                            <span className="text-[10px] uppercase opacity-20 font-bold">kcal</span>
                          </div>
                        </div>
                
                        <div className="flex justify-between items-end border-b border-base-content/10 pb-2">
                          <label className="text-sm font-medium opacity-50 italic">Protein Goal</label>
                          <div className="flex items-center gap-2">
                            <input name="daily_protein" type="number" defaultValue={goals?.daily_goal_protein} className="bg-transparent text-2xl font-serif w-24 text-right outline-none focus:text-secondary transition-colors" />
                            <span className="text-[10px] uppercase opacity-20 font-bold">grams</span>
                          </div>
                        </div>
                      </div>
                    </div>
                
                    {/* Weekly Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="h-0.5 w-6 bg-secondary rounded-full"></div>
                         <h4 className="text-xs uppercase font-black tracking-widest text-base-content/60">The Weekly Horizon</h4>
                      </div>
                
                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-base-content/10 pb-2">
                          <label className="text-sm font-medium opacity-50 italic">Caloric Limit</label>
                          <div className="flex items-center gap-2">
                            <input name="weekly_cals" type="number" defaultValue={goals?.weekly_goal_calories} className="bg-transparent text-2xl font-serif w-24 text-right outline-none focus:text-primary transition-colors" />
                            <span className="text-[10px] uppercase opacity-20 font-bold">kcal</span>
                          </div>
                        </div>
                
                        <div className="flex justify-between items-end border-b border-base-content/10 pb-2">
                          <label className="text-sm font-medium opacity-50 italic">Protein Goal</label>
                          <div className="flex items-center gap-2">
                            <input name="weekly_protein" type="number" defaultValue={goals?.weekly_goal_protein} className="bg-transparent text-2xl font-serif w-24 text-right outline-none focus:text-secondary transition-colors" />
                            <span className="text-[10px] uppercase opacity-20 font-bold">grams</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div className="flex justify-center pt-8">
                    <button type="submit" className="btn btn-primary rounded-full px-16 h-16 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg font-bold">
                      Commit Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
    )
}

export default UpdateGoals