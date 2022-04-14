import axios from 'axios';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const multiformdata = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}

export const getAllProducts = async () => {
    try {
        const { data } = await axios.get('/api/v1/products', config)
        return data
    }
    catch (error) {
        return error
    }
}

export const getSingleProduct = async (id) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`, config)
        return data
    }
    catch (error) {
        return error
    }
}

export const deleteProduct = async (id) => {
    try {
        const { data } = await axios.delete(`/api/v1/product/${id}`, config)
        return data
    }
    catch (error) {
        return error
    }
}

export const createProduct = async (product) => {
    try {
        const { data } = await axios.post(`/api/v1/new/product`, product, multiformdata)
        return data
    }
    catch (error) {
        return error
    }


}

export const updateProduct = async (id, product) => {
    try {
        const { data } = await axios.put(`/api/v1/product/${id}`, product, config)
        return data
    }
    catch (error) {
        return error
    }
}

export const archiveProduct = async (id) => {
    try {
        const { data } = await axios.put(`/api/v1/product/archive/${id}`, {}, config)
        return data
    }
    catch (error) {
        return error
    }
}

