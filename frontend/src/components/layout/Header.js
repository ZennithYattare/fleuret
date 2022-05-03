import React, { Fragment, useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, logout, clearErrors } from '../../actions/authActions'
import { Link, useNavigate } from "react-router-dom"
import Logout from "../layout/Logout"

const Header = () => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    
    return (
        <Fragment>
            {
                user && user.role !== "Customer" ?
                    " "
                    :
                    <>
                        <nav className="navbar sticky-top row navbar-light bg-light first-nav" >
                            <div className="col-12 col-md-3">
                                <div className="navbar-brand">
                                    <Link to="/">
                                        <img src="/images/logo2.png" alt="FlueretPH/TK" width="200px" height="50px" />
                                    </Link>
                                </div>
                            </div>

                            <div className="col-12 col-md-5">
                                <ul className="nav justify-content-end">

                                    <li className="nav-item">
                                        <a href='/products' className="btn" role="button" id="catalog_btn" aria-disabled="true"><i id="createMargin2" className="fa fa-store"></i>Catalog</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/me/cart' className="btn" role="button" id="cartNav_btn" aria-disabled="true" ><i id="createMargin2" className="fa fa-shopping-cart"></i>Cart</a>
                                    </li>
                                    <li className="nav-item">
                                        {
                                            user && user.role === "Admin" ?
                                                <>
                                                    <Link to='/admin/dashboard' className="btn" role="button" id="cartNav_btn" aria-disabled="true">Dashboard</Link>
                                                </>
                                                : ''
                                        }
                                    </li>

                                    {user ? <>
                                        <div className="btn-group dropdown-container">
                                            <button className="btn btn-secondary" type="button" id="register_btn" data-bs-toggle="dropdown" aria-expanded="false"><i id="createMargin2" className="fa fa-user"></i>
                                                {user.username}
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><a className="dropdown-item" href="/me/orders"><i id="createMargin" className="fa-solid fa-box"></i>My Orders</a></li>
                                                <li><a className="dropdown-item" href="/me/profile"><i id="createMargin" className="fa-regular fa-user"></i>My Profile</a></li>
                                                {/* <li><a className="dropdown-item" href="/update/password">Update Password</a></li> */}
                                                <hr></hr>
                                                <li><Logout /></li>
                                            </ul>
                                        </div>
                                    </> : <>
                                        <li className="nav-item">
                                            <a href='/login' className="btn" role="button" id="catalog_btn" aria-disabled="true"><i id="createMargin2" className="fa fa-sign-in"></i>Login</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href='/register' className="btn" role="button" id="register_btn" aria-disabled="true"><i id="createMargin2" className="fa fa-user-plus"></i>Register</a>
                                        </li>

                                    </>}
                                </ul>
                            </div>
                        </nav>
                        <nav className="navbar sticky-top row navbar-light second-nav" variant="light" >
                            <div className="nav justify-content-center">




                                {/*<NavDropdown title="Placeholder" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/products">Placeholder</NavDropdown.Item>
                              
                </NavDropdown>*/}
                            </div>

                        </nav>
                    </>
            }
        </Fragment>
    )
}

export default Header