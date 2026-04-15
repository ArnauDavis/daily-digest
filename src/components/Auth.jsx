import React from 'react'
import { useState } from 'react'
import { supabase } from '../../utils/supabaseClient.js'

function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)

  // 1. Always try to SIGN IN first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // 2. If it fails because the user doesn't exist, TRY TO SIGN UP
    // Note: 'Invalid login credentials' is the error for "User not found" OR "Wrong Password"
    if (signInError.message === 'Invalid login credentials') {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        // 3. If they actually DO exist and you just got the password wrong
        if (signUpError.message.includes("already registered")) {
          alert("This email is already registered. Check your password!")
        } else {
          alert(signUpError.message)
        }
      } else {
        alert('Account created! Welcome to Gutz.')
      }
    } else {
      // Handle other errors (like rate limits or server issues)
      alert(signInError.message)
    }
  }

  setLoading(false)
}

  const intents = [
    "Hydration is the first step to balance.",
    "Listen to what your gut is telling you.",
    "Small entries lead to big insights.",
    "Take a moment to breathe and check in.",
    "Your body’s rhythm is unique to you.",
    "Consistency is the key to clarity.",
    "Fuel your body with intention today.",
    "Every drop of water counts.",
    "Notice the patterns, find your flow.",
    "A mindful gut is a happy gut."
  ]
  const [randomIntent] = React.useState(() => 
    intents[Math.floor(Math.random() * intents.length)]
  )

  return (
    <div className="relative min-h-screen flex mt-24 justify-center bg-base-100 p-4">
  
    {/* Abstract Background Elements - Soft Organic Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="relative z-10 w-full max-w-sm">

      {/* Minimalist Branding */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group transition-transform hover:scale-110">
           {/* Subtle "Drop" Icon representing hydration/digestion */}
           <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin [animation-duration:3s]"></div>
        </div>
        <h1 className="text-3xl font-light tracking-tight text-base-content">
          Daily <span className="font-semibold text-primary">Digest</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mt-2 font-medium">Your Daily Body Log</p>
      </div>

      {/* The Clean Input Stack */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="group flex flex-col space-y-1">
          <input
            type="email"
            placeholder="Email Address"
            required 
            className="w-full bg-base-200/50 border border-transparent focus:border-primary/30 focus:bg-base-100 h-14 px-6 rounded-2xl outline-none transition-all placeholder:text-base-content/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="group flex flex-col space-y-1">
          <input
            type="password"
            placeholder="Password"
            required 
            minLength={6}
            className="w-full bg-base-200/50 border border-transparent focus:border-primary/30 focus:bg-base-100 h-14 px-6 rounded-2xl outline-none transition-all placeholder:text-base-content/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary text-primary-content font-medium rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            "Continue to Journal"
          )}
        </button>
      </form>

      {/* Mindful Nudge */}
      <div className="mt-10 text-center space-y-6">
        <div className="px-4 py-3 bg-secondary/5 rounded-2xl border border-secondary/10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold">
            Today's Intent
          </p>
          <p className="text-sm text-base-content/60 mt-1">
            {randomIntent}
          </p>
        </div>
      </div>

      </div>
    </div>
  )
}

export default Auth