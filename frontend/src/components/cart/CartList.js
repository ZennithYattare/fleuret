import { useState, useEffect, Fragment, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cart from "./Cart";
import { useAlert } from "react-alert";
import { removeFromCart, updateQuantity } from "../../actions/authActions";
import { Link } from "react-router-dom";
import CartContext from "../cartContext";
import Metadata from "../layout/Metadata";

const CartList = () => {
  const {
    cart: carts,
    removeFromCart,
    changeQuantity: changeQty,
  } = useContext(CartContext);

  const [order, setOrder] = useState(carts.cart);

  useEffect(() => {
    setOrder(carts.cart);
  }, [carts.cart]);

  const alert = useAlert();

  const removeItem = async (id) => {
    try {
      alert.success("Removed from cart!");
      removeFromCart(id);
    } catch (error) {
      alert.error("Something went wrong!");
    }
  };

  const totalPrice = () => {
    var total = 0;
    order.forEach(({ product, quantity }) => {
      total += product?.price * quantity;
      console.log(total);
    });
    return total;
  };

  const changeQuantity = (product, qty) => {
    if (qty > 5) {
      alert.error(`You can only order 5 items per product.`);
    } else {
      if (qty >= 1) {
        let newCart = [];
        order.forEach((ord) =>
          newCart.push({ product: ord.product._id, quantity: ord.quantity })
        );
        let index = newCart.findIndex(
          (cart) => cart.product.toString() === product._id.toString()
        );
        let newProduct = { product: product._id, quantity: qty };
        newCart.splice(index, 1, newProduct);
        changeQty(product, qty, newCart);
      } else {
        alert.error("Item quantity can not be less than 1.");
      }
    }
  };

  return (
    <Fragment>
      <div className="container mt-4" id="cartContainerSize">
      
        <div className="row justify-content-between ">
        <Metadata title={'Cart'}/>
          <div className="col-10 col-xl-9 rcart">
            <h2 className="mt-4">SHOPPING CART</h2>

            {order &&
              order.map((product, index) => (
                <Cart
                  product={product.product}
                  index={index}
                  quantity={product.quantity}
                  removeItem={removeItem}
                  changeQuantity={changeQuantity}
                />
              ))}

            <hr />
          </div>

          <div className="col-12 col-xl-3 my-4 mb-5">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>
                Total No. of Units:{" "}
                <span className="order-summary-values">
                  {" "}
                  {order.length} 
                </span>
              </p>
              <p>
                Est. total:{" "}
                <span className="order-summary-values">
                  ₱ {totalPrice()}.00
                </span>
              </p>

              <hr />
              {totalPrice() ? (
                <Link to={`/order/new`}>
                  <button className="btn btn-primary" id="checkout_btn">
                    Check out
                  </button>
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CartList;
