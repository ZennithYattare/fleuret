import React, { Fragment, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDeactivatedUsers, deleteUser, clearErrors } from '../../actions/authActions'
import { DELETE_USER_RESET } from '../../constants/authConstants'
import { MDBDataTableV5 } from 'mdbreact'
import Sidebar from './Sidebar';
import Metadata from '../layout/Metadata'

const AllUsers = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

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
        dispatch(getAllDeactivatedUsers())

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
                    width: 500
                },
                {
                    label: 'Username',
                    field: 'username',
                    width: 250,
                },
                {
                    label: 'Role',
                    field: 'role',
                    width: 100,
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 150,
                    sort: 'disabled'
                }
            ],
            rows: []
        }

        users && users.forEach(user => {
            data.rows.push({
                name: user.first_name + " " + user.last_name,
                username: user.username,
                role: user.role,
                actions: 
                <div className="btn-group" role="group">
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
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {deleteHandler(user._id)}} disabled={user.role === 'Admin' ? true : false}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'Archived Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
            {loading ? <h1>Loading...</h1> : users ? (
                <>
                <div className="col-12 col-md-10">
                    <h1 className="my-4">Archived Users</h1>
                    <div style={widthStyle}>
                        <MDBDataTableV5
                            hover
                            entriesOptions={[5, 10, 15, 20, 25]}
                            entries={5}
                            pagesAmount={4}
                            data={setUsers()}
                            searchTop
                            searchBottom={false}
                            noBottomColumns={false}
                            bordered
                            striped
                            fullPagination
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