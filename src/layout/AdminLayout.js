import React from 'react'
// import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Topnav from './Topnav'

const Index = () => {
    return (
        <div>
            <div className="sticky-top" style={{boxShadow:'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px'}}>
                <Topnav />
            </div>
            <Outlet />
        </div>
    )
}

export default Index
