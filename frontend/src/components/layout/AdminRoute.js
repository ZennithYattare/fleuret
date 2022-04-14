import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AdminRoute() {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth)

    if(loading === false) {
        if (!isAuthenticated) return <Navigate to="/login" />
        if(user.role === 'Staff' || user.role === 'Customer') return <Navigate to='/' />
    }

    return <Outlet />;
}


export default AdminRoute