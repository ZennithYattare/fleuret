import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadUser } from './actions/authActions'
import store from './store'
import "@fortawesome/fontawesome-free/css/all.min.css"

import './App.css';

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Loader from './components/layout/Loader'
import AdminRoute from './components/layout/AdminRoute'
import AuthenticatedRoute from './components/layout/AuthenticatedRoute'
import PrivateRoute from './components/layout/PrivateRoute'


import Home from './components/home/Home'
import Login from './components/home/Login'
import Register from './components/home/Register'
import Profile from './components/home/Profile'
import UpdateProfile from './components/home/UpdateProfile'
import UpdatePassword from './components/home/UpdatePassword'
import VerifyEmail from './components/home/VerifyEmail'
import ForgotPassword from './components/home/ForgotPassword'
import ResetPassword from './components/home/ResetPassword'


import ProductList from './components/product/ProductList'
import ProductDetail from './components/product/ProductDetail'
import ProductForm from './components/product/ProductForm'
import AdminProducts from './components/product/AdminProducts'
import AdminProductsArchives from './components/product/AdminProductsArchives'

import MyOrders from './components/orders/MyOrders'
import AllOrders from './components/orders/AllOrders'

import RegisterStaff from './components/admin/RegisterStaff'
import AllUsers from './components/admin/AllUsers'
import AllArchivedUsers from './components/admin/AllArchivedUsers'
import UpdateUser from './components/admin/UpdateUser'
import CartList from './components/cart/CartList'
import OrdersForm from './components/orders/OrdersForm'
import AdminOrderForm from './components/orders/AdminOrderForms'
import OrderDetails from './components/orders/OrderDetails'
import StocksList from './components/stocks/StocksList'
import ArchivedStocks from './components/stocks/ArchivedStocks'
import CreateStocks from './components/stocks/CreateStocks'
import StockDetails from './components/stocks/StockDetails'
import Dashboard from './components/admin/Dashboard'

const ScrollToTop = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children
}

function App() {
    const { loading } = useSelector(state => state.auth)
    // const { dashboard } = useSelector(state => state.dashboard)

    useEffect(() => {
        store.dispatch(loadUser())
    }, [])

    return (
        <Router>
            <div>
                <ScrollToTop>
                    <Header />
                    {loading ? <Loader /> : (

                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/verify/:token' element={<VerifyEmail />} />
                            <Route path='/password/forgot' element={<ForgotPassword />} />
                            <Route path='/password/reset/:token' element={<ResetPassword />} />

                            <Route path='/products' element={<ProductList />} />
                            <Route path='/products/:id' element={<ProductDetail />} />

                            {/* must be logged in to access these pages  */}
                            <Route element={<AuthenticatedRoute />}>
                                <Route path='/me/profile' element={<Profile />} />
                                <Route path='/update/profile' element={<UpdateProfile />} />
                                <Route path='/update/password' element={<UpdatePassword />} />
                                <Route path='/me/orders' element={<MyOrders />} />
                                <Route path='/order/new' element={<OrdersForm />} />
                                <Route path='/invoice/:id' element={<OrderDetails />} />
                            </Route>
                            <Route path='/me/cart' element={<CartList />} />

                            {/* must be ADMIN to access these pages  */}
                            <Route element={<AdminRoute />}>
                                <Route path='/admin/new/user' element={<RegisterStaff />} />
                                <Route path='/admin/users' element={<AllUsers />} />
                                <Route path='/admin/users/archived' element={<AllArchivedUsers />} />
                                <Route path='/admin/user/update/:id' element={<UpdateUser />} />
                            </Route>

                            {/* must be ADMIN / STAFF to access these pages  */}
                            <Route element={<PrivateRoute />}>
                                <Route path='/admin/dashboard' element={<Dashboard />} />
                                <Route path='/admin/new/product' element={<ProductForm />} />
                                <Route path='/admin/products/all' element={<AdminProducts />} />
                                <Route path='/admin/products/archived' element={<AdminProductsArchives />} />
                                <Route path='/products/edit/:id' element={<ProductForm />} />
                                <Route path='/admin/orders' element={<AllOrders />} />
                                <Route path='/admin/orders/update/:id' element={<AdminOrderForm />} />
                                <Route path='/admin/stocks' element={<StocksList />} />
                                <Route path='/admin/stocks/archived' element={<ArchivedStocks />} />
                                <Route path='/admin/stock/:id' element={<StockDetails />} />
                                <Route path='/admin/new/stock' element={<CreateStocks />} />
                            </Route>
                        </Routes>
                    )}
                    <Footer />
                </ScrollToTop>
            </div>
        </Router>
    )
}

export default App