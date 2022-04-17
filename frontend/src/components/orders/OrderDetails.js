import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import { Modal } from "react-bootstrap";
import Metadata from "../layout/Metadata";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const alert = useAlert();
    const [order, setOrder] = useState();
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);

    const [total, setTotal] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/api/v1/order/${id}`);
            if (data.success) {
                setOrder(data.order);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (success) {
            navigate("/me/orders");
            alert.success(`Order ${order._id} has been cancelled.`);
        }
    }, [success]);

    useEffect(() => {
        if (order?.total_price) {
            switch (order.delivery_mode) {
                case "Pickup":
                    setTotal(Number(order.total_price));
                    break;
                case "Standard":
                    setTotal(Number(order.total_price) - 80);
                    break;

                case "Express":
                    setTotal(Number(order.total_price) - 250);
                    break;

                default:
                    setTotal(Number(order.total_price));
            }
        }
    }, [order]);

    console.log(total);

    const cancelOrder = async (id, order) => {
        try {
            await axios.put(
                `/api/v1/order/${id}`,
                { ...order, status: "Cancelled" },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            setSuccess(true)
        } catch (error) {
            setSuccess(false)
            alert.error("Cannot cancel order")
        }
    };

    return order ? (
        <Fragment>
            <div className="container mt-5 mb-5">
                <div className="row d-flex justify-content-center">
                <Metadata title={'Invoice'}/>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="invoice p-5">
                                <h4 className="text-center">INVOICE</h4>
                                <h5 className="text-center">Order ID: {order._id}</h5>

                                <hr />
                                <span className="font-weight-bold d-block mt-4"></span>
                                <p>
                                    Name: {order.user.first_name} {order.user.last_name}
                                </p>
                                {order.delivery_mode === 'Pickup' ?
                                    ''
                                    : <p>
                                        Address: {order.address.street}, {order.address.municipality},{" "}
                                        {order.address.province}, {order.address.zipCode},{" "}
                                        {order.address.landmark}{" "}
                                    </p>}

                                <div className="payment border-top mt-3 mb-3 border-bottom table-responsive">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="py-2">
                                                        {" "}
                                                        <span className="d-block text-muted">
                                                            Order Date
                            </span>{" "}
                                                        <span>
                                                            {dateFormat(order.order_date, "mmm dS, yyyy")}
                                                        </span>{" "}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="py-2">
                                                        {" "}
                                                        <span className="d-block text-muted">
                                                            Delivery Mode
                            </span>{" "}
                                                        <span>{order.delivery_mode}</span>{" "}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="py-2">
                                                        {" "}
                                                        {order.delivery_mode === 'Pickup' ?
                                                            <><span className="d-block text-muted">
                                                                Expected Pickup Date
                            </span>{" "}
                                                                <span>
                                                                    {dateFormat(order.delivery_date, "mmm dS, yyyy")}
                                                                </span>{" "}
                                                            </> : <>
                                                                <span className="d-block text-muted">
                                                                    Expected Delivery Date
                            </span>{" "}

                                                                <span>
                                                                    {dateFormat(order.delivery_date, "mmm dS, yyyy")}
                                                                </span>{" "}
                                                            </>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="py-2">
                                                        {" "}
                                                        <span className="d-block text-muted">
                                                            Status
                            </span>{" "}
                                                        <span>{order.status}</span>{" "}

                                                    </div>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {order.delivery_mode === 'Pickup' ? <>

                                    <p className="text-center">You may pick up your order once it is ready at: <br />
                          Blk 7 Lot 6 Pisa Cor Livorno Sts, Amore at Portofino <br />
                          Daang Reyna Almanza Dos, Las Pinas City</p>
                                    <hr />
                                </> : <></>}
                                <div className="product border-bottom table-responsive">
                                    <table className="table table-borderless">
                                        <tbody>
                                            {order.products &&
                                                order.products.map((product) => (
                                                    <tr>
                                                        <td width="20%">
                                                            <img
                                                                src={product.product.images[0].path}
                                                                height="45"
                                                                width="65"
                                                            />
                                                        </td>
                                                        <td width="60%">
                                                            {" "}
                                                            <span className="font-weight-bold">
                                                                Name: {product.product.name}
                                                            </span>
                                                            <div className="product-qty">
                                                                {" "}
                                                                <span className="d-block">
                                                                    Quantity: {product.quantity}
                                                                </span>{" "}
                                                                <span>
                                                                    {
                                                                        <span className="font-weight-bold">
                                                                            {product.product._id}
                                                                        </span>
                                                                    }
                                                                </span>{" "}
                                                            </div>
                                                        </td>
                                                        <td width="20%">
                                                            <div className="text-right">
                                                                {" "}
                                                                <span className="font-weight-bold">
                                                                    ₱{product.product.price}.00
                                </span>{" "}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="col-md-5">
                                        <table className="table table-borderless">
                                            <tbody className="totals">
                                                <tr>
                                                    <td>
                                                        <div className="text-left">
                                                            {" "}
                                                            <span className="text-muted">Subtotal</span>{" "}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-right">
                                                            {" "}
                                                            <span> ₱ {total}.00</span>{" "}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="text-left">
                                                            {" "}
                                                            <span className="text-muted">
                                                                Shipping Fee
                              </span>{" "}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-right">
                                                            {" "}
                                                            <span>
                                                                {" "}
                                ₱{" "}
                                                                {order.delivery_mode === "Pickup"
                                                                    ? "00.00"
                                                                    : order.delivery_mode === "Express"
                                                                        ? "250.00"
                                                                        : "80.00"}
                                                            </span>{" "}
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr className="border-top border-bottom">
                                                    <td>
                                                        <div className="text-left">
                                                            {" "}
                                                            <span className="font-weight-bold">
                                                                Total:{" "}
                                                            </span>{" "}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-right">
                                                            {" "}
                                                            <span className="font-weight-bold">
                                                                {" "}
                                ₱ {order.total_price}.00
                              </span>{" "}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className>
                                                    <td className></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <p>Message: {order.message}</p>
                                <p className="font-weight-bold mb-0 text-center">
                                    Thank you for shopping with us!
                </p>
                                <p className="font-weight-bold mb-0 text-center">
                                    This will serve as an official receipt
                </p>
                            </div>
                            <div className="d-flex justify-content-between p-3">
                                <span>FLEURET PH/TK </span>
                                <span></span> <span>Bespoke dried flower arrangements</span>
                            </div>
                        </div>
                        <div className="container lrow">
                            <div className="row d-flex text-center mt-4">
                                <div className="col-sm" id="lol">
                                    <i class="fa fa-angle-double-left"></i>
                                    <a
                                        href="/me/orders"
                                        className="btn "
                                    >
                                        My Orders
                  </a>
                                </div>

                                <div className="col-sm" id="lol">
                                    <button
                                        className="btn "
                                        data-toggle="modal" onClick={handleShow}
                                        disabled={order.status === "Order Placed" ? false : true}
                                    >
                                        Cancel Order
                  </button>
                                    <Modal show={show} onHide={handleClose} scrollable={true} >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm Cancellation of Order</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            Are you sure you want to cancel this order? This cannot be undone.
                                    </Modal.Body>
                                        <Modal.Footer>
                                            <button
                                                className="btn "
                                                id="backCancel_btn"
                                                onClick={handleClose}
                                            >
                                                Back
                                    </button>
                                            <button
                                                className="btn "
                                                id="orderCancel_btn"
                                                onClick={() => cancelOrder(order._id, order)}
                                                disabled={order.status === "Order Placed" ? false : true}
                                            >
                                                Confirm
                                    </button>



                                        </Modal.Footer>

                                    </Modal>

                                </div>
                                <div className="col-sm" id="lol">
                                    <a
                                        href="/products"
                                        className="btn "
                                    >
                                        Continue Shopping
                  </a>
                                    <i class="fa fa-angle-double-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    ) : (
        <>Loading</>
    );
};

export default OrderDetails;
