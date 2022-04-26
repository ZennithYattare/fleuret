import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { useAlert } from "react-alert"
import { Button, Form } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { formatDate } from "../../formatDate"
import { MDBDataTableV5 } from 'mdbreact'
import dateFormat from 'dateformat'
import Sidebar from '../admin/Sidebar';
import Metadata from '../layout/Metadata'

const AdminOrderForm = () => {

    const { id } = useParams()
    const [order, setOrder] = useState()

    const navigate = useNavigate()
    const alert = useAlert()

    const widthStyle = {
        width: '95%',
        textAlign: 'center'
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/api/v1/order/${id}`)
            if (data.success) {
                setOrder(data.order)
            }
        }
        fetchData()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        const { data } = await axios.put(`/api/v1/order/${id}`, order)

        if (data.success) {
            // const { data } = await axios.delete(`/stocks/remove/${id}`)
            navigate("/admin/orders")
            alert.success(`Order ${order._id} status updated`)
        }
    }

    const setHistory = () => {
        const data = {
            //width === 1000
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    width: 80
                },
                {
                    label: 'Description',
                    field: 'description',
                    width: 80,
                },
                {
                    label: 'Status',
                    field: 'status',
                    width: 80,
                },
                {
                    label: 'Updated by',
                    field: 'updated',
                    width: 80,
                },
            ],
            rows: []
        }

        order.order_history && order.order_history.forEach(history => {
            data.rows.push({
                date: dateFormat(history.date, "mmm dS, yyyy, h:MM TT"),
                description: history.description,
                status: history.status,
                updated: history.updated_by
            })
        })
        return data
    }

    return (

        order ?
            <Fragment>
                <Metadata title={'Update Order'} />
                <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>

                    <div className="col-12 col-md-10">
                        <Fragment>
                            <Form className="container" onSubmit={submitHandler}>
                                <div className="row d-flex justify-content-around">
                                    <div className="col-12 col-lg-5 order-details">

                                        <h2 className="my-5">Order # {order._id}</h2>

                                        <h4 className="mb-4">Shipping Info</h4>
                                        <p><b>Name:</b> {order.user.first_name} {order.user.last_name}</p>
                                        <p><b>Phone:</b> {order.user.contact_number ? order.user.contact_number : ''}</p>
                                        <p><b>Email:</b> {order.user.email}</p>
                                        <p className="mb-4"><b>Address:</b>
                                            <p style={{marginLeft: '40px'}}>
                                                {order.address.street} 
                                                <br/>
                                                {order.address.zipCode} {order.address.municipality}
                                                <br/>
                                                {order.address.province}
                                                <br/>
                                            </p>
                                            </p>
                                        <p><b>Landmark:</b> {order.address.landmark}</p>
                                        <p><b>Amount:</b> Php {order.total_price}</p>

                                        <p><b>Mode of Payment:</b> Cash on Delivery</p>

                                        <hr />

                                        {/* <h4 className="my-4">Payment</h4>
                                        <p className="greenColor" ><b>PAID</b></p> */}

                                        <h4 className="my-4">Order Status:</h4>
                                        <p className={order.status && String(order.status).includes('Delivered')
                    ? "greenColor" : "redColor"} ><b>{order.status}</b></p>

                                        <hr />

                                        <h4 className="my-4">Ordered Items:</h4>
                                        <p>Message to include: {order.message}</p>
                                        {order.products && order.products.map(product => ( 
                                            <div className="row my-5"> 
                                                <div className="col-4 col-lg-2">
                                                    <img src={product.product.images[0].path} height="45" width="65" />
                                                </div>

                                                <div className="col-5 col-lg-5">
                                                    <Link id="removeBlue" to={`/products/${product.product._id}`}>{product.product.name}</Link>
                                                </div>

                                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                    <p>Php {product.product.price}</p>
                                                </div>

                                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                    <p>{product.quantity} Piece(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                        <hr />
                                    </div>
                        
                                    <div className="col-12 col-lg-5 mt-5" >
                                        <h4 className="mt-4">Deliver By</h4>
                                        <p><b> {formatDate(order.delivery_date)}</b></p>

                                        <h4 className="mt-4">Delivery Mode</h4>
                                        <p><b> {order.delivery_mode}</b></p>

                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select value={order?.status} defaultChecked={order.status} onChange={(e) => setOrder({ ...order, status: e.target.value })}>
                                                <option value="Order Placed">Order Placed</option>
                                                <option value="Processing">Processing</option>
                                                <option value={order.delivery_mode === 'Pickup' ? 'Ready for Pickup' : 'Shipped'}>{order.delivery_mode === 'Pickup' ? 'Ready for Pickup' : 'Shipped'}</option>
                                                <option value="Delivered">Delivered</option>
                                                {order?.status === 'Delivered' ? "" : <option value="Cancelled">Cancelled</option>}
                                                <option value="Return/Refund">Return/Refund</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Remarks</Form.Label>
                                            <textarea placeholder="Enter remarks" value={order.description} className="form-control" id="description_field" onChange={(e) => setOrder({ ...order, description: e.target.value })} rows="4" required></textarea>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            {id ? 'Update' : 'Submit'}
                                        </Button>
                                        
                                        <p></p>
                                        <h4>Order history</h4>
                                        
                                        <div style={widthStyle}>
                                            <MDBDataTableV5
                                                hover
                                                entriesOptions={[3]}
                                                entries={3}
                                                pagesAmount={3}
                                                data={setHistory()}
                                                searchBottom={false}
                                                noBottomColumns={false}
                                                bordered
                                                striped
                                                fullPagination
                                                />
                                        </div>
                                    </div>
                                </div>
                            </Form>                            
                        </Fragment>
                    </div>
                </div>
            </Fragment >
            : <>Loading</>
    )
}

export default AdminOrderForm