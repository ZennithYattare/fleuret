import React, { Fragment, useEffect, useState } from 'react';
import axios from "axios"
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import { MDBDataTableV5 } from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, clearErrors } from './../../actions/orderActions'
import { getAllUsers } from '../../actions/authActions'
import Metadata from '../layout/Metadata'

//import Metadata from './layout/Metadata';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const widthStyle = {
        width: '95%',
    }
    const widthStyle1 = {
        textAlign: 'center'
    }

    const alert = useAlert()

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const { loading: ordersLoading, orders, error } = useSelector(state => state.orders)

    const { loading: usersLoading, users, error: usersError } = useSelector(state => state.users)
    
    useEffect(() => {
        if (user.role === 'Admin'){
            dispatch(getAllUsers())

            if (usersError) {
                alert.error(usersError)
                dispatch(clearErrors())
            }
        }
    }, [dispatch, alert, usersError, user.role])

    useEffect(() => {
        dispatch(getAllOrders())

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error])

    useEffect(() => {
        let isMounted = true
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const fetchData = async () => {
            const { data } = await axios.get('/api/v1/products', config)
            
            if (data.success && isMounted) {
                setProducts(data.products)
                setLoading(false)
            }
            setLoading(false)

        }
        fetchData()
        return () => isMounted = false
    }, [])

    const setLowStocks = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Product Name',
                    field: 'name',
                    width: 300
                },
                {
                    label: 'Quantity',
                    field: 'stocks',
                    width: 200
                },
                {
                    label: 'Status',
                    field: 'status',
                    width: 300
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

        products && products.forEach(product => {
            if (product.stock === 0){
                if (!product.isArchived){
                    if (!product.isSold){
                        if (!product.autoArchive){
                            if (!product.isExpired){
                                data.rows.push({
                                    name: product.name,
                                    stocks: product.stock,
                                    status: "Out of Stock",
                                    actions: 
                                    <div className="btn-group" role="group">
                                        <Link to='/admin/stocks'>
                                            <button className='btn fa-solid fa-arrow-right fa-xl' title="All Stocks"></button>
                                        </Link>
                                    </div>
                                })
                            }
                        }
                    }
                }
            } else if (product.stock < 15) {
                if (!product.isArchived){
                    if (!product.isSold){
                        if (!product.autoArchive){
                            if (!product.isExpired){
                                data.rows.push({
                                    name: product.name,
                                    stocks: product.stock,
                                    status: "Low on Stocks",
                                    actions: 
                                    <div className="btn-group" role="group">
                                        <Link to='/admin/stocks'>
                                            <button className='btn fa-solid fa-arrow-right fa-xl' title="All Stocks"></button>
                                        </Link>
                                    </div>
                                })
                            }
                        }
                    }
                }
            }
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'Dashboard'} />
            {!loading && !ordersLoading && !usersLoading &&
                <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>

                    <div className="col-12 col-md-10">
                        <h1 className="my-4">Dashboard</h1>
                        
                            <div className={user.role === 'Admin' ? "row pe-4" : "row pe-4 justify-content-center"} style={widthStyle}>
                            <div className="col-sm-4 mb-3">
                                <div className="card with-revert dashboardProductBorder o-hidden shadow-lg">
                                    <div className="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1 ms-4" style={{color: "#1e5e41"}}>Products</div>
                                                <div class="h4 mb-0 font-weight-bold ms-4">{products.length}</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-brands fa-product-hunt fa-2x text-muted"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <Link id="removeBlue" className="card-footer clearfix small z-1" to="/admin/products/all">
                                        <span className="float-start">View Details </span>
                                        <span className="float-end">
                                            <i className="fa-solid fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="col-sm-4 mb-3">
                                <div className="card with-revert dashboardOrdersBorder o-hidden shadow-lg">
                                    <div className="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1 ms-4" style={{color: "#ff7180"}}>Orders Placed</div>
                                                <div class="h4 mb-0 font-weight-bold ms-4">{orders && orders.filter(x => x.status === 'Order Placed').length}</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-cart-shopping fa-2x text-muted"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <Link id="removeBlue" className="card-footer clearfix small z-1" to="/admin/orders">
                                        <span className="float-start">View Details </span>
                                        <span className="float-end">
                                            <i className="fa-solid fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {user.role !== "Staff" ?
                                <div className="col-sm-4 mb-3">
                                    <div className="card with-revert dashboardUsersBorder o-hidden shadow-lg">
                                        <div className="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div className="card-font-size font-weight-bold mb-1 ms-4" style={{color: "#00c8e6"}}>Users</div>
                                                    <div class="h4 mb-0 font-weight-bold ms-4">{users && users.filter(y => y.role === 'Customer').length}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fa-solid fa-users fa-2x text-muted"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <Link id="removeBlue" className="card-footer clearfix small z-1" to={user.role === 'Admin' ? "/admin/users" : ""} >
                                            <span className="float-start">View Details </span>
                                            <span className="float-end">
                                                <i className="fa-solid fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            : "" }

                            <h3>Critical Stocks</h3>
                            <div className="col-sm-12 mb-3">
                                <div style={widthStyle1}>
                                    <MDBDataTableV5
                                        hover
                                        entriesOptions={[10, 15]}
                                        entries={10}
                                        pagesAmount={4}
                                        data={setLowStocks()}
                                        searchBottom={false}
                                        noBottomColumns={false}
                                        striped
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
        </Fragment>
    )
}

export default Dashboard