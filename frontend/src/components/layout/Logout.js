import React from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { logout, clearErrors } from '../../actions/authActions'

const Home = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const logoutHandler = () => {
        dispatch(logout())
        alert.success('Logged out successfully')
        navigate('/')
    }
    
    return (
        <>
            {/* <Button onClick={logoutHandler} variant={"danger"}> Logout </Button> */}
            <li><a className="dropdown-item" onClick={logoutHandler}><i id="createMargin" class="fa-solid fa-arrow-right-from-bracket"></i>Logout</a></li>
        </>
    )
}

export default Home
