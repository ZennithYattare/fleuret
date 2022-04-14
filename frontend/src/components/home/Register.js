import React, { Fragment, useState, useEffect } from 'react'
import { Container, Form, Button, Modal } from 'react-bootstrap'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, register } from '../../actions/authActions'
import { useNavigate } from "react-router-dom"
import TermsAndConditions from './TermsAndConditions'
import PrivacyPolicy from './PrivacyPolicy'

const Register = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { loading, error, isSent } = useSelector(state => state.customer)

    const [show, setShow] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClosePrivacy = () => setShowPrivacy(false);
    const handleShowPrivacy = () => setShowPrivacy(true);

    const [customer, setCustomer] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact_number: ""
    })

    const [address, setAddress] = useState({})
    const { first_name, last_name, username, email, password, confirmPassword, contact_number } = customer

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isSent) {
            navigate('/products')
            alert.success(isSent)
        }
    }, [dispatch, error, isSent, alert, navigate])
    const submitHandler = e => {
        e.preventDefault()

        dispatch(register({ ...customer, address }, 'customer'))
    }

    const onChange = e => {
        e.preventDefault()

        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        })
    }



    return (
        <>
            <Fragment>
                <div className="row wrapper">
                    <div className="container d-flex justify-content-center">
                        <div className="col-md-6 col-12  text-left text-white shadow-lg lcol">
                            <div className="greeting">
                                <h3>Welcome to <span className="txt">Fleuret PH/TK</span></h3>
                            </div>
                            <h6 className="mt-3">Bespoke dried flower arrangements</h6>
                            <div className="footer">
                            </div>
                        </div>
                        <div className="col-10 col-lg-5 rcol shadow-lg overflow-auto">
                            <form className="shadow-lg " onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-3">Register</h1>
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
                                    <label htmlFor="contactNumber_field">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={contact_number}
                                        onChange={onChange}
                                        placeholder="Enter contact number"
                                        className="form-control"
                                        required
                                        maxlength="11"
                                    />
                                </div>
                                <small id="formatValidation">Example: 09123456789 or 81237654</small>
                                <div className="form-group">
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
                                <div className="form-group">
                                    <label htmlFor="ConfirmPassword_field">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onChange}
                                        placeholder="Retype Password"
                                        className="form-control"
                                        required
                                        minlength="8"
                                        maxlength="20"
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?![.\n])(?!.* )(?=.*[!@#$%^&*_=+-]).{8,20}$"
                                    />
                                </div>
                                <hr />
                                <h4 className="mb-3">Address</h4>
                                <div className="form-group">
                                    <label htmlFor="street_field">Block/Lot Number, Street, and Village</label>
                                    <input
                                        type="text"
                                        placeholder="Block/Lot Number, Street, Village"
                                        value={address?.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="municipality_field">City/municipality</label>
                                    <Form.Select required value={address?.municipality} onChange={(e) => setAddress({ ...address, municipality: e.target.value })}>
                                        <option selected>-</option>
                                        <option value="Caloocan">Caloocan</option>
                                        <option value="Las Piñas">Las Piñas</option>
                                        <option value="Makati">Makati</option>
                                        <option value="Malabon">Malabon</option>
                                        <option value="Mandaluyong">Mandaluyong</option>
                                        <option value="Manila">Manila</option>
                                        <option value="Marikina">Marikina</option>
                                        <option value="Muntinlupa">Muntinlupa</option>
                                        <option value="Navotas">Navotas</option>
                                        <option value="Parañaque">Parañaque</option>
                                        <option value="Pasay">Pasay</option>
                                        <option value="Pasig">Pasig</option>
                                        <option value="Pateros">Pateros</option>
                                        <option value="Quezon City">Quezon City</option>
                                        <option value="San Juan">San Juan</option>
                                        <option value="Taguig">Taguig</option>
                                        <option value="Valenzuela">Valenzuela</option>
                                    </Form.Select>
                                </div>

                                <small id="formatValidation">We currently only accomodate those within Metro Manila.</small>
                                
                                <div className="form-group">
                                    <label htmlFor="province_field">Region</label>
                                    <Form.Select required value={address?.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
                                        <option selected>-</option>
                                        <option value="Metro Manila">Metro Manila</option>
                                    </Form.Select>
                                </div>

                                    {/* <input
                                        type="text"
                                        placeholder="Province"
                                        value={address?.province}
                                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                                        className="form-control"
                                        required
                                    /> */}

                                <div className="form-group">
                                    <label htmlFor="zipCode_field">Zip Code</label>
                                    <input
                                        type="number"
                                        placeholder="Zipcode"
                                        value={address?.zipCode}
                                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                        className="form-control"
                                        required
                                        min="0"
                                        max="9999"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="landMark_field">Landmark</label>
                                    <input
                                        type="text"
                                        placeholder="Landmark"
                                        value={address?.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                                        className="form-control"
                                        required
                                    />

                                </div>

                                <hr />
                                

                                <div className="form-check">
                                    <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" required />

                                    <p id="terms_button " className="terms_button " data-toggle="modal" onClick={handleShow}>I agree to the terms and conditions </p>
                                    </label>
                                </div>

                                <Modal size="lg" show={show} onHide={handleClose} scrollable={true} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Terms and Conditions</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <TermsAndConditions/>
                                        <hr />
                                        <div className = "text-center">
                                            <div className = "row">
                                            
                                            <label className="form-check-label mr-auto" id = "modalTerms">
                                                <input className="form-check-input" type="checkbox" required /> I agree to the terms and conditions 
                                            </label>
                                  
                                            <span onClick = {handleClose} id = "modalClose">Close</span>
                                    
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </Modal>

                                <div className="form-check">
                                    <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" required />

                                    <p id="terms_button " className="terms_button " data-toggle="modal"  onClick={handleShowPrivacy} >I agree to the Privacy Policy</p>
                                    </label>
                                </div>
                                <Modal size="lg" show={showPrivacy} onHide={handleClosePrivacy} scrollable={true} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Privacy Policy</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <PrivacyPolicy/>
                                        <hr />
                                        < div className = "text-center">
                                        <div className = "row">
                                            
                                    <label className="form-check-label mr-auto" id = "modalTerms">
                                    <input className="form-check-input" type="checkbox" required /> I agree to the Privacy Policy
                                    </label>
                                  
                                   
                                        <span onClick = {handleClosePrivacy} id = "modalClose">Close</span>
                                    
                                    </div>
                                    </div>
                                    </Modal.Body>
                                  
                                </Modal>

                                <button
                                    id="register_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    REGISTER
                                    </button>
                            </form>
                        </div>
                    </div>
                </div>


            </Fragment>
        </>
    )
}

export default Register
