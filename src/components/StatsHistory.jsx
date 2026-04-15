import React, { useState } from 'react'
import { useStats } from '../context/StatsContext.jsx'

function StatsHistory() {
  const { 
    peeStat, waterStat, foodStat, 
    updatePeeStat, updateWaterStat, updateFoodStat, 
    deletePeeStat, deleteWaterStat, deleteFoodStat 
  } = useStats()

  // --- MODAL STATES ---
  const [editingItem, setEditingItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [activeType, setActiveType] = useState("") // "pee", "water", or "food"
  
  // --- TEMP STATES FOR EDITING ---
  const [tempValue, setTempValue] = useState("")
  const [tempDate, setTempDate] = useState("")

  // --- HELPERS ---
  const formatForInput = (timestamp) => {
    if (!timestamp) return ""
    const d = new Date(timestamp)
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 16)
  }

  // --- HANDLERS: EDIT ---
  const handleEditOpen = (item, type) => {
    setActiveType(type)
    setEditingItem(item)
    setTempDate(formatForInput(item.created_at))
    
    if (type === "pee") setTempValue(item.pee_amount)
    if (type === "water") setTempValue(item.water_amount)
    if (type === "food") setTempValue(item.food_amount)

    document.getElementById('edit_modal').showModal()
  }

  const handleSave = async () => {
    const isoDate = new Date(tempDate).toISOString()
    
    if (activeType === "pee") await updatePeeStat(editingItem.id, tempValue, isoDate)
    if (activeType === "water") await updateWaterStat(editingItem.id, tempValue, isoDate)
    if (activeType === "food") await updateFoodStat(editingItem.id, tempValue, isoDate)

    document.getElementById('edit_modal').close()
  }

  // --- HANDLERS: DELETE ---
  const handleDeleteOpen = (id, type) => {
    setDeletingId(id)
    setActiveType(type)
    document.getElementById('delete_confirm_modal').showModal()
  }

  const handleConfirmDelete = async () => {
    if (activeType === "pee") await deletePeeStat(deletingId)
    if (activeType === "water") await deleteWaterStat(deletingId)
    if (activeType === "food") await deleteFoodStat(deletingId)
    
    document.getElementById('delete_confirm_modal').close()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">
      
      <LogSection 
        title="Pee Logs" subtitle="Output" data={peeStat} valKey="pee_amount" 
        unit="oz" color="text-yellow-500" 
        onEdit={(item) => handleEditOpen(item, "pee")}
        onDelete={(id) => handleDeleteOpen(id, "pee")}
      />

      <LogSection 
        title="Water Intake" subtitle="Hydration" data={waterStat} valKey="water_amount" 
        unit="oz" color="text-blue-500" 
        onEdit={(item) => handleEditOpen(item, "water")}
        onDelete={(id) => handleDeleteOpen(id, "water")}
      />

      <LogSection 
        title="Food Journal" subtitle="Inputs" data={foodStat} valKey="food_amount" 
        unit="" color="text-success" isString={true}
        onEdit={(item) => handleEditOpen(item, "food")}
        onDelete={(id) => handleDeleteOpen(id, "food")}
      />

      {/* --- EDIT MODAL --- */}
      <dialog id="edit_modal" className="modal backdrop-blur-md">
        <div className="modal-box bg-base-100 border border-base-content/10 p-10 rounded-[2.5rem] shadow-2xl max-w-md">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-semibold italic">Refine Entry</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Editing {activeType}</p>
          </div>
          <div className="space-y-6">
            <div className="form-control">
              <label className="text-[10px] uppercase font-black opacity-30 mb-2 ml-2">Time</label>
              <input type="datetime-local" className="input bg-base-200/50 border-none rounded-2xl h-14" 
                value={tempDate} onChange={(e) => setTempDate(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="text-[10px] uppercase font-black opacity-30 mb-2 ml-2">Record</label>
              <input type={activeType === "food" ? "text" : "number"} className="input bg-base-200/50 border-none rounded-2xl h-14" 
                value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
            </div>
          </div>
          <div className="modal-action mt-10 grid grid-cols-2 gap-4">
            <form method="dialog"><button className="btn btn-ghost w-full rounded-2xl uppercase text-[10px] font-black">Discard</button></form>
            <button className="btn btn-primary w-full rounded-2xl uppercase text-[10px] font-black" onClick={handleSave}>Commit</button>
          </div>
        </div>
      </dialog>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <dialog id="delete_confirm_modal" className="modal backdrop-blur-md">
        <div className="modal-box border border-error/10 bg-base-100 p-10 rounded-[2.5rem] shadow-2xl max-w-sm text-center">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-semibold mb-2">Erase Record?</h3>
          <p className="text-sm text-base-content/50 leading-relaxed mb-8">This action cannot be undone. Permanent removal from {activeType} log.</p>
          <div className="flex flex-col gap-3">
            <button className="btn btn-error w-full rounded-2xl text-white uppercase text-[10px] font-black tracking-widest h-14" onClick={handleConfirmDelete}>Yes, Erase Entry</button>
            <form method="dialog"><button className="btn btn-ghost w-full rounded-2xl uppercase text-[10px] font-black opacity-40">Go Back</button></form>
          </div>
        </div>
      </dialog>

    </div>
  )
}

function LogSection({ title, subtitle, data, valKey, unit, color, onEdit, onDelete, isString }) {
  //state to track if the section is open or closed
  const [isOpen, setIsOpen] = useState(false) 
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 5
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300">
      
      {/* make the header clickable */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-8 flex items-center justify-between bg-base-200/20 border-b border-base-content/5 cursor-pointer hover:bg-base-200/40 transition-colors"
      >
        <div>
          <h3 className="text-xl font-serif font-semibold flex items-center gap-3">
            {title}
            {/* animated arrow indicator */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-base-content/40 font-bold">{subtitle}</p>
        </div>
        <div className="badge badge-ghost p-4 font-black text-[10px] opacity-40 uppercase tracking-widest">
          {data.length} Total
        </div>
      </div>

      {/* Wrap the table and pagination in a conditional render */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/30 text-[9px] uppercase tracking-widest opacity-40">
                  <th className="py-4 pl-8">Time</th>
                  <th className="text-center">Log</th>
                  <th className="pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-base-200/30 border-b border-base-content/5 last:border-none transition-all">
                    <td className="py-4 pl-8">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-[8px] opacity-30 uppercase font-black">{new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`font-serif ${isString ? 'text-xs italic' : 'text-lg'} font-medium ${color}`}>
                        {item[valKey]} <span className="text-[10px] opacity-30 ml-1">{unit}</span>
                      </span>
                    </td>
                    <td className="pr-8 text-right space-x-2">
                      <button onClick={() => onEdit(item)} className="btn btn-ghost btn-circle btn-xs opacity-40 hover:opacity-100">✎</button>
                      <button onClick={() => onDelete(item.id)} className="btn btn-ghost btn-circle btn-xs opacity-40 hover:opacity-100 hover:text-error">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 flex items-center justify-between bg-base-200/10 border-t border-base-content/5 px-8">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-[10px] font-black uppercase tracking-widest disabled:opacity-10">Prev</button>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Page {currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="text-[10px] font-black uppercase tracking-widest disabled:opacity-10">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StatsHistory