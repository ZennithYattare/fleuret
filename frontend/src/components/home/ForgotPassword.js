import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FloatingLabel, Form, Button, Card, Container, Row } from 'react-bootstrap'
import { forgotPassword, clearErrors } from './../../actions/authActions'
import { FORGOT_PASSWORD_RESET } from './../../constants/authConstants'
import Metadata from './../layout/Metadata'

const ForgotPassword = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { error, message, loading } = useSelector(state => state.forgotPassword)

    const [email, setEmail] = useState('')

    const goBack = () => {
        navigate('/login')
    }

    const goToLogin = () => {
        dispatch({
            type: FORGOT_PASSWORD_RESET
        })

        navigate('/login')
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            setEmail('')
            dispatch(clearErrors())
            dispatch({
                type: FORGOT_PASSWORD_RESET
            })
        }
    }, [dispatch, alert, error])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
    }

    return (
        <Fragment>
            <Metadata title={'Forgot your password?'} />
            <Container fluid style={{ paddingTop: '50px 20px', margin: '40px 0px' }}>
                {message ? (
                   <Fragment>
                   <div className="row wrapper">
                           <div className="col-10 col-lg-5">
                               <form className="shadow-lg" onSubmit = {submitHandler} encType='application/json' method='post'>
                                   <div id = "faMail" className =  "fa fa-envelope"> </div>
                                   <h3 className="text-center">Email Sent!</h3>
                                   <hr/>
                                   <p className = "text-center">A reset password link has been sent to your email. Kindly check your inbox to proceed.</p>

                                   <div className = "row">

                                   
                                   <button
                                       id="backtologin_btn"
                                       disabled={loading ? true : false}
                                       variant='outline-secondary'
                                       onClick={goToLogin}>Back to Log In
                                </button>
                                </div>
                                   
                                </form>
                                </div>
                                </div>

                   </Fragment>
                ) : (
                    <Fragment>
        <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit = {submitHandler} encType='application/json' method='post'>
                        <div id = "faMail" className =  "fa fa-key"> </div>
                        <h3 className="text-center">Forgot Password?</h3>
                        <hr/>
                        <p id="p"className = "text-center">Enter your registered email address. A reset password link will be sent to your inbox.</p>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Your Email Address</label>
                            <input
                                 type='email'
                                 name="email"
                                 value={email}
                                 onChange={e => setEmail(e.target.value)}
                                 required
                                 className="form-control"
                            />
                        </div>
                        
                    <div className = "row">

                        <div className = "col text-center">
                        <button
                            id="cancelEmail-btn"
                            disabled={loading ? true : false}
                            variant='outline-secondary'
                            onClick={goBack}>Cancel
                        </button>
                        </div>

                        <div className = "col text-center">
                        <button
                            type='submit'
                            id = "sendEmail_btn"
                            disabled={loading ? true : false}>
                            {loading ? (
                                <span>
                                    <i class="fa fa-circle-o-notch fa-spin fa-1x fa-fw" style={{ textAlign: 'center'}}></i>
                                </span>
                            ) : (
                                <span>Send Email</span>
                            )}
                    </button>
                        </div>
                        
                    </div>

                    </form>
                </div>
            </div>
        </Fragment>
                )}
            </Container>
        </Fragment>
    )
}

export default ForgotPassword
