import React from 'react'
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { supabase } from "../utils/supabaseClient.js"
import './App.css'
import Auth from "./components/Auth.jsx"
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import TotalStats from './components/TotalStats.jsx'
import StatChange from './components/StatChange.jsx'
import StatsHistory from "./components/StatsHistory.jsx"
import UpdateGoals from './components/UpdateGoals.jsx'

function App() {
  const [stats, setStats] = useState([])
  const [goals, setGoals] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [peeStat, setPeeStat] = useState([])
  const [waterStat, setWaterStat] = useState([])
  const [foodStat, setFoodStat] = useState([])

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      getStats()
      getPeeStats()
      getWaterStats()
      getFoodStats()
      getGoals()
    } else {
      setStats([]) // Clear stats on logout
      setPeeStat([])
      setWaterStat([])
      setFoodStat([])
      setGoals(null)
    }
  }, [session])

  async function getStats() {
    // Filter by the logged-in user's ID
    const { data, error } = await supabase
      .from("stats")
      .select()
      .eq('user_id', session.user.id) 
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setStats(data)
  }

  //getting pee, water, and food stats
  async function getPeeStats() {
    // Filter by the logged-in user's ID
    const { data, error } = await supabase
      .from("pee")
      .select()
      .eq('user_id', session.user.id) 
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setPeeStat(data)
  }

  async function getWaterStats() {
    // Filter by the logged-in user's ID
    const { data, error } = await supabase
      .from("water")
      .select()
      .eq('user_id', session.user.id) 
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setWaterStat(data)
  }

  async function getFoodStats() {
    // Filter by the logged-in user's ID
    const { data, error } = await supabase
      .from("food")
      .select()
      .eq('user_id', session.user.id) 
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setFoodStat(data)
  }
  

  async function getGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select()
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching goals:", error)
    } else {
      setGoals(data)
    }
  }
  // end of getting stats and goals


  // start of setting stats and goals
  async function addStat(newStat) {
    // Automatically attach the user's ID to the new record
    const statWithUser = { ...newStat, user_id: session.user.id }
    
    const { data, error } = await supabase
      .from("stats")
      .insert([statWithUser])
      .select()

    if (error) console.error("Error adding stat:", error)
    else setStats((prev) => [...prev, ...data])
  }

    async function addPeeStat(newStat) {
    // Automatically attach the user's ID to the new record
    const statWithUser = { ...newStat, user_id: session.user.id }
    
    const { data, error } = await supabase
      .from("pee")
      .insert([statWithUser])
      .select()

    if (error) console.error("Error adding stat:", error)
    else setPeeStat((prev) => [...prev, ...data])
  }

    async function addWaterStat(newStat) {
    // Automatically attach the user's ID to the new record
    const statWithUser = { ...newStat, user_id: session.user.id }
    
    const { data, error } = await supabase
      .from("water")
      .insert([statWithUser])
      .select()

    if (error) console.error("Error adding stat:", error)
    else setWaterStat((prev) => [...prev, ...data])
  }

    async function addFoodStat(newStat) {
    // Automatically attach the user's ID to the new record
    const statWithUser = { ...newStat, user_id: session.user.id }
    
    const { data, error } = await supabase
      .from("food")
      .insert([statWithUser])
      .select()

    if (error) console.error("Error adding stat:", error)
    else setFoodStat((prev) => [...prev, ...data])
  }

  async function updateStat(statId, newCalories, newProtein, newDate) {
    const { data, error } = await supabase
      .from('stats')
      .update({ calories: newCalories, protein: newProtein, created_at: newDate })
      .eq('id', statId)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error('Update failed:', error)
    else setStats(prev =>
        prev.map(stat => (stat.id === statId ? { ...stat, ...data[0] } : stat))
      )
  }

  async function updatePeeStat(statId, newPee, newDate) {
    const { data, error } = await supabase
      .from('pee')
      .update({ pee_amount: newPee, created_at: newDate })
      .eq('id', statId)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error('Update failed:', error)
    else setPeeStat(prev =>
        prev.map(stat => (stat.id === statId ? { ...stat, ...data[0] } : stat))
      )
  }

  async function updateWaterStat(statId, newWater, newDate) {
    const { data, error } = await supabase
      .from('water')
      .update({ water_amount: newWater, created_at: newDate })
      .eq('id', statId)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error('Update failed:', error)
    else setWaterStat(prev =>
        prev.map(stat => (stat.id === statId ? { ...stat, ...data[0] } : stat))
      )
  }

  async function updateFoodStat(statId, newFood, newDate) {
    const { data, error } = await supabase
      .from('water')
      .update({ food_amount: newFood, created_at: newDate })
      .eq('id', statId)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error('Update failed:', error)
    else setFoodStat(prev =>
        prev.map(stat => (stat.id === statId ? { ...stat, ...data[0] } : stat))
      )
  }

  async function updateGoals(goalUpdate) {
    // goalUpdate should look like { daily_goal_calories: 2500 }
    const { data, error } = await supabase
      .from("goals")
      .upsert({ 
        user_id: session.user.id, 
        ...goalUpdate 
      }, { onConflict: 'user_id' }) // Tells Supabase to update if user_id exists
      .select()
    
    if (error) {
      console.error("Error updating goals:", error)
    } else {
      setGoals(data[0])
    }
  }

  //end of updating stats and goals


  //start of deleting stats

  async function deleteStat(id) {
    const { data, error } = await supabase
      .from("stats")
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error(error)
    else setStats(stats.filter(stat => stat.id !== id))
  }

  async function deletePeeStat(id) {
    const { data, error } = await supabase
      .from("pee")
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error(error)
    else setPeeStat(peeStat.filter(stat => stat.id !== id))
  }

  async function deleteWaterStat(id) {
    const { data, error } = await supabase
      .from("water")
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error(error)
    else setWaterStat(waterStat.filter(stat => stat.id !== id))
  }

  async function deleteFoodStat(id) {
    const { data, error } = await supabase
      .from("food")
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Security check
      .select()

    if (error) console.error(error)
    else setFoodStat(foodStat.filter(stat => stat.id !== id))
  }

  function ScrollToTop() {
  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

  if (loading) return <div className="min-h-screen bg-base-100" /> // Simple loader

  return (
    <>
    <BrowserRouter>
    <ScrollToTop/>
      <Header session={session} />
        <div className="min-h-screen flex flex-col">
          {!session ? (
            <Auth />
          ) : (
            <>

              <main className="grow space-y-8 pb-20 mt-5 mx-1">
                <Routes>
                <Route path="/" element={
                  <>
                  <TotalStats stats={stats} goals={goals} updateGoals={updateGoals}/>
                  <StatChange addStat={addStat} />
                  <UpdateGoals goals={goals} updateGoals={updateGoals}/>
                  </>
                  } />
                <Route path="/addstats" element={<StatChange addStat={addStat} />} />
                <Route path="/stats" element={<StatsHistory stats={stats} updateStat={updateStat} deleteStat={deleteStat} />}/>
                </Routes>
              </main>
              
            </>
          )}
        </div>
      <Footer />
    </BrowserRouter>
    </>
    
    
  )
}

export default App
