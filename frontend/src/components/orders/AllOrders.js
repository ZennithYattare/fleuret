import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDate } from '../../formatDate'
import { getAllOrders, clearErrors } from './../../actions/orderActions'
import { MDBDataTableV5 } from 'mdbreact'
import Metadata from '../layout/Metadata'
import Sidebar from '../admin/Sidebar';

const AllOrders = () => {
    const dispatch = useDispatch()
    const alert = useAlert()

    const widthStyle = {
        width: '95%',
        textAlign: 'center'
    }

    const { loading, orders, error } = useSelector(state => state.orders)

    useEffect(() => {
        dispatch(getAllOrders())

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch])

    const [total, setTotal] = useState([])

    useEffect(() => {
        if (orders) {
            let totalAmount = 0
            orders.map(order => totalAmount += Number(order.total_price))
            setTotal(totalAmount)
        }
    }, [orders])

    const setOrderData = () => {
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
                    label: 'Deliver/Ready By',
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
                    width: 100
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 100,
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
                status: order.status,
                actions: <div className="btn-group" role="group">
                    <Link to={`/admin/orders/update/${order._id}`}>
                        <button className='btn fa-solid fa-arrows-rotate fa-xl' title='Update Order'></button>
                    </Link>
                </div>
            })
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'All Orders'} />
            <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
            {loading ? <h1>Loading...</h1> : orders ? (
                <>
                    <div className="col-12 col-md-10">
                        <h1 className="my-4">Orders</h1>
                        <div style={widthStyle}>
                            <MDBDataTableV5
                                hover
                                entriesOptions={[10, 15, 20, 25]}
                                entries={10}
                                pagesAmount={4}
                                data={setOrderData()}
                                searchTop
                                searchBottom={false}
                                noBottomColumns={false}
                                striped
                                fullPagination
                                scrollX/>
                        </div>
                    </div>
                </>
                ) : <h1>No orders found</h1>}
            </div>
        </Fragment>
    )
}      

export default AllOrders