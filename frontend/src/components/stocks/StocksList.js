import React, { Fragment, useEffect, useState } from "react";
import { formatDate } from "../../formatDate";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAlert } from "react-alert";
import { MDBDataTableV5 } from "mdbreact";
import Sidebar from "../admin/Sidebar";
import Metadata from "../layout/Metadata";
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';

const StocksList = () => {
  const [stockList, setStockList] = useState([]);
  const widthStyle = {
    width: "95%",
    textAlign: "center",
  };
  const divTest = {
    marginRight: "5px",
    marginLeft: "5px",
  };

  const { loading } = useSelector(state => state.auth)

  const [stockID, setStockID] = useState('')

  const [archiveReason, setArchiveReason] = useState('Damaged')

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    let isMounted = true;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const fetchData = async () => {
      const { data } = await axios.get("/api/v1/stocks", config);

      if (data.success && isMounted) {
        setStockList(data.stocks);
      }
    };
    fetchData();
    return () => (isMounted = false);
  }, []);

  const alert = useAlert();

  const archiveStock = async (id) => {
    try {
      const { data } = await axios.put(
        `/api/v1/stock/archive/${id}`,
        {
          archiveReason
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

  const setStockData = () => {
    const data = {
      //width === 1000
      columns: [
        {
          label: "Stock ID",
          field: "id",
          width: 200,
        },
        {
          label: "Product Name",
          field: "name",
          width: 100,
        },
        {
          label: "Supplier Name",
          field: "supplier",
          width: 100,
        },
        {
          label: "Contact Number",
          field: "supp_contact",
          width: 100,
        },
        {
          label: "Selling Price",
          field: "selling",
          width: 100,
        },
        {
          label: "Acquired Price",
          field: "acquired",
          width: 100,
        },
        {
          label: "Expiry Date",
          field: "expiry",
          width: 150,
        },
        {
          label: "Actions",
          field: "actions",
          width: 100,
          sort: "disabled",
        },
      ],
      rows: [],
    };

    stockList &&
      stockList.forEach((stock) => {
        if (!stock.isArchived && !stock.autoArchive) {
          if (!stock.isExpired && !stock.isSold) {
            data.rows.push({
              id: stock._id,
              name: stock?.product?.name,
              supplier: stock.supplier_name,
              supp_contact: stock.supplier_contact_number,
              selling: stock?.product?.price,
              acquired: stock.dealers_price,
              expiry: formatDate(stock.expiry_date),
              actions: (
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
                      <Form.Select aria-label="Select Reason" onChange={(e) => setArchiveReason(e.target.value)} required>
                        <option value="Damaged">Damaged</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </Form.Select>
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
                  </Modal> */}
                  <button className='btn fa-solid fa-box-archive fa-xl' title="Archive Stock" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                      setStockID(stock._id);
                    }}></button>
                  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Select Reason</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>

                              <div class="modal-body" style={{textAlign: 'justify'}}>
                                <Form.Select aria-label="Select Reason" onChange={(e) => setArchiveReason(e.target.value)} required>
                                  <option value="Damaged">Damaged</option>
                                  <option value="Option 2">Option 2</option>
                                  <option value="Option 3">Option 3</option>
                                </Form.Select>
                              </div>

                              <div class="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => {archiveStock(stockID);}}>Archive</button>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              ),
            });
          }
        }
      });
    return data;
  };

  return (
    <>
    {loading ? <h1>Loading</h1>
    : <>
      <Fragment>
        <Metadata title={"All Stocks"} />
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>

          <div className="col-12 col-md-10">
            <h1 className="my-4">Stocks</h1>
            <div style={widthStyle}>
              <MDBDataTableV5
                hover
                entriesOptions={[20, 30, 40]}
                entries={20}
                pagesAmount={4}
                data={setStockData()}
                searchTop
                searchBottom={false}
                noBottomColumns={false}
                striped
                fullPagination
                scrollX
              />
            </div>
          </div>
        </div>
      </Fragment>
    </>}
    </>
  );
};

export default StocksList;
