import { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert'
import { Button, Form } from 'react-bootstrap';
import * as api from '../../api/products';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'

const ProductForm = () => {
    const alert = useAlert()

    const { id } = useParams()

    const navigate = useNavigate()

    //product details
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0
    });

    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        let isMounted = true
        const fetchData = async () => {
            const { success, product } = await api.getSingleProduct(id)
            if (success && isMounted)
                setProduct(product)
            setImages(product.images)
        }
        if (id)
            fetchData()
        return () => isMounted = false;
    }, [id])

    const submitHandler = async (e) => {
        e.preventDefault()

        var formData = new FormData()

        Object.keys(product).forEach(key => {
            formData.set(key, product[key])
        });

        images.map(image => formData.append('images', image))

        if (id) {
            try {
                setLoading(true)
                const data = await api.updateProduct(id, formData)
                if (data.success) {
                    alert.success("Product updated successfully.")
                    navigate('/admin/products/all')
                    setLoading(false)
                } else {
                    setLoading(false)
                    alert.error('Please upload image')
                }
            } catch(error) {
                setLoading(false)
                alert.error(error.response.data.message)
            }
        }
        else {
            try {
                setLoading(true)
                const data = await api.createProduct(formData)
                if (data.success) {
                    alert.success("Product created successfully.")
                    navigate('/admin/stocks')
                    setLoading(false)
                } else {
                    setLoading(false)
                    alert.error('Please upload image')
                }
            } catch(error) {
                setLoading(false)
                alert.error(error.response.data.message)
            }
        }
    }

    return (
        <Fragment>
            <Metadata title={'Create Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group mt-3">
                                    <label for="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        placeholder="Enter product name"
                                        value={product.name}
                                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group mt-3">
                                    <label for="price_field">Price</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control"
                                        placeholder="Enter product price"
                                        value={product.price}
                                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group mt-3">
                                    <label for="description_field">Description</label>
                                    <textarea placeholder="Enter description" value={product.description} className="form-control" id="description_field" onChange={(e) => setProduct({ ...product, description: e.target.value })} rows="8" required></textarea>
                                </div>

                                <div className='form-group mt-3'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            multiple
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={(e) => setImages(Array.from(e.target.files))}
                                        />

                                        <label className='custom-file-label' for='customFile'>
                                            Choose Images   
                                        </label>
                                    </div>

                                    {images
                                        ? images.map(image => (<img src={image.path} alt="Images preview" style={{ height: 'auto', width: '200px' }} />))
                                        : ""
                                    }
                                </div>

                                {/* className="mt-3 mr-2" */}
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3 mt-3"
                                    disabled={loading ? true : false}
                                >
                                    {id ? 'Update' : 'Submit'}
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment >
    )
}

export default ProductForm
