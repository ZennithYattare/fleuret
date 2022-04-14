import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../../formatDate'
import { getMyOrders, clearErrors } from './../../actions/orderActions'
import Metadata from '../layout/Metadata'
import axios from 'axios'
import { MDBDataTableV5 } from 'mdbreact'

const MyOrders = () => {
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

    const { loading, orders, error } = useSelector(state => state.orders)
    const [success, setSuccess] = useState(false)
    const [id, setID] = useState('')

    useEffect(() => {
        dispatch(getMyOrders())

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error, success])

    useEffect(() => {
        if (success) {
            navigate("/me/orders")
            alert.success(`Order ${id} has been cancelled.`)
            setSuccess(false)
            setID('')
        }
    }, [success])

    const cancelOrder = async (id, order) => {
        try {
            await axios.put(`/api/v1/order/${id}`, { ...order, status: 'Cancelled' }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setID(id)
            setSuccess(true)
            
        } catch (error) {
            alert.error('Cannot cancel order.')
            setSuccess(false)
        }
    }

    const setMyOrderData = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Ordered By',
                    field: 'name',
                    width: 200
                },
                {
                    label: 'Delivery Mode',
                    field: 'delivery',
                    width: 100
                },
                {
                    label: 'Total',
                    field: 'price',
                    width: 100,
                },
                {
                    label: 'Order Placed On',
                    field: 'order',
                    width: 150
                },
                {
                    label: 'Deliver By',
                    field: 'ship',
                    width: 100
                },
                {
                    label: 'Updated',
                    field: 'update',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'status',
                    width: 150
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

        orders && orders.forEach(order => {
            data.rows.push({
                name: [order.user.first_name, [" "], order.user.last_name],
                delivery: order.delivery_mode,
                price: order.total_price,
                order: formatDate(order.order_date),
                ship: formatDate(order.delivery_date),
                update: formatDate(order.updated_at),
                status: order.status && String(order.status).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.status}</p>
                    : <p>{order.status}</p>,
                actions: <div className="btn-group" role="group">
                    <Link to={`/invoice/${order._id}`}>
                        <button className='btn fa-regular fa-eye fa-xl' title='View Invoice'></button>
                    </Link>
                </div>
            })
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'My Orders'} />
            <div className = "myOrdersContainer">
                {loading ? <h1>Loading...</h1> : orders ? (
                    <>
                 
                        <div className="col-md-auto" style={{ paddingLeft: '4rem' }}>
                            <h1 className="my-4">My Orders</h1>
                            <div style={widthStyle}>
                                <MDBDataTableV5
                                    hover
                                    entriesOptions={[5, 10, 15, 20, 25]}
                                    entries={5}
                                    pagesAmount={4}
                                    data={setMyOrderData()}
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
                ) : <div className="col-md-auto" style={{ paddingLeft: '4rem' }}>
                        <h1 className="my-4">No orders found</h1>
                    </div>}
            </div>
            
        </Fragment>
    )
}

export default MyOrders