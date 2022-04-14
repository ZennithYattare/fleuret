import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, updateUser, clearErrors } from '../../actions/authActions'
import { UPDATE_USER_RESET } from '../../constants/authConstants'
import Metadata from '../layout/Metadata'
import Sidebar from '../admin/Sidebar'

const UpdateUser = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const { id } = useParams()

    const { user, error, loading } = useSelector(state => state.userDetails)
    const { error: updateError, loading: updateLoading, isUpdated } = useSelector(state => state.user)

    const [userDetails, setUserDetails] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        contact_number: "",
        role: ""
    })
    const { first_name, last_name, username, email, role, contact_number } = userDetails

    useEffect(() => {
        if (user && user._id !== id) {
            dispatch(getUser(id))
        } else if (user) {
            setUserDetails({
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                contact_number: user.contact_number,
                role: user.role
            })
        } else {
            dispatch(getUser(id))
        }

        if (isUpdated) {
            alert.success('User has beed updated')
            navigate('/admin/users')
            dispatch({ type: UPDATE_USER_RESET })
        }

        if (error) {
            navigate('/')
            alert.error(error)
            dispatch(clearErrors())
        }

        if (updateError) {
            navigate('/admin/users')
            alert.error(updateError)
            dispatch(clearErrors())
        }

    }, [dispatch, alert, error, updateError, navigate, user, isUpdated])

    const updateHandler = e => {
        e.preventDefault()

        dispatch(updateUser(id, userDetails))
    }

    const onChange = e => {
        e.preventDefault()

        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Fragment>
            <Metadata title={'Update User'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
            {loading ? <h1>Loading</h1>
                : <>
                    <div className="col-12 col-md-10">
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={updateHandler} encType='multipart/form-data'>
                                    <h1 className="text-center">Update User</h1>
                                    <hr />

                                    <div className="form-group">
                                        <label>Role</label>
                                        <select className="form-select" name="role" value={role} onChange={onChange} required>
                                            <option disabled>-</option>
                                            <option value={"Staff"}>Staff</option>
                                            <option value={"Admin"}>Admin</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            name="first_name"
                                            value={first_name}
                                            onChange={onChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            name="last_name"
                                            value={last_name}
                                            onChange={onChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>E-mail</label>
                                        <input
                                            type="text"
                                            placeholder="E-mail"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            name="username"
                                            value={username}
                                            onChange={onChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Number</label>
                                        <input
                                            type="text"
                                            placeholder="Contact number"
                                            name="contact_number"
                                            value={contact_number}
                                            onChange={onChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn update-btn btn-block mt-4 mb-3"
                                        disabled={updateLoading ? true : false} value="Submit"
                                    >Update</button>

                                    <a href='/admin/users' id="testing-btn" aria-disabled="true">Cancel</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            }
            </div>
        </Fragment>
    )
}

export default UpdateUser
