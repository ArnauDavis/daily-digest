import { supabase } from "../../utils/supabaseClient.js"

const apiRequest = async (query) => {
    const { data, error } = await query
    if (error) throw error
    return data
}

export const statsService = {
    // fetches everything in parallel for the initial load
    fetchAll: async (userId) => {
        const [pee, water, food, goals] = await Promise.all([
            supabase.from('pee').select().eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('water').select().eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('food').select().eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('goals').select().eq('user_id', userId).maybeSingle()
        ])

        // throw the first error found, if any
        if (pee.error) throw pee.error
        if (water.error) throw water.error
        if (food.error) throw food.error
        if (goals.error) throw goals.error

        return {
            pee: pee.data,
            water: water.data,
            food: food.data,
            goals: goals.data
        }
    },

    addStat: async (table, userId, payload) => {
        return apiRequest(
            supabase.from(table).insert([{ ...payload, user_id: userId }]).select()
        )
    },

    updateStat: async (table, userId, statId, payload) => {
        return apiRequest(
            supabase.from(table).update(payload).eq('id', statId).eq('user_id', userId).select()
        )
    },

    deleteStat: async (table, userId, statId) => {
        const { error } = await supabase.from(table).delete().eq('id', statId).eq('user_id', userId)
        if (error) throw error
        return true
    },

    // Special case for goals: Use upsert so it creates if missing, updates if exists
    updateGoals: async (userId, payload) => {
        return apiRequest(
            supabase.from('goals').upsert({ ...payload, user_id: userId }, { onConflict: 'user_id' }).select()
        )
    }
}