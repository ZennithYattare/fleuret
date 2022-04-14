import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert'
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../api/products';
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'

const CreateStocks = () => {

    const [stock, setStock] = useState({})
    const [products, setProducts] = useState([])

    const alert = useAlert()
    const navigate = useNavigate()

    const changeHandler = (e) => {
        setStock({ ...stock, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        let isMounted = true
        const fetchData = async () => {
            const { products } = await api.getAllProducts()
            if (products && isMounted) {
                setProducts(products)
            }
        }
        fetchData()
        return () => isMounted = false
    }, [])


    const submitHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/new/stock', stock, config)

        if (data.success) {
            alert.success("Stock Created")
            navigate('/admin/stocks')
        }
        else {
            alert.error("Something went wrong")
        }
    }

    return (

        products
            ? <Fragment>
                <Metadata title={'Create Stocks'} />
                <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>

                    <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <Form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-4">New Stocks</h1>
                                <Form.Group className="mb-3" controlId="formBasicEmail" >
                                    <Form.Label>Product</Form.Label>
                                    <Form.Select name="product" value={stock.product} onChange={changeHandler}>
                                        <option selected>-</option>
                                        {products && products.map(product => (
                                            <option value={product._id}>{product.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type="number" name="quantity" value={stock.quantity} placeholder="Quantity" min="0" max="100" onChange={changeHandler} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Supplier Name</Form.Label>
                                    <Form.Control type="text" name="supplier_name" value={stock.supplier_name} placeholder="Supplier name" onChange={changeHandler} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Supplier Contact Number</Form.Label>

                                    <Form.Control type="tel" name="supplier_contact_number" value={stock.supplier_contact_number} placeholder="Contact number" onChange={changeHandler} maxLength="11" />
                                    <small id="formatValidation">Example: 09123456789 or 81237654</small>
                                    <br></br>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Dealer's Price</Form.Label>
                                    <Form.Control type="number" name="dealers_price" value={stock.dealers_price} placeholder="Dealer's price" onChange={changeHandler} min="0" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </Fragment>
                    </div>
                </div>
            </Fragment>
            : <>Loading</>
    )
}

export default CreateStocks