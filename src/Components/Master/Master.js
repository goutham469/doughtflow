import React, { useState } from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

function Master() {
    const [query,setQuery] = useState('')
    function queryHandler(query)
    {
        console.log("inside Master from search",query)
        setQuery(query)
    }
  return (
    <div>
        <Header queryHandler={queryHandler}/>
        <div style={{display:"flex",justifyContent:"space-around",paddingTop:"50px"}}>
            <Outlet context={{query}}/>
        </div>
    </div>
  )
}

export default Master