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
                    width: 250
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
                }
            ],
            rows: []
        }

        users && users.forEach(user => {
            data.rows.push({
                name: user.first_name + " " + user.last_name,
                username: user.username,
                email: user.email,
                contact: user.contact_number,
                role: user.role
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
                            striped
                            fullPagination
                            scrollX/>
                    </div>
                </div>
                </>
            ) : <h1>No users found</h1>}
            </div>
        </Fragment>
    )
}

export default AllUsers