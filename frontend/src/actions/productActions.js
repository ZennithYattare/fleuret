import axios from 'axios';
import * as product from '../constants/productConstants';


export const createProduct = (newProduct) => async (dispatch) => {
    try {
        dispatch({
            type: product.ADD_PRODUCT_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/new/product', newProduct, config);
        
        dispatch({
            type: product.ADD_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: product.ADD_PRODUCT_FAIL,
            payload: error
        })
    }
}

export const getAllProducts = (name) => async (dispatch) => {
    try {
        dispatch({
            type: product.GET_ALL_PRODUCT_REQUEST
        })

        const { data } = await axios.get(`/api/v1/products?name=${name}`);

        dispatch({
            type: product.GET_ALL_PRODUCT_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: product.GET_ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getSingleProduct = (id) => async (dispatch) => {
    try {
        dispatch({
            type: product.PRODUCT_DETAILS_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.get(`/api/v1/product/${id}`, config);
        dispatch({
            type: product.PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: product.PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: product.CLEAR_ERRORS
    })
}

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({
            type: product.DELETE_PRODUCT_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.delete(`/api/v1/product/${id}`, config);

        dispatch({
            type: product.DELETE_PRODUCT_SUCCESS,
            payload: id
        })

    } catch (error) {
        dispatch({
            type: product.DELETE_PRODUCT_FAIL,
            payload: error
        })
    }
}