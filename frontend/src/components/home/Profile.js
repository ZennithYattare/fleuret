import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/authActions'
// import { INSIDE_DASHBOARD_TRUE } from '../../../constants/dashboardConstants'
import Metadata from '../layout/Metadata'
// import Loader from '../../layout/Loader'

const Profile = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { user, loadError, loading } = useSelector(state => state.auth)
    // const { loading: editLoading, isUpdated, error: editError } = useSelector(state => state.user)

    useEffect(() => {
        if (loadError) {
            navigate('/products')
            alert.error(loadError)
            dispatch(clearErrors())
        }
    }, [dispatch, alert, loadError, user, navigate])

    return (
        <>
            <Metadata title={'My Profile'} />
            <Fragment>
                <div className="profileContainer">
                    <div className="wrapper">
                        <div className="row container d-flex justify-content-center">
                            <div className="col-xs-4 col-md-4 lpof">
                                <div className="card user-card-full">
                                    <div className="row m-l-0 m-r-0">
                                        <div className=" bg-c-wallpaper user-profile">
                                            <div className="card-block text-center text-white">
                                                <div className="m-b-25">
                                                    <img src="../../images/user icon.svg" className="img-radius" alt="User-Profile-Image" height="100px" width="100px" />
                                                </div>
                                                <h3 className="f-w-600">{user.username}</h3>
                                                <hr />
                                                <h5 className="f-w-600">Full Name</h5>
                                                <p>{user.first_name} {user.last_name}</p>
                                                <Link to="/update/profile" id="edit_profile" className="btn btn-primary btn-block">
                                                    Edit Profile
                                                </Link>
                                                <Link to="/update/password" id="edit_profile" className="btn btn-primary btn-block">
                                                        Update Password
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-10 col-md-6 rpof">
                                <div className="card-block infoContainer ">
                                    <h4 className="m-b-20 p-b-5 b-b-default f-w-600">INFORMATION</h4>
                                    <div className="row">

                                        <h6>Email Address</h6>
                                        <p>{user.email}</p>

                                        <h6>Contact Number</h6>
                                        <p>{user.contact_number}</p>

                                        <h4 className="m-b-20 p-b-5 b-b-default f-w-600">Address</h4>

                                        {user.address ? <p>{user.address.street}, {user.address.municipality}, {user.address.province}, {user.address.zipCode}, {user.address.landmark}</p> : <p>Address: N/A</p>}


                                    </div>
                                    <Link to="/me/orders" id="edit_profile" className="btn btn-primary btn-block">
                                        My Orders
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        </>
    )
}

export default Profile
