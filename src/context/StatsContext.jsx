import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from "../../utils/supabaseClient.js"

const StatsContext = createContext()

export function StatsProvider({ children, session }) {
    const [peeStat, setPeeStat] = useState([])
    const [waterStat, setWaterStat] = useState([])
    const [foodStat, setFoodStat] = useState([])
    const [goals, setGoals] = useState(null)

    // Automatically sync data based on session status
    useEffect(() => {
        if (session) {
            fetchAllData()
        } else {
            // Clear all state when user logs out
            setPeeStat([])
            setWaterStat([])
            setFoodStat([])
            setGoals(null)
        }
    }, [session])

    const fetchAllData = () => {
        getPeeStats()
        getWaterStats()
        getFoodStats()
        getGoals()
    };

    // --- GETTERS ---

    async function getPeeStats() {
        const { data, error } = await supabase
            .from("pee")
            .select()
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching pee stats:", error)
        else setPeeStat(data)
    }

    async function getWaterStats() {
        const { data, error } = await supabase
            .from("water")
            .select()
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching water stats:", error)
        else setWaterStat(data)
    }

    async function getFoodStats() {
        const { data, error } = await supabase
            .from("food")
            .select()
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
        if (error) console.error("Error fetching food stats:", error)
        else setFoodStat(data)
    }

    async function getGoals() {
        const { data, error } = await supabase
            .from("goals")
            .select()
            .eq('user_id', session.user.id)
            .maybeSingle()
        if (error) console.error("Error fetching goals:", error)
        else setGoals(data)
    }

    // --- ADDERS ---

    async function addPeeStat(newStat) {
        const { data, error } = await supabase
            .from("pee")
            .insert([{ ...newStat, user_id: session.user.id }])
            .select()
        if (error) console.error("Error adding pee stat:", error)
        else setPeeStat((prev) => [...data, ...prev])
    }

    async function addWaterStat(newStat) {
        const { data, error } = await supabase
            .from("water")
            .insert([{ ...newStat, user_id: session.user.id }])
            .select()
        if (error) console.error("Error adding water stat:", error)
        else setWaterStat((prev) => [...data, ...prev])
    }

    async function addFoodStat(newStat) {
        const { data, error } = await supabase
            .from("food")
            .insert([{ ...newStat, user_id: session.user.id }])
            .select()
        if (error) console.error("Error adding food stat:", error)
        else setFoodStat((prev) => [...data, ...prev])
    }

    // --- UPDATERS ---

    async function updatePeeStat(statId, newPee, newDate) {
        const { data, error } = await supabase
            .from('pee')
            .update({ pee_amount: newPee, created_at: newDate })
            .eq('id', statId)
            .eq('user_id', session.user.id)
            .select()
        if (error) console.error('Update failed:', error)
        else setPeeStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
    }

    async function updateWaterStat(statId, newWater, newDate) {
        const { data, error } = await supabase
            .from('water')
            .update({ water_amount: newWater, created_at: newDate })
            .eq('id', statId)
            .eq('user_id', session.user.id)
            .select()
        if (error) console.error('Update failed:', error)
        else setWaterStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
    }

    async function updateFoodStat(statId, newFood, newDate) {
        const { data, error } = await supabase
            .from('food')
            .update({ food_amount: newFood, created_at: newDate })
            .eq('id', statId)
            .eq('user_id', session.user.id)
            .select()
        if (error) console.error('Update failed:', error)
        else setFoodStat(prev => prev.map(s => (s.id === statId ? { ...s, ...data[0] } : s)))
    }

    async function updateGoals(goalUpdate) {
        const { data, error } = await supabase
            .from("goals")
            .upsert({ user_id: session.user.id, ...goalUpdate }, { onConflict: 'user_id' })
            .select()
        if (error) console.error("Error updating goals:", error)
        else setGoals(data[0])
    }

    // --- DELETERS ---

    async function deletePeeStat(id) {
        const { error } = await supabase.from("pee").delete().eq('id', id).eq('user_id', session.user.id);
        if (error) console.error(error);
        else setPeeStat(prev => prev.filter(s => s.id !== id));
    }

    async function deleteWaterStat(id) {
        const { error } = await supabase.from("water").delete().eq('id', id).eq('user_id', session.user.id);
        if (error) console.error(error);
        else setWaterStat(prev => prev.filter(s => s.id !== id));
    }

    async function deleteFoodStat(id) {
        const { error } = await supabase.from("food").delete().eq('id', id).eq('user_id', session.user.id);
        if (error) console.error(error);
        else setFoodStat(prev => prev.filter(s => s.id !== id));
    }

    const value = {
        peeStat, waterStat, foodStat, goals,
        addPeeStat, addWaterStat, addFoodStat,
        updatePeeStat, updateWaterStat, updateFoodStat, updateGoals,
        deletePeeStat, deleteWaterStat, deleteFoodStat,
        refreshData: fetchAllData
    };

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => {
    const context = useContext(StatsContext)
    if (!context) throw new Error("useStats must be used within a StatsProvider")
    return context
}; 