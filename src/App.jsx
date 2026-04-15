import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { supabase } from "../utils/supabaseClient.js"
import { StatsProvider } from "./context/StatsContext.jsx"
import './App.css'

import Auth from "./components/Auth.jsx"
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import TotalStats from './components/TotalStats.jsx'
import StatChange from './components/StatChange.jsx'
import StatsHistory from "./components/StatsHistory.jsx"
import UpdateGoals from './components/UpdateGoals.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="min-h-screen bg-base-100" />

  return (
    <BrowserRouter>
      <StatsProvider session={session}>
        <ScrollToTop />
        <Header session={session} />
        <div className="min-h-screen flex flex-col">
          {!session ? (
            <Auth />
          ) : (
            <main className="grow space-y-8 pb-20 mt-5 mx-1">
              <Routes>
                <Route path="/" element={
                  <>
                    <TotalStats />
                    <StatChange />
                    <UpdateGoals />
                  </>
                } />
                <Route path="/addstats" element={<StatChange />} />
                <Route path="/stats" element={<StatsHistory />} />
              </Routes>
            </main>
          )}
        </div>
        <Footer />
      </StatsProvider>
    </BrowserRouter>
  )
}

export default App