import axios from 'axios'
import * as order from './../constants/orderConstants'

export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({
            type: order.ALL_ORDERS_REQUEST
        })

        const { data } = await axios.get(`/api/v1/orders`);

        dispatch({
            type: order.ALL_ORDERS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: order.ALL_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getMyOrders = () => async (dispatch) => {
    try {
        dispatch({
            type: order.MY_ORDERS_REQUEST
        })

        const { data } = await axios.get(`/api/v1/me/orders`);

        dispatch({
            type: order.MY_ORDERS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: order.MY_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getSingleOrder = (id) => async (dispatch) => {
    try {
        dispatch({
            type: order.ORDER_DETAILS_REQUEST
        })

        const { data } = await axios.get(`/api/v1/order/${id}`);

        dispatch({
            type: order.ORDER_DETAILS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: order.ORDER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch({
            type: order.CREATE_ORDER_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/order/new`, order, config);

        dispatch({
            type: order.CREATE_ORDER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: order.CREATE_ORDER_FAIL,
            payload: error
        })
    }
}

export const updateOrder = (id) => async (dispatch) => {
    try {
        dispatch({
            type: order.UPDATE_ORDER_REQUEST
        })

        const { data } = await axios.put(`/api/v1/order/${id}`);

        dispatch({
            type: order.UPDATE_ORDER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: order.UPDATE_ORDER_FAIL,
            payload: error
        })
    }
}

export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({
            type: order.DELETE_ORDER_REQUEST
        })

        const { data } = await axios.delete(`/api/v1/order/${id}`);

        dispatch({
            type: order.DELETE_ORDER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: order.DELETE_ORDER_FAIL,
            payload: error
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: order.CLEAR_ERRORS
    })
}