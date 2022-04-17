import { useNavigate } from "react-router-dom";
import * as api from "../../api/products";
import { Fragment, useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../actions/orderActions";
import axios from "axios";
import { useAlert } from "react-alert";
import CartContext from "../cartContext";
import Metadata from "../layout/Metadata";

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        //+2 days dapat
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

const OrdersForm = () => {
    const navigate = useNavigate();

    const { cart, removeAllFromCart } = useContext(CartContext);

    var date = (days) =>
        formatDate(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + days)
        );

    const [products, setProducts] = useState(cart.cart);
    const { user, loading } = useSelector((state) => state.auth);
    const [total, setTotal] = useState(0);
    const [order, setOrder] = useState({
        products: [],
        delivery_mode: "",
        address: {},
        total_price: 0,
        delivery_date: date,
        message: "",
    });

    const [delivery_date, setDeliveryDate] = useState(date(4));

    const [delivery, setDelivery] = useState("");

    console.log(delivery_date);
    useEffect(() => {
        var totalAmount = 0;
        if (order.delivery_mode === "Delivery") {
            if (delivery === "Express") {
                setDeliveryDate(date(2));
                totalAmount = 250;
            } else {
                setDeliveryDate(date(4));
                totalAmount = 80;
            }
        } else {
            setDeliveryDate(date(1));
            totalAmount = 0;
        }
        cart.cart.map(
            ({ product, quantity }) => (totalAmount += product.price * quantity)
        );
        setTotal(totalAmount);
        setOrder({ ...order, total_price: totalAmount });
    }, [delivery, order.delivery_mode]);

    useEffect(() => {
        setProducts(cart.cart);
    }, [cart.cart]);

    useEffect(() => {
        if (cart.cart) {
            let totalAmount = 0;
            cart.cart.map(
                ({ product, quantity }) => (totalAmount += product.price * quantity)
            );
            setTotal(totalAmount);
        }
    }, [cart.cart]);

    //seperate states = easier management
    const [address, setAddress] = useState(user.address);

    useEffect(() => {
        if (user) {
            setAddress(user.address);
        }
    }, [loading, user]);

    const alert = useAlert();

    useEffect(() => {
        setOrder((prevOrder) => ({ ...prevOrder, total_price: total }));
    }, [total]);

    useEffect(() => {
        setOrder({ ...order, delivery_date: delivery_date });
    }, [delivery_date]);

    console.log(order.total_price);

    const submitHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            let mode = order.delivery_mode === "Pickup" ? "Pickup" : delivery;
            const { data } = await axios.post(
                `/api/v1/order/new`,
                {
                    ...order,
                    address,
                    products,
                    delivery_mode: mode,
                    total_price: total,
                },
                config
            );
            if (data.success) {
                alert.success("Order placed!");
                removeAllFromCart();
                const refId = data.order._id;

                // for (var i = 0; i < products.length; i++) {
                //     const { quantity, product } = products[i]

                //     const { data } = await axios.put(`/api/v1/stocks/remove/${product._id}`, {
                //         quantity,
                //         refId,
                //     }, config)
                // }

                products.map(({ product, quantity }) => {
                    console.log(product, quantity)
                    const { data } = axios.put(`/api/v1/stocks/remove/${product._id}`, {
                        quantity,
                        refId,
                    }, config)
                    // console.log(data)
                });
                navigate(`/invoice/${refId}`);
            }
        } catch (error) {
            alert.error("Something went wrong!");
        }
    };

    const changeDeliveryOption = (e) => {
        setDelivery(e.target.value);
        setOrder({ ...order, delivery_date: date });
    };

    console.table({ ...order, delivery, total });

    return (
        !loading && (
            <Fragment>
                <div className="container-container-fluid">
                    <div className="row wrapper">
                    <Metadata title={'Checkout'}/>
                        <div className="col-10 col-lg-5">
                            <Form
                                className="container mt-2 shadow-lg"
                                onSubmit={submitHandler}
                            >
                                <h1 className="text-center">Check Out</h1>
                                <h4 className="text-center">Total Price: ₱{total}.00</h4>
                                <hr />

                                <p className = "no-margin">
                                    Name: {user.first_name} {user.last_name}
                                </p> 
                                <p className= "no-margin">Email: {user.email}</p>
                                <p className = "no-margin">Contact Number: {user.contact_number}</p>
                                <p className = "no-margin">
                                    {" "}
                                    Address: {address?.street}, {address?.municipality},{" "}
                                    {address?.province}, {address?.zipCode}
                                </p>
                                <p className = "no-margin">Landmark: {address?.landmark}</p>
                                <hr />

                                <h5>Delivery Mode</h5>
                                <Form.Group className="mb-3" controlId="name">
                                    <div class="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="delivery_mode"
                                            id="delivery_mode1"
                                            value="Pickup"
                                            onChange={(e) => {
                                                setOrder({ ...order, delivery_mode: e.target.value });
                                                setDelivery("");
                                            }}
                                        />
                                        <label className="form-check-label" for="delivery_mode">
                                            Pickup 
                    
                                         {order.delivery_mode === "Pickup" ? <>
                                            
                                            <br></br>
                                            <hr/>
                                            Cash Payment
                                            <br></br>
                                                <small id="formatValidation">
                                                    * We accept payment in cash
                                                </small>
            
                                            <br></br>
                                        <small id="formatValidation">
                                            * Minimum of a day to process
                                        </small>
                                    
                                        <small id="formatValidation">
                                            <br />
                                            <hr></hr>
                                            You may pick up your order once it is ready at: <br />
                                            Blk 7 Lot 6 Pisa Cor Livorno Sts, Amore at Portofino <br />
                                            Daang Reyna Almanza Dos, Las Pinas City</small>
                                            <hr />
                                            
       
                                        </> : ''}
                                        </label>
                  
                                        
                                        

                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="delivery_mode"
                                            id="delivery_mode2"
                                            value="Delivery"
                                            onChange={(e) => {
                                                setOrder({ ...order, delivery_mode: e.target.value });
                                                setDelivery("Standard");
                                            }}
                                        />
                                        <label className="form-check-label" for="delivery_mode">
                                            Delivery
                    </label>
                                    </div>
                                    <hr />
                                    
                                </Form.Group>

                                {order.delivery_mode === "Delivery" && (
                                    <Form.Group className="mb-3" controlId="name">
                                        
                                        <h5>Options (Cash On Delivery)</h5>
                                        <h6 className = "no-text-decoration">We only accept cash on delivery mode of payment</h6>

                                        <div class="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                checked={
                                                    order.delivery_mode === "Delivery" &&
                                                    delivery !== "Express"
                                                }
                                                name="delivery"
                                                id="delivery1"
                                                value="Standard"
                                                onChange={changeDeliveryOption}
                                            />
                                            <div>
                                                <label className="form-check-label" for="delivery_mode">
                                                    Standard (₱ 80.00)
                        </label>
                                                <br></br>
                                                <small id="formatValidation">
                                                    * Minimum of four days to deliver
                        </small>
                                            </div>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="delivery"
                                                id="delivery2"
                                                value="Express"
                                                onChange={changeDeliveryOption}
                                            />
                                            <div>
                                                <label className="form-check-label" for="delivery_mode">
                                                    Express (₱ 250.00)
                        </label>
                                                <br></br>
                                                <small id="formatValidation">* Two-day shipping</small>
                                            </div>
                                        </div>
                                        <hr />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Additional Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Message"
                                        value={order.message}
                                        onChange={(e) =>
                                            setOrder({ ...order, message: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <hr />

                                <button
                                    type="submit"
                                    className="btn update-btn btn-block"
                                    id="updatePass-btn"
                                    disabled={loading ? true : false}
                                >
                                    Purchase
                </button>

                                <a
                                    href="/me/cart"
                                    className="text-center"
                                    id="testingCancel-btn"
                                    aria-disabled="true"
                                >
                                    Cancel
                </a>
                            </Form>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    );
};

export default OrdersForm;
