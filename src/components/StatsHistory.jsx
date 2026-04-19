import React, { useState, useMemo, memo } from 'react'
import { useStats } from '../context/StatsContext.jsx'

// Helper to format date for the datetime-local input
const formatForInput = (timestamp) => {
  if (!timestamp) return ""
  const d = new Date(timestamp)
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

// Memoized Individual Row
const LogRow = memo(({ item, valKey, unit, color, isString, onEdit, onDelete }) => {
  const dateObj = new Date(item.created_at)
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })

  const isNetRow = !onEdit && !onDelete

  // negative detection logic
  const value = item[valKey]
  const numericValue = parseFloat(value)
  const isNegative = !isString && numericValue < 0
  const displayColor = isNegative ? "text-error" : color

  return (
    <tr className="hover:bg-base-200/30 border-b border-base-content/5 last:border-none transition-all">
      <td className="py-4 pl-8">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold">{isNetRow ? 'Daily' : timeStr}</span>
          <span className="text-[8px] opacity-30 uppercase font-black">{dateStr}</span>
        </div>
      </td>
      <td className="text-center">
        <span className={`font-serif ${isString ? 'text-xs italic' : 'text-lg'} font-medium ${displayColor}`}>
          {value} <span className="text-[10px] opacity-30 ml-1">{unit}</span>
        </span>
      </td>
      <td className="pr-8 text-right space-x-2">
        {onEdit && (
          <button onClick={() => onEdit(item)} className="btn btn-ghost btn-circle btn-xs opacity-40 hover:opacity-100">✎</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(item.id)} className="btn btn-ghost btn-circle btn-xs opacity-40 hover:opacity-100 hover:text-error">✕</button>
        )}
        {isNetRow && (
          <span className="text-[10px] opacity-20 font-black uppercase tracking-tighter italic">Net Balance</span>
        )}
      </td>
    </tr>
  )
})

function LogSection({ title, subtitle, data, valKey, unit, color, onEdit, onDelete, isString }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { currentItems, totalPages } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage)
    const items = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    return { currentItems: items, totalPages: total }
  }, [data, currentPage])

  return (
    <div className="bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-8 flex items-center justify-between bg-base-200/20 border-b border-base-content/5 cursor-pointer hover:bg-base-200/40 transition-colors"
      >
        <div>
          <h3 className="text-xl font-serif font-semibold flex items-center gap-3">
            {title}
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
          {data.length} {data.length === 1 ? 'Entry' : 'Total'}
        </div>
      </div>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/30 text-[9px] uppercase tracking-widest opacity-40">
                  <th className="py-4 pl-8">Date</th>
                  <th className="text-center">Record</th>
                  <th className="pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <LogRow 
                    key={item.id} 
                    item={item} 
                    valKey={valKey} 
                    unit={unit} 
                    color={color} 
                    isString={isString} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 flex items-center justify-between bg-base-200/10 border-t border-base-content/5 px-8">
              <button 
                disabled={currentPage === 1} 
                onClick={(e) => { e.stopPropagation(); setCurrentPage(p => p - 1) }} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-10"
              >
                Prev
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Page {currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={(e) => { e.stopPropagation(); setCurrentPage(p => p + 1) }} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-10"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatsHistory() {
  const { 
    peeStat, waterStat, foodStat, 
    updatePeeStat, updateWaterStat, updateFoodStat, 
    deletePeeStat, deleteWaterStat, deleteFoodStat 
  } = useStats()

  const [editingItem, setEditingItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [activeType, setActiveType] = useState("") 
  const [tempValue, setTempValue] = useState("")
  const [tempDate, setTempDate] = useState("")

  // --- HYDRATION BALANCE CALCULATION ---
  const netFluidData = useMemo(() => {
    const totals = {};

    waterStat.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString();
      totals[date] = (totals[date] || 0) + parseFloat(entry.water_amount || 0);
    });

    peeStat.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString();
      totals[date] = (totals[date] || 0) - parseFloat(entry.pee_amount || 0);
    });

    return Object.entries(totals)
      .map(([date, net]) => ({
        id: `net-${date}`, 
        created_at: date, 
        net_amount: net > 0 ? `+${net.toFixed(1)}` : net.toFixed(1)
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [peeStat, waterStat]);

  const handleEditOpen = (item, type) => {
    setActiveType(type)
    setEditingItem(item)
    setTempDate(formatForInput(item.created_at))
    setTempValue(type === "pee" ? item.pee_amount : type === "water" ? item.water_amount : item.food_amount)
    document.getElementById('edit_modal').showModal()
  }

  const handleSave = async () => {
    const isoDate = new Date(tempDate).toISOString()
    if (activeType === "pee") await updatePeeStat(editingItem.id, tempValue, isoDate)
    else if (activeType === "water") await updateWaterStat(editingItem.id, tempValue, isoDate)
    else if (activeType === "food") await updateFoodStat(editingItem.id, tempValue, isoDate)
    document.getElementById('edit_modal').close()
  }

  const handleDeleteOpen = (id, type) => {
    setDeletingId(id)
    setActiveType(type)
    document.getElementById('delete_confirm_modal').showModal()
  }

  const handleConfirmDelete = async () => {
    if (activeType === "pee") await deletePeeStat(deletingId)
    else if (activeType === "water") await deleteWaterStat(deletingId)
    else if (activeType === "food") await deleteFoodStat(deletingId)
    document.getElementById('delete_confirm_modal').close()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      <div className="flex flex-col mb-12 ml-4">
        <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
          Historical Data
        </span>
        <h2 className="text-5xl font-serif font-light text-base-content leading-tight">
          Pattern <span className="italic font-normal text-primary">Recognition.</span>
        </h2>
      </div>

      {/* Net Balance (Calculated) */}
      <LogSection 
        title="Hydration Balance" 
        subtitle="Daily Net Differential (In vs Out)" 
        data={netFluidData} 
        valKey="net_amount" 
        unit="oz" 
        color="text-primary font-bold italic" 
        onEdit={null} 
        onDelete={null} 
      />

      <LogSection 
        title="Pee Logs" subtitle="Output Tracking" data={peeStat} valKey="pee_amount" 
        unit="oz" color="text-yellow-500" 
        onEdit={(item) => handleEditOpen(item, "pee")}
        onDelete={(id) => handleDeleteOpen(id, "pee")}
      />

      <LogSection 
        title="Water Intake" subtitle="Hydration Log" data={waterStat} valKey="water_amount" 
        unit="oz" color="text-blue-500" 
        onEdit={(item) => handleEditOpen(item, "water")}
        onDelete={(id) => handleDeleteOpen(id, "water")}
      />

      <LogSection 
        title="Food Journal" subtitle="Nutrition Entry" data={foodStat} valKey="food_amount" 
        unit="" color="text-success" isString={true}
        onEdit={(item) => handleEditOpen(item, "food")}
        onDelete={(id) => handleDeleteOpen(id, "food")}
      />

      {/* Edit Modal */}
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

      {/* Delete Confirmation Modal */}
      <dialog id="delete_confirm_modal" className="modal backdrop-blur-md">
        <div className="modal-box border border-error/10 bg-base-100 p-10 rounded-[2.5rem] shadow-2xl max-sm text-center">
          <h3 className="font-serif text-2xl font-semibold mb-2">Erase Record?</h3>
          <div className="flex flex-col gap-3">
            <button className="btn btn-error w-full rounded-2xl text-white uppercase text-[10px] font-black h-14" onClick={handleConfirmDelete}>Yes, Erase Entry</button>
            <form method="dialog"><button className="btn btn-ghost w-full rounded-2xl uppercase text-[10px] font-black opacity-40">Go Back</button></form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default StatsHistory