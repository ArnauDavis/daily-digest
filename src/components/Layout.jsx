import { Outlet } from "react-router-dom"
import { useScrollToTop } from "../hooks/useScrollToTop.js"
import Header from "./Header"
import Footer from "./Footer"

function Layout({ session }) {
    useScrollToTop()
  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      
      {/* the outlet is where the specific page (Dashboard, History, etc.) will render */}
      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout