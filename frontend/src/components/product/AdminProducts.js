import React, { Fragment, useEffect, useState } from 'react';
import * as api from '../../api/products';
import { useDispatch, useSelector } from "react-redux"
import { MDBDataTableV5 } from 'mdbreact'
import { Link, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata';

const AdminProducts = () => {
    const [name, setName] = useState("")
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([])
    const imageStyle = {
        height: '180px',
        width: 'auto',
    }
    const widthStyle = {
        width: '95%',
        textAlign: 'center'
    }
    const divTest = {
        marginRight: '5px',
        marginLeft: '5px'
    }
    
    const { archived } = useParams()
    const alert = useAlert()

    useEffect(() => {
        const fetchData = async () => {
            const { products } = await api.getAllProducts()
            setProducts(products)
            setFilteredProducts(products)
        }
        fetchData()
    }, [alert])

    const setProductData = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Product ID',
                    field: 'id',
                    width: 500
                },
                {
                    label: 'Product Name',
                    field: 'name',
                    width: 100
                },
                {
                    label: 'Image',
                    field: 'image',
                    width: 250,
                    sort: 'disabled'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 150,
                    sort: 'disabled'
                }
            ],
            rows: []
        }

        filteredProducts && filteredProducts.forEach(product => {
            if(!product.isArchived) {
                data.rows.push({
                    id: product._id,
                    name: product.name,
                    image: <img src={product.images[0].path} style={imageStyle}/>,
                    actions: <div className="btn-group" role="group">
                        {/* id="viewAdmin_btn" */}
                        <Link className="btn" to={`/products/${product._id}`}>
                            <i  className="fa-regular fa-eye fa-xl" title="View Product"></i>
                        </Link>
                        <div style={divTest}></div>
                        {/* id="editAdmin_btn" */}
                        <Link className="btn" to={`/products/edit/${product._id}`} >
                            <i className="fa-solid fa-pen-to-square fa-xl" title="Edit Product"></i>
                        </Link>
                        <div style={divTest}></div>
                        <button className="btn fa-solid fa-box-archive fa-xl" title="Archive Product" onClick={() => { archiveProduct(product._id) }}></button>
                    </div>
                })
            }
        })

        return data
    }

    const archiveProduct = (id) => {
        api.archiveProduct(id)
        alert.success('Product has been archived')
        setFilteredProducts(products.filter(product => product._id !== id))
        setProducts(products.filter(product => product._id !== id))
    }

    return (
        <Fragment>
        <Metadata title={'All Products'} />
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h1 className="my-4">Products</h1>
                <div style={widthStyle}>
                    <MDBDataTableV5
                        hover
                        entriesOptions={[10, 20]}
                        entries={10}
                        pagesAmount={4}
                        data={setProductData()}
                        searchTop
                        searchBottom={false}
                        noBottomColumns={false}
                        striped
                    />
                </div>
            </div>
            </div>
        </Fragment>
    )
}

export default AdminProducts