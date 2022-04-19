import React, { Fragment, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, deleteUser, clearErrors } from '../../actions/authActions'
import { DELETE_USER_RESET } from '../../constants/authConstants'
import { MDBDataTableV5 } from 'mdbreact'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'

const AllUsers = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.auth)

    const widthStyle = {
        width: '95%',
        textAlign: 'center'
    }
    const divTest = {
        marginRight: '5px',
        marginLeft: '5px'
    }

    const { loading, users, error } = useSelector(state => state.users)
    const { loading: deleteLoading, isDeleted, error: deleteError } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllUsers())

        if (error) {
            alert.error(error)
            navigate('/')
            dispatch(clearErrors())
        }

        if (deleteError) {
            navigate('/admin/users')
            alert.error(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('User has been deleted')

            dispatch({ type: DELETE_USER_RESET })
        }
    }, [dispatch, deleteError, alert, isDeleted, error])

    const deleteHandler = (id) => {
        dispatch(deleteUser(id))
    }
    
    const setUsers = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    width: 200
                },
                {
                    label: 'Username',
                    field: 'username',
                    width: 100,
                },
                {
                    label: 'E-mail',
                    field: 'email',
                    width: 300,
                },
                {
                    label: 'Contact Number',
                    field: 'contact',
                    width: 200,
                },
                {
                    label: 'Role',
                    field: 'role',
                    width: 100,
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 200,
                    sort: 'disabled'
                }
            ],
            rows: []
        }

        users && users.forEach(user1 => {
            if (user1.role === 'Customer') {
                if (!user1.isDeactivated) {
                    data.rows.push({
                        name: user1.first_name + " " + user1.last_name,
                        username: user1.username,
                        email: user1.email,
                        contact: user1.contact_number,
                        role: user1.role,
                        actions: <div className="btn-group" role="group">
                            <button className='btn fa-solid fa-arrows-rotate fa-xl' title="Update User" disabled="true"></button>
                            <div style={divTest}></div>

                            <button className='btn fa-solid fa-trash fa-xl' title="Delete User" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Warning!</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div class="modal-body" style={{textAlign: 'justify'}}>
                                            <b>Are you sure you want to delete this user?</b>
                                            <br></br>
                                            This action cannot be undone.
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {deleteHandler(user1._id)}} disabled={user1.role === 'Admin' ? true : false}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            } else if (user1.role === 'Admin'){
                data.rows.push({
                    name: user1.first_name + " " + user1.last_name,
                    username: user1.username,
                    email: user1.email,
                    contact: user1.contact_number,
                    role: user1.role,
                    actions:
                    <div className="btn-group" role="group">
                    {user1._id === user._id 
                    ? <button className='btn fa-solid fa-arrows-rotate fa-xl' title="Update User" disabled={true}></button>
                    : <Link to={`/admin/user/update/${user1._id}`}>
                        <button className='btn fa-solid fa-arrows-rotate fa-xl' title="Update User"></button>
                    </Link>}
                    <div style={divTest}></div>

                    <button className='btn fa-solid fa-trash fa-xl' title="Delete User" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={user1._id === user._id ? true : false}></button>
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Warning!</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body" style={{textAlign: 'justify'}}>
                                    <b>Are you sure you want to delete this user?</b>
                                    <br></br>
                                    This action cannot be undone.
                                </div>

                                <div class="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {deleteHandler(user1._id)}}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                })
            } else {
                data.rows.push({
                    name: user1.first_name + " " + user1.last_name,
                    username: user1.username,
                    email: user1.email,
                    contact: user1.contact_number,
                    role: user1.role,
                    actions: 
                    <div className="btn-group" role="group">
                        <Link to={`/admin/user/update/${user1._id}`}>
                            <button className='btn fa-solid fa-arrows-rotate fa-xl' title="Update User"></button>
                        </Link>
                        <div style={divTest}></div>
                        <button className='btn fa-solid fa-trash fa-xl' title="Delete User" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Warning!</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div class="modal-body" style={{textAlign: 'justify'}}>
                                        <b>Are you sure you want to delete this user?</b>
                                        <br></br>
                                        This action cannot be undone.
                                    </div>

                                    <div class="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {deleteHandler(user1._id)}} disabled={user1.role === 'Admin' ? true : false}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
            {loading ? <h1>Loading...</h1> : users ? (
                <>
                <div className="col-12 col-md-10">
                    <h1 className="my-4">Users</h1>
                    <div style={widthStyle}>
                        <MDBDataTableV5
                            hover
                            entriesOptions={[10, 20, 30]}
                            entries={10}
                            pagesAmount={4}
                            data={setUsers()}
                            searchTop
                            searchBottom={false}
                            noBottomColumns={false}
                            striped
                            fullPagination
                            scrollX
                            />
                    </div>
                </div>
                </>
            ) : <h1>No users found</h1>}
            </div>
        </Fragment>
    )
}

export default AllUsers