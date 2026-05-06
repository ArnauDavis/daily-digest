import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { statsService } from "../services/statsService.js"

const StatsContext = createContext()

export function StatsProvider({ children, session }) {
    const [peeStat, setPeeStat] = useState([])
    const [waterStat, setWaterStat] = useState([])
    const [foodStat, setFoodStat] = useState([])
    const [goals, setGoals] = useState(null)
    const [loading, setLoading] = useState(true)

    const userId = session?.user?.id

    const fetchAllData = useCallback(async () => {
        if (!userId) return
        setLoading(true)
        try {
            const data = await statsService.fetchAll(userId)
            setPeeStat(data.pee)
            setWaterStat(data.water)
            setFoodStat(data.food)
            setGoals(data.goals)
        } catch (err) {
            console.error("Failed to sync stats", err)
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            fetchAllData()
        } else {
            setPeeStat([])
            setWaterStat([])
            setFoodStat([])
            setGoals(null)
            setLoading(false)
        }
    }, [userId, fetchAllData])

    
    const handleAction = async (actionFn, stateSetter) => {
        try {
            const result = await actionFn()
            if (result) {
                // If it's an array (from insert/update), merge it. If it's a bool (delete), we handle that separately.
                if (Array.isArray(result)) {
                    stateSetter(prev => {
                        const newItem = result[0]
                        const exists = prev.find(item => item.id === newItem.id)
                        if (exists) {
                            return prev.map(item => item.id === newItem.id ? newItem : item)
                        }
                        return [newItem, ...prev]
                    })
                }
            }
            return result
        } catch (err) {
            alert("Action failed. Check console.")
            throw err
        }
    }

    const value = useMemo(() => ({
        peeStat, 
        waterStat, 
        foodStat, 
        goals, 
        loading,
        
        // Wrapped actions
        addPeeStat: (payload) => handleAction(() => statsService.addStat('pee', userId, payload), setPeeStat),
        addWaterStat: (payload) => handleAction(() => statsService.addStat('water', userId, payload), setWaterStat),
        addFoodStat: (payload) => handleAction(() => statsService.addStat('food', userId, payload), setFoodStat),
        
        updatePeeStat: (id, payload) => handleAction(() => statsService.updateStat('pee', userId, id, payload), setPeeStat),
        updateWaterStat: (id, payload) => handleAction(() => statsService.updateStat('water', userId, id, payload), setWaterStat),
        updateFoodStat: (id, payload) => handleAction(() => statsService.updateStat('food', userId, id, payload), setFoodStat),
        
        updateGoals: async (payload) => {
            const res = await statsService.addStat('goals', userId, payload) 
            setGoals(res[0])
        },

        deletePeeStat: async (id) => {
            await statsService.deleteStat('pee', userId, id)
            setPeeStat(prev => prev.filter(s => s.id !== id))
        },
        deleteWaterStat: async (id) => {
            await statsService.deleteStat('water', userId, id)
            setWaterStat(prev => prev.filter(s => s.id !== id))
        },
        deleteFoodStat: async (id) => {
            await statsService.deleteStat('food', userId, id)
            setFoodStat(prev => prev.filter(s => s.id !== id))
        },
        
        refreshData: fetchAllData
    }), [peeStat, waterStat, foodStat, goals, loading, userId, fetchAllData])

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => {
    const context = useContext(StatsContext)
    if (!context) throw new Error("useStats must be used within a StatsProvider")
    return context
}