import React, { Fragment, useEffect, useState } from 'react';
import axios from "axios"
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import { MDBDataTableV5 } from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, clearErrors } from './../../actions/orderActions'
import { getStockData } from './../../actions/stockActions'
import { formatDate } from '../../formatDate'
import { getAllUsers } from '../../actions/authActions'
import moment from 'moment';
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

    const { loading: ordersLoading, orders, sales, error } = useSelector(state => state.orders)
    const { loading: stocksLoading, stocks, error: stockError } = useSelector(state => state.stocks)

    const { loading: usersLoading, users, error: usersError } = useSelector(state => state.users)

    useEffect(() => {
        if (user.role === 'Admin') {
            dispatch(getAllUsers())

            if (usersError) {
                alert.error(usersError)
                dispatch(clearErrors())
            }
        }
    }, [dispatch, alert, usersError, user.role])

    useEffect(() => {
        dispatch(getAllOrders())
        dispatch(getStockData())

        if (stockError || error) {
            alert.error('Something went wrong')
            dispatch(clearErrors())
        }
    }, [dispatch, alert, stockError, error])

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
            if (product.stock === 0) {
                if (!product.isArchived) {
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
            } else if (product.stock < 15) {
                if (!product.isArchived) {
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
        })

        return data
    }

    return (
        <Fragment>
            <Metadata title={'Dashboard'} />
            {!loading && !ordersLoading && !usersLoading && !stocksLoading &&
                <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>

                    <div className="col-12 col-md-10 ps-4">
                        <h1 className="my-4">Dashboard</h1>

                        <div className="row" style={widthStyle}>
                        
                            <div className={user.role === 'Admin' ? "col-sm-3 mb-3" : "col-sm-4 mb-3"}>
                                <div className="card with-revert dashboardSalesBorder o-hidden shadow-lg">
                                    <div className="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1 ms-4">Gross Sales</div>
                                                <div class="h4 mb-0 font-weight-bold ms-4">₱ {sales && sales.total}</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-peso-sign fa-2x" style={{ color: "#1e5e41" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={user.role === 'Admin' ? "col-sm-3 mb-3" : "col-sm-4 mb-3"}>
                                <div className="card with-revert dashboardProductBorder o-hidden shadow-lg">
                                    <div className="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1 ms-4">Products</div>
                                                <div class="h4 mb-0 font-weight-bold ms-4">{products.length}</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-brands fa-product-hunt fa-2x" style={{ color: "#7c688a" }}></i>
                                            </div>
                                        </div>
                                        <Link className="stretched-link" to="/admin/products/all" title="View All Products"></Link>
                                    </div>
                                </div>
                            </div>

                            <div className={user.role === 'Admin' ? "col-sm-3 mb-3" : "col-sm-4 mb-3"}>
                                <div className="card with-revert dashboardOrdersBorder o-hidden shadow-lg">
                                    <div className="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1 ms-4">Orders Placed</div>
                                                <div class="h4 mb-0 font-weight-bold ms-4">{orders && orders.filter(x => x.status === 'Order Placed').length}</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-cart-shopping fa-2x" style={{ color: "#ff7180" }}></i>
                                            </div>
                                        </div>
                                        <Link className="stretched-link" to="/admin/orders" title="View Placed Orders"></Link>
                                    </div>
                                </div>
                            </div>

                            {user.role !== "Staff" ?
                                <div className="col-sm-3 mb-3">
                                    <div className="card with-revert dashboardUsersBorder o-hidden shadow-lg">
                                        <div className="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div className="card-font-size font-weight-bold mb-1 ms-4">Users</div>
                                                    <div class="h4 mb-0 font-weight-bold ms-4">{users && users.filter(y => y.role === 'Customer').length}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fa-solid fa-users fa-2x" style={{ color: "#00c8e6" }}></i>
                                                </div>
                                            </div>
                                            <Link className="stretched-link" to={user.role === 'Admin' ? "/admin/users" : ""} title="View All Users"></Link>
                                        </div>
                                    </div>
                                </div>
                            : ""}

                            <div className="col-sm-12 mb-3">
                                <div className="card with-revert o-hidden shadow-lg">
                                    <div className="card-body" style={{paddingLeft: "16px"}}>
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1">Critical Stocks</div>
                                                <hr></hr>
                                            </div>
                                            <div style={widthStyle1}>
                                                <MDBDataTableV5
                                                    hover
                                                    entriesOptions={[3, 5, 10]}
                                                    entries={3}
                                                    pagesAmount={4}
                                                    data={setLowStocks()}
                                                    searchBottom={false}
                                                    striped
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-4 mb-3">
                                <div className="card with-revert o-hidden shadow-lg">
                                    <div className="card-body" style={{paddingLeft: "16px"}}>
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1">Stocks Summary</div>
                                                <hr></hr>
                                            </div>
                                        </div>
                                        {/* <Link className="stretched-link" to="/admin/orders" title="View Placed Orders"></Link> */}
                                        <div class="table-responsive col-auto">
                                        <table class="table table-striped" style={widthStyle1}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Sold</th>
                                                    <td>{stocks && stocks.sold}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Expired</th>
                                                    <td>{stocks && stocks.expired}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Archived</th>
                                                    <td>{stocks && stocks.archived}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-8 mb-3">
                                <div className="card with-revert o-hidden shadow-lg">
                                    <div className="card-body" style={{paddingLeft: "16px"}}>
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div className="card-font-size font-weight-bold mb-1">Weekly Gross Sales</div>
                                                <hr></hr>
                                            </div>
                                        </div>
                                        {/* <Link className="stretched-link" to="/admin/orders" title="View Placed Orders"></Link> */}
                                        <div class="table-responsive col-auto">
                                        <table class="table table-striped" style={widthStyle1}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Range</th>
                                                    <th scope="col">Gross Sales</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sales.weekly && sales.weekly.map(weeklySale => (
                                                        <tr>
                                                            <th scope="row">{moment(weeklySale.fromDate).format('L')} - {moment(weeklySale.toDate).subtract(1, 'days').format('L')}</th>
                                                            {/* <th scope="row">{moment(weeklySale.fromDate).format('L')} - {moment(weeklySale.toDate).format('L')}</th> */}
                                                            <td>₱ {weeklySale.total}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/** updates here */}
                        </div>
                    </div>

                </div>
            }
        </Fragment>
    )
}

export default Dashboard