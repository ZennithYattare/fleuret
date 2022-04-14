import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container } from 'react-bootstrap'
import { verifyAccount, clearErrors } from './../../actions/authActions'
import { REGISTER_USER_RESET } from './../../constants/authConstants'
import Metadata from './../layout/Metadata'
import Loader from '../layout/Loader'

const VerifyRegistration = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { error, loading, message, isCreated } = useSelector(state => state.user)
    const [verified, setVerified] = useState(false)

    const goToLogin = () => navigate('/login')
    const goToHome = () => navigate('/')

    const { token } = useParams()

    const verifyHandler = () => {
        dispatch(verifyAccount(token))
        setVerified(!verified)
    }
    useEffect(() => {
        if (isCreated) {
            navigate('/')
            alert.success('Email verified.')
            dispatch({
                type: REGISTER_USER_RESET
            })
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, isCreated, error])

    return (
        <Fragment>
            <Metadata title={isCreated ? 'Registration successful' : 'Verify Registration'} />
            <Container fluid style={{ padding: "50px 20px" }}>

                {loading ? <Loader />: (
                    !verified ? ( <Fragment>
                        <div className="row wrapper ">
                                <div className="col-10 col-lg-5 shadow-lg" id = "Cont">
                                    
                                        <div id = "faMail" className =  "fa fa-envelope-open"> </div>
                                        <h3 className="text-center">Confirm Verification</h3>
                                        <hr/>
                                        <p className = "text-center">Click the button below to verify</p>
     
                                        
     
                                        <center>
                                        <Button type='submit' variant="outline-danger" style={{ margin: '10px 5px', borderRadius: '50px', width: '10rem' }} onClick={verifyHandler}>
                                         Verify
                                         </Button>
                                         </center>
                                    
                                        
                                     
                                     </div>
                                     </div>
     
                        </Fragment>) : (<Fragment>
                        <center>
                            {!isCreated ? <Fragment>
                                <h3>{error}.</h3>
                            </Fragment>
                                :
                                <Button type='submit' variant='outline-primary' style={{ margin: '10px 5px', borderRadius: '50px', width: '10rem' }} onClick={isCreated ? goToLogin : goToHome}>
                                    {isCreated ? 'Log in' : 'Back to Home'}
                                </Button>
                            }
                        </center>
                    </Fragment>)
                )}
            </Container>
        </Fragment>
    )
}

export default VerifyRegistration