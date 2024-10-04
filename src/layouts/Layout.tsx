import NavBar from "@/components/NavBar"
import { Outlet } from "react-router-dom"

function Layout() {

  return (
    <main className="">
      <NavBar/>
      <Outlet></Outlet>
    </main>
  )
}

export default Layout
