import * as order from '../constants/orderConstants';

export const ordersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case order.ALL_ORDERS_REQUEST:
        case order.MY_ORDERS_REQUEST:
            return {
                loading: true
            }

        case order.ALL_ORDERS_SUCCESS:
        case order.MY_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.orders,
                sales: action.payload.sales
            }

        case order.ALL_ORDERS_FAIL:
        case order.MY_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case order.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const orderReducer = (state = { orders: [], order: {} }, action) => {
    switch (action.type) {
        case order.ORDER_DETAILS_REQUEST:
            return {
                loading: true,
                order: {}
            }

        case order.ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                order: action.payload.order
            }

        case order.ORDER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case order.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}


export const newOrderReducer = (state = { orders: [], order: {} }, action) => {
    switch (action.type) {
        case order.CREATE_ORDER_REQUEST:
            return {
                loading: true
            }

        case order.CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                success: action.payload.success
            }

        case order.CREATE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case order.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const orderOperationsReducer = (state = { orders: [], order: {} }, action) => {
    switch (action.type) {
        case order.DELETE_ORDER_REQUEST:
            return {
                loading: true
            }

        case order.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success
            }

        case order.DELETE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case order.UPDATE_ORDER_REQUEST:
            return {
                loading: true
            }

        case order.UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                order: action.payload.order
            }

        case order.UPDATE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case order.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}