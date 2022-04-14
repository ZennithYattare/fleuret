import * as stock from '../constants/stockConstants';

export const stockReducer = (state = { stocks: [], stock: {} }, action) => {
    //for CREATE stock
    switch (action.type) {
        case stock.ADD_STOCK_REQUEST:
            return {
                loading: true
            }

        case stock.ADD_STOCK_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                stocks: [...state.stocks, action.payload.stock]
            }

        case stock.ADD_STOCK_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case stock.GET_ALL_STOCK_REQUEST:
            return {
                loading: true
            }

        case stock.GET_ALL_STOCK_SUCCESS:
            return {
                ...state,
                loading: false,
                stocks: action.payload.stocks
            }

        case stock.GET_ALL_STOCK_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case stock.STOCK_DETAILS_REQUEST:
            return {
                loading: true
            }

        case stock.STOCK_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                stock: action.payload.stock
            }

        case stock.STOCK_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case stock.DELETE_STOCK_REQUEST:
            return {
                loading: true
            }

        case stock.DELETE_STOCK_SUCCESS:
            return {
                ...state,
                loading: false,
                stocks: state.stocks.filter(stock => stock._id !== action.payload)
            }

        case stock.DELETE_STOCK_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case stock.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}