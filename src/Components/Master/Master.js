import React from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

function Master() {
  return (
    <div>
        <Header/>
        <div style={{display:"flex",justifyContent:"space-around",paddingTop:"50px"}}>
            <Outlet/>
        </div>
    </div>
  )
}

export default Master