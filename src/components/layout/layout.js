import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../header'

import './layout.scss'

function Layout() {
  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
