import axios from 'axios';
import * as stock from '../constants/stockConstants';


export const createProduct = (stock) => async (dispatch) => {
    try {
        dispatch({
            type: stock.ADD_STOCK_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/new/stock', stock, config);
        
        dispatch({
            type: stock.ADD_STOCK_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: stock.ADD_STOCK_FAIL,
            payload: error
        })
    }
}

export const getAllStocks = () => async (dispatch) => {
    try {
        dispatch({
            type: stock.GET_ALL_STOCK_REQUEST
        })

        const { data } = await axios.get(`/api/v1/stocks`);

        dispatch({
            type: stock.GET_ALL_STOCK_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: stock.GET_ALL_STOCK_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getSingleStock = (id) => async (dispatch) => {
    try {
        dispatch({
            type: stock.STOCK_DETAILS_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.get(`/api/v1/stock/${id}`, config);
        dispatch({
            type: stock.STOCK_DETAILS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: stock.STOCK_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: stock.CLEAR_ERRORS
    })
}

export const deleteStock = (id) => async (dispatch) => {
    try {
        dispatch({
            type: stock.DELETE_STOCK_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.delete(`/api/v1/stock/${id}`, config);

        dispatch({
            type: stock.DELETE_STOCK_SUCCESS,
            payload: id
        })

    } catch (error) {
        dispatch({
            type: stock.DELETE_STOCK_FAIL,
            payload: error
        })
    }
}