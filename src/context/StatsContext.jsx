import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from "../../utils/supabaseClient.js"

const StatsContext = createContext()

export function StatsProvider({ children, session }) {
    const [peeStat, setPeeStat] = useState([])
    const [waterStat, setWaterStat] = useState([])
    const [foodStat, setFoodStat] = useState([])
    const [goals, setGoals] = useState(null)

    const userId = session?.user?.id

    // --- GETTERS ---

    const getPeeStats = useCallback(async () => {
        if (!userId) return
        const { data, error } = await supabase
            .from("pee")
            .select()
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching pee stats:", error)
        else setPeeStat(data)
    }, [userId])

    const getWaterStats = useCallback(async () => {
        if (!userId) return
        const { data, error } = await supabase
            .from("water")
            .select()
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching water stats:", error)
        else setWaterStat(data)
    }, [userId])

    const getFoodStats = useCallback(async () => {
        if (!userId) return
        const { data, error } = await supabase
            .from("food")
            .select()
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching food stats:", error)
        else setFoodStat(data)
    }, [userId])

    const getGoals = useCallback(async () => {
        if (!userId) return
        const { data, error } = await supabase
            .from("goals")
            .select()
            .eq('user_id', userId)
            .maybeSingle()
        if (error) console.error("Error fetching goals:", error)
        else setGoals(data)
    }, [userId])

    const fetchAllData = useCallback(() => {
        return Promise.all([
            getPeeStats(),
            getWaterStats(),
            getFoodStats(),
            getGoals()
        ])
    }, [getPeeStats, getWaterStats, getFoodStats, getGoals])

    // Sync data based on session
    useEffect(() => {
        if (userId) {
            fetchAllData()
        } else {
            setPeeStat([])
            setWaterStat([])
            setFoodStat([])
            setGoals(null)
        }
    }, [userId, fetchAllData])

    // --- ADDERS ---

    const addPeeStat = useCallback(async (newStat) => {
        if (!userId) return
        const { data, error } = await supabase
            .from("pee")
            .insert([{ ...newStat, user_id: userId }])
            .select()
        if (error) console.error("Error adding pee stat:", error)
        else setPeeStat((prev) => [...data, ...prev])
    }, [userId])

    const addWaterStat = useCallback(async (newStat) => {
        if (!userId) return
        const { data, error } = await supabase
            .from("water")
            .insert([{ ...newStat, user_id: userId }])
            .select()
        if (error) console.error("Error adding water stat:", error)
        else setWaterStat((prev) => [...data, ...prev])
    }, [userId])

    const addFoodStat = useCallback(async (newStat) => {
        if (!userId) return
        const { data, error } = await supabase
            .from("food")
            .insert([{ ...newStat, user_id: userId }])
            .select()
        if (error) console.error("Error adding food stat:", error)
        else setFoodStat((prev) => [...data, ...prev])
    }, [userId])

    // --- UPDATERS ---

    const updatePeeStat = useCallback(async (statId, newPee, newDate, newNotes) => {
        if (!userId) return
        const { data, error } = await supabase
            .from('pee')
            .update({ 
              pee_amount: newPee, 
              created_at: newDate,
              pee_notes: newNotes 
            })
            .eq('id', statId)
            .eq('user_id', userId)
            .select()

        if (error) {
          console.error('Update failed:', error)
        } else {
          setPeeStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
        }
    }, [userId])

    const updateWaterStat = useCallback(async (statId, newWater, newDate) => {
        if (!userId) return
        const { data, error } = await supabase
            .from('water')
            .update({ water_amount: newWater, created_at: newDate })
            .eq('id', statId)
            .eq('user_id', userId)
            .select()
        if (error) console.error('Update failed:', error)
        else setWaterStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
    }, [userId])

    const updateFoodStat = useCallback(async (statId, newFood, newDate) => {
        if (!userId) return
        const { data, error } = await supabase
            .from('food')
            .update({ food_amount: newFood, created_at: newDate })
            .eq('id', statId)
            .eq('user_id', userId)
            .select()
        if (error) console.error('Update failed:', error)
        else setFoodStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
    }, [userId])

    const updateGoals = useCallback(async (goalUpdate) => {
        if (!userId) return
        const { data, error } = await supabase
            .from("goals")
            .upsert({ user_id: userId, ...goalUpdate }, { onConflict: 'user_id' })
            .select()
        if (error) console.error("Error updating goals:", error)
        else setGoals(data[0])
    }, [userId])

    // --- DELETERS ---

    const deletePeeStat = useCallback(async (id) => {
        if (!userId) return
        const { error } = await supabase.from("pee").delete().eq('id', id).eq('user_id', userId)
        if (error) console.error(error)
        else setPeeStat(prev => prev.filter(s => s.id !== id))
    }, [userId])

    const deleteWaterStat = useCallback(async (id) => {
        if (!userId) return
        const { error } = await supabase.from("water").delete().eq('id', id).eq('user_id', userId)
        if (error) console.error(error)
        else setWaterStat(prev => prev.filter(s => s.id !== id))
    }, [userId])

    const deleteFoodStat = useCallback(async (id) => {
        if (!userId) return
        const { error } = await supabase.from("food").delete().eq('id', id).eq('user_id', userId)
        if (error) console.error(error)
        else setFoodStat(prev => prev.filter(s => s.id !== id))
    }, [userId])

    const value = useMemo(() => ({
        peeStat, waterStat, foodStat, goals,
        addPeeStat, addWaterStat, addFoodStat,
        updatePeeStat, updateWaterStat, updateFoodStat, updateGoals,
        deletePeeStat, deleteWaterStat, deleteFoodStat,
        refreshData: fetchAllData
    }), [
        peeStat, waterStat, foodStat, goals,
        addPeeStat, addWaterStat, addFoodStat,
        updatePeeStat, updateWaterStat, updateFoodStat, updateGoals,
        deletePeeStat, deleteWaterStat, deleteFoodStat,
        fetchAllData
    ])

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => {
    const context = useContext(StatsContext)
    if (!context) throw new Error("useStats must be used within a StatsProvider")
    return context
}