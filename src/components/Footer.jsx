import React from 'react'

function Footer() {
  return (
    <>
   <footer className="footer sm:footer-horizontal bg-base-100 border-t border-base-content/5 text-base-content p-10 mt-20 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <aside className="flex flex-col gap-4">
        {/* Minimalist Logo Mark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
          <p className="text-xl font-serif font-semibold tracking-tight">
            Daily <span className="text-primary italic">Digest</span>
          </p>
        </div>
      
        <p className="max-w-xs text-sm leading-relaxed text-base-content/50">
          A mindful space to document your body’s natural rhythm and find your daily balance.
        </p>
      </aside>
      
      {/* Right Side: Stay to the right on large screens */}
      <div className="flex flex-col gap-4 items-start sm:items-end text-left sm:text-right">
        {/* The Copyright & Credits */}
        <div className="text-[11px] uppercase tracking-widest opacity-30 font-bold">
          <p>© {new Date().getFullYear()} Daily Digest — All Rights Reserved</p>
          <p className="mt-1">Crafted for Wellness</p>
        </div>
      
        {/* A small "Back to Top" or Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary/5 rounded-full border border-secondary/10 w-fit">
           <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
           <span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">System Balanced</span>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer