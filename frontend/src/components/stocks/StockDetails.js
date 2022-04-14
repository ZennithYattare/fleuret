import React, { Fragment, useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate } from "../../formatDate"
import axios from 'axios'
import Sidebar from '../admin/Sidebar';

const StockDetails = () => {

    const [stockDetails, setStockDetails] = useState({})
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const alert = useAlert()
    const { id } = useParams()

    useEffect(() => {
        let isMounted = true
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const fetchData = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`/api/v1/stock/${id}`, config)

                if (data.success && isMounted) {
                    setStockDetails(data.stock)
                    setLoading(false)
                }
            }
            catch (error) {
                alert.error('no stock found')
                navigate('/admin/stocks')
            }
        }
        fetchData()
        return () => isMounted = false
    }, [])

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Stock Details</h1>
                    <div>
                        {loading ? <h1>Loading...</h1> : (
                            <>
                                <p>stock ID: {stockDetails._id}</p>
                                <p>reference ID: {stockDetails.refID ? stockDetails.refID : 'none'}</p>
                                <p>supplier name: {stockDetails.supplier_name}</p>
                                <p>supplier contact: {stockDetails.supplier_contact_number}</p>
                                <p>dealers price: {stockDetails.dealers_price}</p>
                                <p>initial date: {formatDate(stockDetails.initial_date)}</p>
                                <p>expiry date: {formatDate(stockDetails.expiry_date)}</p>
                                <p>isArchived: {stockDetails.isArchived ? 'true' : 'false'}</p>
                                <p>isExpired: {stockDetails.isExpired ? 'true' : 'false'}</p>
                                <p>isSold: {stockDetails.isSold ? 'true' : 'false'}</p>
                                <p>productID: {stockDetails.product._id}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default StockDetails
