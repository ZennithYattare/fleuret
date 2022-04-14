import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, clearErrors } from '../../actions/authActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/authConstants'
import { useNavigate, Link } from "react-router-dom"

import Metadata from './../layout/Metadata'

const UpdatePassword = ({ history }) => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { error, isUpdated, loading } = useSelector(state => state.user)
    const { user } = useSelector(state => state.auth)

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        if(!user) {
            navigate('/')
            alert.error('Unable to access this page. Please log in first')
        }

        if (isUpdated) {
            navigate('/me/profile')
            alert.success('Password updated successfully')
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, history, alert, error, isUpdated, user, navigate])

    const submitHandler = e => {
        e.preventDefault()

        dispatch(updatePassword({ oldPassword, password, confirmPassword }))
    }

    return (
        <Fragment>
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="text-center">New Password</h1>
                    <hr />

                    <div className="form-group">
                        <label for="old_password_field">Old Password</label>
                        <input
                            type="password" 
                            name="oldPassword" 
                            value={oldPassword} 
                            onChange={e => setOldPassword(e.target.value)} 
                            placeholder="old password"
                            className="form-control"
                        />
                    </div>

                    <hr/>

                    <div className="form-group">
                        <label for="new_password_field">New Password</label>
                        <input
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="password"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label for="confirm_password_field">Confirm New Password</label>
                        <input
                            type="password" 
                            name="confirmPassword" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            placeholder="confirm password"
                            className="form-control"
                        />
                    </div>

                    <hr />

                    <button
                        type="submit"
                        className="btn update-btn btn-block"
                        id = "updatePass-btn"
                        disabled={loading ? true : false} >
                        Update Password
                    </button>

                    <a href='/me/profile'  id = "testingCancel-btn" aria-disabled="true">Cancel</a>


                </form>
            </div>
        </div>
        </Fragment>
    )
}

export default UpdatePassword
