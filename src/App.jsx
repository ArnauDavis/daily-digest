import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StatsProvider } from "./context/StatsContext.jsx"
import { useAuth } from "./hooks/useAuth.js"


import Layout from "./components/Layout.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Auth from "./components/Auth.jsx"
import StatChange from './components/StatChange.jsx'
import StatsHistory from "./components/StatsHistory.jsx"

function App() {
  const { session, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-base-100" />

  return (
    <BrowserRouter>
      <StatsProvider session={session}>
        {!session ? (
          <Auth />
        ) : (
          <Routes>
            <Route element={<Layout session={session} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/addstats" element={<StatChange />} />
              <Route path="/stats" element={<StatsHistory />} />
            </Route>
          </Routes>
        )}
      </StatsProvider>
    </BrowserRouter>
  )
}

export default App