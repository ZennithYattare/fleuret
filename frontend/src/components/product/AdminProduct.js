import { Link } from "react-router-dom";
import * as api from '../../api/products';
import { useAlert } from 'react-alert'
import React, { Fragment, useEffect, useState } from 'react'
//import Metadata from '../layout/Metadata';


const AdminProduct = ({ product, deleteProduct }) => {
    const image = {
        height: '280px',
        width: '100%',

    }

    const alert = useAlert()

    const [images, setImages] = useState([])
    const [name, setName] = useState('')
    const [id, setId] = useState('')
    const [isArchived, setIsArchived] = useState('')
    const [clickedArchive, setClickedArchive] = useState(false)
    const [clickedRestore, setClickedRestore] = useState(false)

    useEffect(() => {
        if (product) {
            setImages(product.images)
            setName(product.name)
            setId(product._id)
            setIsArchived(product.isArchived)
        }

        if (clickedArchive) {
            setIsArchived(true)
        }

        if (clickedRestore) {
            setIsArchived(false)
        }
    }, [clickedArchive, clickedRestore])

    const archiveProduct = async (id) => {
        const data = await api.updateProduct(id, { isArchived: true })

        if (data) {
            alert.success('Product has been archived')
            setClickedArchive(true)
            setClickedRestore(false)
        }
    }

    const restoreProduct = async (id) => {
        const data = await api.updateProduct(id, { isArchived: false })

        if (data) {
            alert.success('Product has been restored')
            setClickedArchive(false)
            setClickedRestore(true)
        }
    }


    return (
        <Fragment>
            <div className="col-sm-6 col-md-4">
                <div className="card p-3 rounded">
                    <div className="photo">

                        <img src={images[0]?.path} alt="image of design" className="img-fluid" style={image} />

                    </div>

                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">
                            <h3>{name}</h3>
                        </h5>
                        <hr />

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                                <Link to={`/products/${id}`} id="viewAdmin_btn">
                                    <button type="button" className="btn btn-block">View</button>
                                </Link>
                                <Link to={`/products/edit/${id}`} id="editAdmin_btn">
                                    <button type="button" className="btn btn-block">Edit</button>
                                </Link>
                                {isArchived ? <>
                                    <button id="editAdmin_btn" onClick={() => { restoreProduct(id) }}>Restore</button>
                                    <button type="delete" className="btn btn-block" id="editAdmin_btn" onClick={() => deleteProduct(id)}>Delete</button>
                                </> : <> <button id="editAdmin_btn" onClick={() => { archiveProduct(id) }}>Archive</button>

                                </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AdminProduct;