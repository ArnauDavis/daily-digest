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
        
        {/* GitHub Link */}
        <a 
          href="https://github.com/ArnauDavis" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-30 hover:opacity-100 transition-opacity duration-300"
          aria-label="GitHub Repository"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>

        {/* The Copyright & Credits */}
        <div className="text-[11px] uppercase tracking-widest opacity-30 font-bold">
          <p>© {new Date().getFullYear()} Daily Digest — All Rights Reserved</p>
          <p className="mt-1">Crafted for Wellness</p>
        </div>
      
        {/*Status indicator */}
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