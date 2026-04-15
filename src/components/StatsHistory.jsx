import React from 'react'
import { useEffect, useState } from "react"

function StatsHistory({stats, deleteStat, updateStat}) {
    const [editingStat, setEditingStat] = useState(null)
    const [tempCalories, setTempCalories] = useState("")
    const [tempProtein, setTempProtein] = useState("")
    const [tempDate, setTempDate] = useState("")
    const [sortOrder, setSortOrder] = useState("desc")
    const [deletingStat, setDeletingStat] = useState(null)

    // Helper to convert DB timestamp to 'YYYY-MM-DDTHH:mm' for the input
  const formatForInput = (timestamp) => {
    if (!timestamp) return ""
    const d = new Date(timestamp)
    // Adjust for timezone offset to get local time string
    const offset = d.getTimezoneOffset() * 60000
    const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16)
    return localISOTime
  }


    const handleEditClick = (stat) => {
    setEditingStat(stat)
    setTempCalories(stat.calories)
    setTempProtein(stat.protein)
    setTempDate(formatForInput(stat.created_at))
    // Open the modal using DaisyUI/HTML5 dialog API
    document.getElementById('edit_modal').showModal()
  }

    const handleSave = async () => {
        await updateStat(editingStat.id, tempCalories, tempProtein, new Date(tempDate).toISOString())
        setEditingStat(null)
        document.getElementById('edit_modal').close()
      }

    const prepDelete = (stat) => {
      setDeletingStat(stat);
      document.getElementById('delete_confirm_modal').showModal();
    }

    const confirmDelete = async () => {
      if (deletingStat) {
        await deleteStat(deletingStat.id);
        setDeletingStat(null);
        document.getElementById('delete_confirm_modal').close();
      }
    }
    

    const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    
    const d = new Date(timestamp)
    
    // Format the time: "8:07pm"
    const time = d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    }).toLowerCase().replace(' ', '')
    
    // Format the date: "3/21/26"
    const date = d.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit' 
    })

    return `${time} ${date}`
  }

  const sortedStats = stats.toSorted((a, b) => {
  const dateA = new Date(a.created_at)
  const dateB = new Date(b.created_at)
  return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })
  
  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc")
  }

 const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

// Calculate indexes
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = sortedStats.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(sortedStats.length / itemsPerPage);

const paginateNext = () => {
  if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
};

const paginatePrev = () => {
  if (currentPage > 1) setCurrentPage(prev => prev - 1);
};

  return (
    <>
      {/* --- ARCHIVES & CHRONICLE SECTION --- */}
      <div className="w-full max-w-5xl mx-auto my-12 px-2 sm:px-4">
        <div className="collapse bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-sm transition-all duration-500 ease-in-out hover:shadow-md overflow-hidden">
          <input type="checkbox" className="peer" id="chronicle-toggle" />

          <label 
            htmlFor="chronicle-toggle" 
            className="collapse-title p-6 sm:p-8 flex flex-row items-center justify-between gap-2 cursor-pointer min-h-[100px]"
          >
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 transition-transform peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-serif font-semibold tracking-tight truncate">Chronicle</h3>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-base-content/40 mt-1 font-bold">Data Logs</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center justify-center bg-base-200/50 px-3 py-1.5 rounded-full border border-base-content/5">
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest opacity-40">
                  {sortedStats.length} Total
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-secondary/10">
                Archives
              </span>
            </div>
          </label>

          <div className="collapse-content px-0">
            <div className="overflow-x-auto border-t border-base-content/5">
              <table className="table w-full border-separate border-spacing-y-0 table-fixed sm:table-auto">
                <thead className="bg-base-200/50">
                  <tr className="border-none">
                    <th 
                      className="py-5 px-4 sm:px-8 font-black uppercase tracking-widest text-[9px] sm:text-[10px] opacity-40 cursor-pointer hover:text-primary transition-colors select-none w-[40%] sm:w-auto"
                      onClick={(e) => { e.stopPropagation(); toggleSort(); }}
                    >
                      <div className="flex items-center gap-2">
                        Time
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform duration-500 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                          <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                    <th className="font-black uppercase tracking-widest text-[9px] sm:text-[10px] opacity-40 text-center">Fuel</th>
                    <th className="font-black uppercase tracking-widest text-[9px] sm:text-[10px] opacity-40 text-center">Build</th>
                    <th className="px-4 sm:px-8 w-24"></th>
                  </tr>
                </thead>

                <tbody className="text-base-content/80">
                  {currentItems.map((stat) => (
                    <tr key={stat.id} className="hover:bg-base-200/30 transition-all duration-300 border-b border-base-content/5 last:border-none">
                      <td className="py-4 px-4 sm:px-8">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs sm:text-sm font-bold text-base-content">
                            {new Date(stat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[8px] sm:text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                            {new Date(stat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col">
                          <span className="font-serif text-sm sm:text-lg text-primary font-medium">{stat.calories}</span>
                          <span className="text-[8px] uppercase font-black opacity-20">kcal</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col">
                          <span className="font-serif text-sm sm:text-lg text-secondary font-medium">{stat.protein}</span>
                          <span className="text-[8px] uppercase font-black opacity-20">g</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-8 text-right">
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-1 sm:gap-2 opacity-80">
                          <button 
                            className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => { e.stopPropagation(); handleEditClick(stat); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button 
                            className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-error/10 hover:text-error"
                            onClick={(e) => { e.stopPropagation(); prepDelete(stat); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                
              {/* --- IN-PLACE SCROLL CONTROLS --- */}
              <div className="py-6 border-t border-base-content/5 flex items-center justify-between px-8 bg-base-200/10">
                <button 
                  onClick={paginatePrev}
                  disabled={currentPage === 1}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 hover:text-secondary disabled:opacity-10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span>Prev</span>
                </button>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
                    Page {currentPage} / {totalPages || 1}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all ${currentPage === i + 1 ? 'w-4 bg-secondary' : 'w-1 bg-base-content/10'}`}
                      />
                    ))}
                  </div>
                </div>
                  
                <button 
                  onClick={paginateNext}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 hover:text-secondary disabled:opacity-10 transition-all"
                >
                  <span>Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
              
              
        {/* --- MODAL: EDIT ENTRY --- */}
        <dialog id="edit_modal" className="modal backdrop-blur-md">
          <div className="modal-box bg-base-100 border border-base-content/10 p-10 rounded-[2.5rem] shadow-2xl max-w-md">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-semibold italic">Refine Entry</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-2">Updating your health record</p>
            </div>
              
            <div className="space-y-6">
              <div className="form-control">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-2 ml-2">Timeline Adjustment</label>
                <input 
                  type="datetime-local" 
                  className="input bg-base-200/50 border-none rounded-2xl h-14 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  value={tempDate} 
                  onChange={(e) => setTempDate(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-2 ml-2 text-primary">Fuel (kcal)</label>
                  <input 
                    type="number" 
                    className="input bg-base-200/50 border-none rounded-2xl h-14 text-xl font-serif focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    value={tempCalories} 
                    onChange={(e) => setTempCalories(e.target.value)} 
                  />
                </div>
              
                <div className="form-control">
                  <label className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-2 ml-2 text-secondary">Build (g)</label>
                  <input 
                    type="number" 
                    className="input bg-base-200/50 border-none rounded-2xl h-14 text-xl font-serif focus:ring-2 focus:ring-secondary/20 outline-none transition-all" 
                    value={tempProtein} 
                    onChange={(e) => setTempProtein(e.target.value)} 
                  />
                </div>
              </div>
            </div>
              
            <div className="modal-action mt-10 grid grid-cols-2 gap-4">
              <form method="dialog" className="w-full">
                <button className="btn btn-ghost w-full rounded-2xl border-base-content/5 uppercase text-[10px] font-black tracking-widest hover:bg-base-200">Discard</button>
              </form>
              <button 
                className="btn btn-primary w-full rounded-2xl shadow-lg shadow-primary/20 uppercase text-[10px] font-black tracking-widest h-12" 
                onClick={handleSave}
              >
                Commit
              </button>
            </div>
          </div>
        </dialog>
              
        {/* --- MODAL: DELETE CONFIRMATION --- */}
        <dialog id="delete_confirm_modal" className="modal backdrop-blur-md">
          <div className="modal-box border border-error/10 bg-base-100 p-10 rounded-[2.5rem] shadow-2xl max-w-sm text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
              
            <h3 className="font-serif text-2xl font-semibold mb-2">Remove Record?</h3>
            <p className="text-sm text-base-content/50 leading-relaxed mb-8">
              This entry from <span className="font-bold text-base-content">{deletingStat ? new Date(deletingStat.created_at).toLocaleDateString() : ''}</span> will be permanently erased.
            </p>
              
            <div className="flex flex-col gap-3">
              <button 
                className="btn btn-error w-full rounded-2xl text-white uppercase text-[10px] font-black tracking-widest h-14" 
                onClick={confirmDelete}
              >
                Yes, Erase Entry
              </button>
              <form method="dialog">
                <button className="btn btn-ghost w-full rounded-2xl uppercase text-[10px] font-black tracking-widest opacity-40 hover:opacity-100">
                  Go Back
                </button>
              </form>
            </div>
          </div>
        </dialog>
    
    </>
  )
}

export default StatsHistory