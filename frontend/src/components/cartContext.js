import { createContext, useEffect, useReducer } from "react";
import cartReducer from '../reducers/cartReducer'
import axios from 'axios'
import * as cartConstant from '../constants/cartConstants'
import { useSelector } from 'react-redux';

const CartContext = createContext({})


export const CartContextProvider = (props) => {

    const { isAuthenticated } = useSelector(state => state.auth)

    const [cart, dispatch] = useReducer(cartReducer, {
        cart: [],
        loading: false,
        error: null
    })

    const fetchData = async () => {
        try {
            if (isAuthenticated) {
                dispatch({ type: cartConstant.REQUEST })
                const { data } = await axios.get('/api/v1/carts')
                dispatch({ type: cartConstant.GET_USER_CART, payload: data.cart.products })
                dispatch({ type: cartConstant.SUCCESS })
            } else {
                let cart = JSON.parse(localStorage.getItem('cart')) || []
                dispatch({ type: cartConstant.GET_USER_CART, payload: cart })
            }
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }

    const addCartToUser = async () => {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || []

            dispatch({ type: cartConstant.REQUEST })
            const { data } = await axios.put('/api/v1/carts/add', { products: cart })
            dispatch({ type: cartConstant.GET_USER_CART, payload: data.cart.products })
            dispatch({ type: cartConstant.SUCCESS })
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }

    const addToCart = async (product, quantity) => {
        const { _id: id } = product
        try {
            if (isAuthenticated) {
                dispatch({ type: cartConstant.REQUEST })
                const { data } = await axios.put(`/api/v1/carts/add/${id}`, { quantity: quantity })
                dispatch({ type: cartConstant.GET_USER_CART, payload: data.cart.products })
                dispatch({ type: cartConstant.SUCCESS })
            }
            else {
                let newProduct = { product, quantity }
                let newCart = [...cart.cart, newProduct]
                localStorage.setItem('cart', JSON.stringify(newCart))
                dispatch({ type: cartConstant.ADD_TO_CART, payload: newProduct })
            }
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }

    const removeFromCart = async (id) => {
        try {
            if (isAuthenticated) {
                dispatch({ type: cartConstant.REQUEST })
                const { data } = await axios.put(`/api/v1/carts/remove/${id}`)
                dispatch({ type: cartConstant.GET_USER_CART, payload: data.cart.products })
                dispatch({ type: cartConstant.SUCCESS })
            } else {
                let newCart = cart.cart.filter(item => item.product._id.toString() !== id)
                localStorage.setItem('cart', JSON.stringify(newCart))
                dispatch({ type: cartConstant.GET_USER_CART, payload: newCart })
            }
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }

    const removeAllFromCart = async () => {
        try {
            if (isAuthenticated) {
                dispatch({ type: cartConstant.REQUEST })
                const { data } = await axios.put('/api/v1/carts', { products: [] })
                dispatch({ type: cartConstant.GET_USER_CART, payload: [] })
                dispatch({ type: cartConstant.SUCCESS })
                localStorage.removeItem('cart')
            }
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }

    const changeQuantity = async (product, quantity, newCart) => {
        try {
            if (isAuthenticated) {
                dispatch({ type: cartConstant.REQUEST })
                const { data } = await axios.put('/api/v1/carts', { products: newCart })
                dispatch({ type: cartConstant.GET_USER_CART, payload: data.cart.products })
                dispatch({ type: cartConstant.SUCCESS })
            }
            else {
                let updatedCart = cart.cart
                let index = updatedCart.findIndex(cart => cart.product._id.toString() === product._id.toString())
                updatedCart.splice(index, 1, { product, quantity })
                localStorage.setItem('cart', JSON.stringify(updatedCart))
                dispatch({ type: cartConstant.GET_USER_CART, payload: updatedCart })
            }
        }
        catch (error) {
            dispatch({ type: cartConstant.FAIL })
        }
    }
    useEffect(() => {
        if (isAuthenticated) {
            addCartToUser()
        }
    }, [isAuthenticated])


    useEffect(() => {
        fetchData()
        addCartToUser()
    }, [])

    useEffect(() => {
        fetchData()
    }, [isAuthenticated])


    return <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, removeAllFromCart }}>
        {props.children}
    </CartContext.Provider>
}

export default CartContext