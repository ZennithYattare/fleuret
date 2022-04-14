import * as cart from '../constants/cartConstants'

const cartReducer = (state, action) => {

    switch (action.type) {
        case cart.REQUEST:
            return { ...state, loading: true }
        case cart.ADD_TO_CART:
            return { ...state, loading: true, cart: [...state.cart, action.payload] }
        case cart.SUCCESS:
            return { ...state, loading: false }
        case cart.FAIL:
            return { ...state, loading: false, error: action.payload }
        case cart.GET_USER_CART:
            return { ...state, cart: action.payload }
        default:
            return state
    }

}

export default cartReducer