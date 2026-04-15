import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from "../../utils/supabaseClient.js"

function Header({session}) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Error logging out:", error.message)
  }
  
  const closeDropdown = () => {
    const elem = document.activeElement
    if (elem) {
      elem.blur()
    }

  }
  return (
    <>
      <div className="sticky top-0 z-50 w-full px-4 pt-4">
        <div className="navbar glass min-h-17.5 rounded-4xl border border-white/20 shadow-xl px-6 backdrop-blur-2xl bg-base-100/40">
          
          {/* Navigation Start: Discreet & Minimal */}
          <div className="navbar-start">
            {!session ? (
              <div className="w-10"></div>
            ) : (
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle bg-base-content/5 hover:bg-primary/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h10" /> 
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content mt-4 w-64 p-3 shadow-2xl rounded-3xl border border-white/20 bg-base-100/95 backdrop-blur-3xl animate-in fade-in slide-in-from-top-2">
                  <li className="menu-title text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">Navigation</li>
                  <li><Link to={`/`} className="rounded-xl py-3 hover:bg-primary/10 font-medium" onClick={closeDropdown}>Dashboard</Link></li>
                  <li><Link to={`/addstats`} className="rounded-xl py-3 hover:bg-primary/10 font-medium" onClick={closeDropdown}>Add Entry</Link></li>
                  <li><Link to={`/stats`} className="rounded-xl py-3 hover:bg-primary/10 font-medium" onClick={closeDropdown}>Daily History</Link></li>
            
                  <div className="divider my-2 opacity-5"></div>
                  
                  <li className="menu-title text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2 text-accent">Preferences</li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="rounded-xl py-3 text-error/70 hover:bg-error/10 hover:text-error transition-all flex justify-between font-medium"
                    >
                      Sign Out
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Center: Elegant Branding */}
          <div className="navbar-center">
            <div className="flex flex-col items-center">
              <p className="text-xl font-serif font-semibold tracking-tight text-base-content group transition-all">
                Daily <span className="text-primary">Digest</span>
              </p>
              <div className="h-0.5 w-4 bg-secondary/30 rounded-full mt-0.5"></div>
            </div>
          </div>
          
          <div className="navbar-end gap-3">
          
        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-circle bg-base-content/5 hover:bg-base-content/10">
          <input type="checkbox" className="theme-controller" value="light" />
            
          {/* FULL RADIANT SUN (Visible in Light Mode) */}
          <svg 
            className="swap-on fill-current w-5 h-5 text-orange-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2l0,2 c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20l0,2c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2 c0-0.55-0.45-1-1-1S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0s-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0s-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L18.36,16.95z M5.99,19.42l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0l1.06-1.06c0.39-0.39,0.39-1.03,0-1.41S6.38,19.03,5.99,19.42z M18.36,7.05l1.06-1.06 c0.39-0.39,0.39-1.03,0-1.41s-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41S17.97,7.44,18.36,7.05z" />
          </svg>
            
          {/* ORIGINAL CRESCENT MOON (Visible in Dark Mode) */}
          <svg 
            className="swap-off fill-current w-5 h-5 text-indigo-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.69Z"/>
          </svg>
        </label>
      </div>
        </div>
      </div>
    </>
  )
}

export default Header