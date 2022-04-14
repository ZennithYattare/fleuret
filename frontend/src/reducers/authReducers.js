import * as auth from '../constants/authConstants'

export const authReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case auth.LOGIN_REQUEST:
        case auth.LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false
            }

        case auth.LOGIN_SUCCESS:
        case auth.LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload
            }

        case auth.LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated: false,
                user: null
            }

        case auth.LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                loadError: action.payload
            }

        case auth.LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case auth.LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const userReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case auth.CHECKOUT_REQUEST:
        case auth.UPDATE_CART_REQUEST:
        case auth.REGISTER_USER_REQUEST:
        case auth.UPDATE_PASSWORD_REQUEST:
        case auth.UPDATE_USER_REQUEST:
        case auth.DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case auth.REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isCreated: action.payload,
                message: action.payload.message
            }

        case auth.CHECKOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload
            }
            
        case auth.UPDATE_PASSWORD_SUCCESS:
        case auth.UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
        case auth.UPDATE_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }

        case auth.DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }
        case auth.UPDATE_CART_FAILURE:
        case auth.REGISTER_USER_FAIL:
        case auth.UPDATE_PASSWORD_FAIL:
        case auth.UPDATE_USER_FAIL:
        case auth.DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case auth.REGISTER_USER_RESET:
            return {
                ...state,
                loading: false,
                isCreated: false
            }

        case auth.UPDATE_PASSWORD_RESET:
        case auth.UPDATE_USER_RESET:
            return {
                ...state,
                loading: false,
                isUpdated: false
            }

        case auth.DELETE_USER_RESET:
            return {
                ...state,
                loading: false,
                isDeleted: false
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const verifyCustomerReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case auth.SEND_VERIFICATION_REQUEST:
            return {
                ...state,
                loading: true
            }

        case auth.SEND_VERIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                isSent: action.payload
            }

        case auth.SEND_VERIFICATION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const usersReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case auth.ALL_USERS_REQUEST:
            return {
                loading: true
            }

        case auth.ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }

        case auth.ALL_USERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case auth.USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case auth.USER_DETAILS_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                user: action.payload.user
            }

        case auth.USER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

//forgot password and set new password
export const forgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {

        case auth.FORGOT_PASSWORD_REQUEST:
        case auth.NEW_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case auth.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload
            }

        case auth.NEW_PASSWORD_SUCCESS:
            return {
                ...state,
                success: action.payload
            }

        case auth.FORGOT_PASSWORD_FAIL:
        case auth.NEW_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case auth.FORGOT_PASSWORD_RESET:
            return {
                loading: false
            }

        case auth.NEW_PASSWORD_RESET:
            return {
                ...state,
                loading: false
            }

        case auth.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}