import React, { Fragment, useEffect, useState } from "react"
import { formatDate } from "../../formatDate"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAlert } from "react-alert"
import { MDBDataTableV5 } from 'mdbreact'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'
import { Button, Form, Modal } from "react-bootstrap";

const SoldStocks = () => {

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
            const { data } = await axios.get("/api/v1/stocks", config);

            if (data.success && isMounted) {
                setStockList(data.stocks)
            }
        }
        fetchData()
        return () => isMounted = false
    }, [])

    const archiveStock = async (id) => {
        try {
          const { data } = await axios.put(
            `/api/v1/stock/archive/${id}`,
            {
              archiveReason: "Old Record"
            },
            {
              "Content-Type": "application/json",
            }
          );
          if (data.success) {
            alert.success("Stock moved to archive");
            setStockList(stockList.filter((stock) => stock._id !== id));
          }
        } catch (error) {
          alert.error(error.response.data.message);
        }
      };


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
    const [stockID, setStockID] = useState('')
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    label: 'Acquired',
                    field: 'acquired',
                    width: 100,
                },
                {
                    label: 'Expiry Date',
                    field: 'expiry',
                    width: 100
                },
                {
                    label: 'Date Sold',
                    field: 'dateSold',
                    width: 100,
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
            if (stock.isSold && !stock.isArchived) {
                data.rows.push({
                    id: stock._id,
                    name: stock.product?.name,
                    supplier: stock.supplier_name,
                    supp_contact: stock.supplier_contact_number,
                    selling: stock.product?.price,
                    acquired: stock.dealers_price,
                    expiry: formatDate(stock.expiry_date),
                    dateSold: formatDate(stock?.dateSold || new Date()),
                    actions:
                    <div className="btn-group" role="group">
                    {/* <button
                      className="btn fa-solid fa-box-archive fa-xl"
                      title="Archive Stock"
                      onClick={() => {
                        setStockID(stock._id);
                        handleShow();
                      }}
                    ></button>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Select Reason</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Are you sure you want to archive this stock?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setStockID('');
                            handleClose();
                          }}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleClose();
                            archiveStock(stockID);
                          }}
                        >
                          Archive
                        </Button>
                      </Modal.Footer>
                    </Modal> */}
                    <button className='btn fa-solid fa-box-archive fa-xl' title="Archive Stock" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                        setStockID(stock._id);
                      }}></button>
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Archive Stock</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body" style={{textAlign: 'justify'}}>
                                  <b>Are you sure you want to archive this stock?</b>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {archiveStock(stockID);}}>Archive</button>
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
                    <h1 className="my-4">Sold Stocks</h1>
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
                            fullPagination
                            striped 
                            scrollX/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SoldStocks