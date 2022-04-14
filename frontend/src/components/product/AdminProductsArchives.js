import React, { Fragment, useEffect, useState } from 'react';
import * as api from '../../api/products';
import { useDispatch, useSelector } from "react-redux"
import { MDBDataTableV5 } from 'mdbreact'
import { useAlert } from 'react-alert'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata';


const AdminProductsArchives = () => {
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
                    label: 'Product name',
                    field: 'name',
                    width: 100,
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
            if (product.isArchived) {
                data.rows.push({
                    id: product._id,
                    name: product.name,
                    image: <img src={product.images[0].path} style={imageStyle} />
                    /* {product.images && product.images.map(({ path }) => (
                        <img src={path ? path : "https://res.cloudinary.com/fiorexwebapp/image/upload/v1647319381/annie-spratt-0cAlNigDa8Q-unsplash_2_vqmmhs.jpg"} alt="Image of Design" className="img-fluid" style={image} />
                    ))} */
                    ,
                    actions: 
                    <div className="btn-group">
                        <button className="btn fa-solid fa-arrow-rotate-left fa-xl" title="Restore Product" style={divTest} onClick={() => { restoreProduct(product._id) }}></button>

                        <button className='btn fa-solid fa-trash fa-xl' title="Delete Stock" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Warning!</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div class="modal-body" style={{textAlign: 'justify'}}>
                                        <b>Are you sure you want to delete this product?</b>
                                        <br></br>
                                        This action cannot be undone.
                                    </div>

                                    <div class="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteProduct(product._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }
        })

        return data
    }

    const restoreProduct = (id) => {
        api.archiveProduct(id)
        alert.success('Product has been restored')
        setFilteredProducts(products.filter(product => product._id !== id))
        setProducts(products.filter(product => product._id !== id))
    }

    const deleteProduct = (id) => {
        api.deleteProduct(id)
        alert.success('Product has been deleted')
        setFilteredProducts(products.filter(product => product._id !== id))
        setProducts(products.filter(product => product._id !== id))
    }

    return (
        <Fragment>
            <Metadata title={'Archived Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Archived Products</h1>
                    <div style={widthStyle}>
                        <MDBDataTableV5
                            hover
                            entriesOptions={[10, 15]}
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

export default AdminProductsArchives