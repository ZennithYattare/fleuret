import { Link } from "react-router-dom"
import React, { Fragment } from 'react'

const Cart = ({ product, quantity, removeItem, changeQuantity }) => {


    return (
        // product ?

        //     <li className="border border-1 p-2 row">
        //         <div className="col-9">{product?.name}</div>
        //         <div className="col-3 d-flex flex-row justify-content-evenly">
        //             <button className="btn btn-danger" onClick={() => { changeQuantity(product, quantity - 1) }}>-</button>
        //             {quantity}
        //             <button className="btn btn-success" onClick={() => { changeQuantity(product, quantity + 1) }}>+</button>
        //             <Link to={`/products/${product._id}`}>
        //                 <button className="btn btn-primary">View</button>
        //             </Link>
        //             <button className="btn btn-danger" onClick={() => removeItem(product._id)}>Remove</button>
        //         </div>
        //     </li>
        //     : ''
        product ?
            <Fragment>
                <hr />
                <div className="cart-item">
                    <div className="row">
                        <div className="col-4 col-xl-3">
                            <img src={product?.images && product?.images[0]?.path} alt="Flower" height="90" width="115" />
                        </div>

                        <div className="col-5 col-xl-2">
                            <Link to={`/products/${product._id}`}>{product?.name}</Link>
                        </div>


                        <div className="col-4 col-xl-2 mt-4 mt-xl-0">
                            <p id="card_item_price">₱ {product.price * quantity}.00</p>
                        </div>

                        <div className="col-4 col-xl-3 mt-4 mt-xl-0">
                            <div className="stockCounter d-inline" id="btn-group">
                                <span className="btn btn-outline-danger fa-solid fa-minus" title="Decrease Quantity" onClick={() => { changeQuantity(product, quantity - 1) }}></span>
                                {<input className="form-control count d-inline" value={quantity} readOnly />}

                                <span className="btn btn-outline-info fa-solid fa-plus" title="Increase Quantity" onClick={() => { changeQuantity(product, quantity + 1) }}></span>
                            </div>
                        </div>

                        <div className="col-4 col-xl-2 mt-4 mt-xl-0">
                            <button className="btn btn-danger fa-solid fa-trash" title="Remove Item" id="delete_cart_item" onClick={() => removeItem(product._id)}></button>
                        </div>

                    </div>
                </div>
            </Fragment>
            : ''

    )
}

export default Cart