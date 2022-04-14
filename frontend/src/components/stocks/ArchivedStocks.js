import React, { Fragment, useEffect, useState } from "react"
import { formatDate } from "../../formatDate"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAlert } from "react-alert"
import { MDBDataTableV5 } from 'mdbreact'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'

const ArchivedStocks = () => {

    const [stockList, setStockList] = useState([])
    const widthStyle = {
        width: '95%',
        textAlign: 'center'
    }
    const divTest = {
        marginRight: '5px',
        marginLeft: '5px'
    }

    useEffect(() => {
        let isMounted = true
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const fetchData = async () => {
            const { data } = await axios.get('/api/v1/stocks/archived', config)

            if (data.success && isMounted) {
                setStockList(data.stocks)
            }
        }
        fetchData()
        return () => isMounted = false
    }, [])


    const alert = useAlert()

    const restoreStock = async id => {
        try {
            const { data } = await axios.put(`/api/v1/stock/archive/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (data.success) {
                alert.success("Stock restored")
                setStockList(stockList.filter(stock => stock._id !== id))
            }
        } catch (error) {
            alert.error(error.response.data.message)
        }
    }

    const deleteStock = async id => {
        try {
            const { data } = await axios.delete(`/api/v1/stock/${id}`)

            if (data.success) {
                alert.success("Stock deleted")
                setStockList(stockList.filter(stock => stock._id !== id))
            }
        } catch (error) {
            alert.error(error.response.data.message)
        }
    }

    const setStockArchivedData = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Stock ID',
                    field: 'id',
                    width: 200
                },
                {
                    label: 'Product Name',
                    field: 'name',
                    width: 100,
                },
                {
                    label: 'Supplier Name',
                    field: 'supplier',
                    width: 100
                },
                {
                    label: 'Contact Number',
                    field: 'supp_contact',
                    width: 100
                },
                {
                    label: 'Selling Price',
                    field: 'selling',
                    width: 100,
                },
                {
                    label: 'Acquired Price',
                    field: 'acquired',
                    width: 100,
                },
                {
                    label: 'Expiry Date',
                    field: 'expiry',
                    width: 100
                },
                {
                    label: 'Expired',
                    field: 'expired',
                    width: 50
                },
                {
                    label: 'Sold',
                    field: 'sold',
                    width: 50
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 100,
                    sort: 'disabled'
                }
            ],
            rows: []
        }

        stockList && stockList.forEach(stock => {
            if (stock.isArchived || stock.autoArchive) {
                data.rows.push({
                    id: stock._id,
                    name: stock.product?.name,
                    supplier: stock.supplier_name,
                    supp_contact: stock.supplier_contact_number,
                    selling: stock.product?.price,
                    acquired: stock.dealers_price,
                    expiry: formatDate(stock.expiry_date),
                    expired: stock.isExpired
                        ? <p style={{ color: 'red' }}>Yes</p>
                        : <p style={{ color: 'green' }}>No</p>,
                    sold: stock.isSold
                        ? <p style={{ color: 'green' }}>Sold</p>
                        : <p style={{ color: 'red' }}>False</p>,
                    actions:
                        <div className="btn-group" role="group">
                            {/* <Link to={`/admin/stock/${stock._id}`} className="btn">
                                <i class="fa-regular fa-eye fa-xl" title="View Stock"></i>
                            </Link> */}
                            {/* <div style={divTest}></div> */}
                            <button className="btn fa-solid fa-arrow-rotate-left fa-xl" title="Restore Stock" onClick={() => restoreStock(stock._id)}></button>
                            <button className='btn fa-solid fa-trash fa-xl' title="Delete Stock" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Warning!</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div class="modal-body" style={{textAlign: 'justify'}}>
                                            <b>Are you sure you want to delete this stock?</b>
                                            <br></br>
                                            This action cannot be undone.
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteStock(stock._id)}>Delete</button>
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
    return (
        <Fragment>
            <Metadata title={'Archived Stocks'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Archived Stocks</h1>
                    <div style={widthStyle}>
                        <MDBDataTableV5
                            hover
                            entriesOptions={[10, 15, 20, 25]}
                            entries={10}
                            pagesAmount={4}
                            data={setStockArchivedData()}
                            searchTop
                            searchBottom={false}
                            noBottomColumns={false}
                            bordered
                            fullPagination
                            striped />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ArchivedStocks