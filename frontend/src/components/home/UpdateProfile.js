import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, loadUser, clearErrors } from '../../actions/authActions'
import { UPDATE_USER_RESET } from '../../constants/authConstants'
import { Container, Card, Form, Button } from 'react-bootstrap'
import Metadata from '../layout/Metadata'
import { Modal } from "react-bootstrap";
import { logout } from '../../actions/authActions'
import axios from 'axios'

// import Loader from '../../layout/Loader'

const UpdateProfile = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const [contactNumber, setContactNumber] = useState('')
    const [address, setAddress] = useState({})
    const [show, setShow] = useState(false);

    const { user, loadError, loading } = useSelector(state => state.auth)
    const { isUpdated, error } = useSelector(state => state.user)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (loadError) {
            navigate('/products')
            alert.error(loadError)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            navigate('/me/profile')
            dispatch(loadUser())
            alert.success('Updated successfully')
            dispatch({ type: UPDATE_USER_RESET })
        }

        if (error) {
            navigate('/update/profile')
            alert.error(error)
            dispatch({ type: UPDATE_USER_RESET })
            dispatch(clearErrors())
        }

        setContactNumber(user.contact_number)
        setAddress(user.address)

    }, [dispatch, alert, loadError, user, navigate, isUpdated, error])

    const submitHandler = e => {
        e.preventDefault()

        dispatch(updateProfile({ contact_number: contactNumber, address }))
    }
    const deactivate = async () => {
        //if (window.confirm('are you sure you want to deactivate?')) {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.put('/api/v1/me/deactivate', { isDeactivated: true }, config)

            if (data.success) {
                alert.success('Deactivated successfully. You can still activate the account within 30 days.')
                dispatch(logout())
                navigate('/')
            }
        } catch (error) {
            alert.error('Cannot deactivate user with active orders.')
        }
    }

    return (
        <>
            <Metadata title={'Update Profile'} />
            {loading ? <h1>Loading</h1>
                : <>
                    <Fragment>
                        <div className="container-container-fluid">
                            <div className="row wrapper">
                                <div className="col-10 col-lg-5">
                                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                        <h1 className="text-center">Update Profile</h1>
                                        <hr />
                                        <p>Name: {user.first_name} {user.last_name}</p>
                                        <p>Username: {user.username}</p>
                                        <p>Email: {user.email}</p>
                                        <p>Role: {user.role}</p>

                                        <div className="form-group">
                                            <label htmlFor="contactNumber_field">Contact Number</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter contact number"
                                                name="contactNumber"
                                                value={contactNumber}
                                                onChange={e => setContactNumber(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>

                                        <h4 className="mt-4 mb-3">Address</h4>
                                        <hr />
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
                                            <label htmlFor="municipality_field">City/Municipality</label>
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
                                                required
                                                type="text"
                                                placeholder="Landmark"
                                                value={address?.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>

                                        <button type="submit"
                                            className="btn update-btn btn-block"
                                            disabled={loading ? true : false} id="update-btn" >Update</button>

                                        <a href='/me/profile' id="testingCancel-btn" aria-disabled="true">Cancel</a>
                                        <hr />
                                        {user.role === 'Admin' ? '' :
                                            <span data-toggle="modal" onClick={handleShow} className="text-center" id="deactivate-btn">
                                                Deactivate
                                            </span>}
                                        <Modal show={show} onHide={handleClose} scrollable={true} >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirm Deactivation</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Are you sure you want to deactivate this account? The account can still be activated within 30 days by logging in.
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <span
                                                    className="btn "
                                                    id="backCancel_btn"
                                                    onClick={handleClose}
                                                >
                                                    Back
                                                </span>
                                                <span
                                                    className="btn "
                                                    id="orderCancel_btn"
                                                    onClick={(e => deactivate())} disabled={loading ? true : false}
                                                >
                                                    Confirm
                                                </span>
                                            </Modal.Footer>
                                        </Modal>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                </>}
        </>
    )
}

export default UpdateProfile
