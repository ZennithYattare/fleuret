import React, { Fragment, useEffect, useState } from "react"
import { formatDate } from "../../formatDate"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAlert } from "react-alert"
import { MDBDataTableV5 } from 'mdbreact'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'
import { Button, Form, Modal } from "react-bootstrap";


const ExpiredStocks = () => {

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
                    label: 'Actions',
                    field: 'actions',
                    width: 100,
                    sort: 'disabled'
                }
            ],
            rows: []
        }



        stockList && stockList.forEach(stock => {
            if (stock.isExpired && !stock.isArchived) {
                data.rows.push({
                    id: stock._id,
                    name: stock.product?.name,
                    supplier: stock.supplier_name,
                    supp_contact: stock.supplier_contact_number,
                    selling: stock.product?.price,
                    acquired: stock.dealers_price,
                    expiry: formatDate(stock.expiry_date),
                    actions:
                    <div className="btn-group" role="group">
                    <button
                      className="btn fa-solid fa-box-archive fa-xl"
                      title="Archive Stock"
                      onClick={() => {
                        setStockID(stock._id);
                        handleShow();
                      }}
                    ></button>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Archive Stock</Modal.Title>
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
                          variant="danger"
                          onClick={() => {
                            handleClose();
                            archiveStock(stockID);
                          }}
                        >
                          Archive
                        </Button>
                      </Modal.Footer>
                    </Modal>
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
                    <h1 className="my-4">Expired Stocks</h1>
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

export default ExpiredStocks