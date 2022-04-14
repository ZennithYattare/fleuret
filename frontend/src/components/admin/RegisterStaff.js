import React, { useState, useEffect, Fragment } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, register } from '../../actions/authActions'
import { REGISTER_USER_RESET } from '../../constants/authConstants'
import { useNavigate } from "react-router-dom"
import Sidebar from './Sidebar';
import Metadata from '../layout/Metadata'

const Register = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { loading, error, isCreated } = useSelector(state => state.user)

    const [staff, setStaff] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact_number: ""
    })

    const { first_name, last_name, username, email, password, confirmPassword, contact_number } = staff

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isCreated) {
            navigate('/admin/new/user')
            setStaff({
                first_name: "",
                last_name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                contact_number: ""
            })
            alert.success('User successfully created')
            dispatch({ type: REGISTER_USER_RESET })
        }
    }, [dispatch, error, isCreated, alert, navigate])

    const submitHandler = e => {
        e.preventDefault()

        dispatch(register(staff, 'staff'))
    }

    const onChange = e => {
        e.preventDefault()

        setStaff({
            ...staff,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Fragment>
            <Metadata title={'Register Staff'} />
            <div className="row">
                <div className="col">
                    <Sidebar />
                </div>
                <div className="row wrapper col-12 col-md-10 my-3">
                    <div className="col-10 col-lg-5 shadow-lg overflow-auto" id="rcolStaff">
                        <form onSubmit={submitHandler} encType='multipart/form-data'>
                            <h1 className="mb-3">Register Staff</h1>
                            <hr />
                            <h4 className="mb-3">Personal Information</h4>

                            <div className="form-group">
                                <label htmlFor="name_field">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={first_name}
                                    onChange={onChange}
                                    placeholder="Enter first name"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="last_name_field">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={last_name}
                                    onChange={onChange}
                                    placeholder="Enter last name"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="Enter email"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="username_field">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    placeholder="Enter username"
                                    className="form-control"
                                    required
                                    minlength="6"
                                    maxlength="10"
                                />
                            </div>
                            <small id="formatValidation">Username must be 6 to 10 characters long.</small>
                            <div className="form-group mt-3">
                                <label htmlFor="contactNumber_field">Contact Number</label>
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={contact_number}
                                    onChange={onChange}
                                    placeholder="Enter contact number"
                                    className="form-control"
                                    required
                                    maxlength="11"
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="Enter the Password"
                                    className="form-control"
                                    required
                                    minlength="8"
                                    maxlength="20"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?![.\n])(?!.* )(?=.*[!@#$%^&*_=+-]).{8,20}$"
                                />
                                <small id="formatValidation">Password must ONLY be 8-20 characters long and contain at least one uppercase and lowercase letter, one number, and one special character.</small>
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="ConfirmPassword_field">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    placeholder="Retype Password"
                                    className="form-control"
                                    minlength="8"
                                    maxlength="20"
                                    required
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?![.\n])(?!.* )(?=.*[!@#$%^&*_=+-]).{8,20}$"
                                />

                            </div>

                            <button
                                id="register_button"
                                type="submit"
                                className="btn btn-block py-3 mt-3"
                                disabled={loading ? true : false}
                            >
                                REGISTER
                    </button>

                        </form>
                    </div>
                </div>
            </div>
            {/* <Container style={{ width: '50%' }}>
                <h1>Register Staff</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" name="first_name" value={first_name} onChange={onChange} placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" name="last_name" value={last_name} onChange={onChange} placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" value={email} onChange={onChange} placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" value={username} onChange={onChange} placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control type="text" name="contact_number" value={contact_number} onChange={onChange} placeholder="Enter contact number" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={password} onChange={onChange} placeholder="Password" />
                        <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Register
                </Button>
                </Form>
            </Container> */}
        </Fragment>
    )
}

export default Register
