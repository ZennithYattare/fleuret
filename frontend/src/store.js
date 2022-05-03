import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import { composeWithDevTools} from 'redux-devtools-extension'

import * as auth from './reducers/authReducers'
import * as orders from './reducers/orderReducers'
import * as products from './reducers/productReducers'
import * as stocks from './reducers/stockReducers'

const reducer = combineReducers({
    auth: auth.authReducer,
    user: auth.userReducer,
    customer: auth.verifyCustomerReducer,
    users: auth.usersReducer,
    userDetails: auth.userDetailsReducer,
    forgotPassword: auth.forgotPasswordReducer,

    orders: orders.ordersReducer,
    order: orders.orderReducer,
    stocks: stocks.stockReducer,
    newOrder: orders.newOrderReducer,
    orderOperations: orders.orderOperationsReducer,

    product: products.productReducer,
})

let initialState = {}

const middleware = [thunk]
//dev mode
// const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

//prod mode
const store = createStore(reducer, initialState, applyMiddleware(...middleware))

export default store