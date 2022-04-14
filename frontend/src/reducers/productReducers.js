import * as product from '../constants/productConstants';

export const productReducer = (state = { products: [], product: {} }, action) => {
    //for CREATE product
    switch (action.type) {
        case product.ADD_PRODUCT_REQUEST:
            return {
                loading: true
            }

        case product.ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                products: [...state.products, action.payload.product]
            }

        case product.ADD_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case product.GET_ALL_PRODUCT_REQUEST:
            return {
                loading: true
            }

        case product.GET_ALL_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.products
            }

        case product.GET_ALL_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case product.PRODUCT_DETAILS_REQUEST:
            return {
                loading: true
            }

        case product.PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload.product
            }

        case product.PRODUCT_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case product.DELETE_PRODUCT_REQUEST:
            return {
                loading: true
            }

        case product.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.filter(product => product._id !== action.payload)
            }

        case product.DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case product.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}