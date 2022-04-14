import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Card, Container, Row, InputGroup } from 'react-bootstrap'
import { resetPassword, clearErrors } from './../../actions/authActions'
import { NEW_PASSWORD_RESET } from './../../constants/authConstants'
import Metadata from './../layout/Metadata'

const ResetPassword = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams()

    const { error, success, loading } = useSelector(state => state.forgotPassword)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState('false')
    const [showConfirm, setShowConfirm] = useState('false')

    const showPasswordToggle = () => setShowPassword(!showPassword)
    const showConfirmToggle = () => setShowConfirm(!showConfirm)

    useEffect(() => {
        if (success) {
            navigate('/login')
            alert.success('Password updated successfully')
            dispatch({
                type: NEW_PASSWORD_RESET
            })
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
            dispatch({
                type: NEW_PASSWORD_RESET
            })
        }
    }, [dispatch, alert, error, success, navigate])

    const submitHandler = e => {
        e.preventDefault()

        dispatch(resetPassword(token, { password, confirmPassword }))
    }

    return (
        <>
            <Metadata title={'Reset Password'} />

            <Fragment>
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                <div id = "faMail" className =  "fa fa-lock"> </div>
                    <h1 className="text-center">Reset Password</h1>
                    <hr />

                    <div className="form-group">
                        <label for="new_password_field">New Password</label>
                        <input
                            type="password" 
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            minlength="6"
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
                            minlength="6"
                            placeholder="confirm password"
                            className="form-control"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn update-btn btn-block mt-4 mb-3"
                        disabled={loading ? true : false} >
                        Change Password
                    </button>

                    <a href='/me/profile'  id = "testingCancel-btn" aria-disabled="true">Cancel</a>


                </form>
            </div>
        </div>
        </Fragment>
            
        </>
    )
}

export default ResetPassword
