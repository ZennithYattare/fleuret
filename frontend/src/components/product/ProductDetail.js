import axios from 'axios';
import { useEffect, useState, Fragment, useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { Link, useParams } from 'react-router-dom';
import * as api from '../../api/products';
import CartContext from '../cartContext';
import { useSelector } from 'react-redux';


const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useSelector(state => state.auth)
    const { cart, removeFromCart, addToCart } = useContext(CartContext)

    const [product, setProduct] = useState([]);

    const isInCart = () => {
        return cart.cart.some(item => item.product?._id?.toString() === id)
    }

    const totalPrice = () => {
        var total = 0
        total += product?.price * quantity;
        return total
    }


    const [isAdded, setIsAdded] = useState(isInCart())
    const [quantity, setQuantity] = useState(1)


    const alert = useAlert()


    useEffect(() => {
        setIsAdded(isInCart())
    }, [cart])

    useEffect(() => {
        const fetchData = async () => {
            var { product } = await api.getSingleProduct(id)
            if (product && mounted) {
                setProduct(product)
            }
        }
        let mounted = true;
        if (id) {
            fetchData(id)
        }
        return () => (mounted = false);
    }, [id])

    const addCart = async () => {
        try {
            addToCart(product, quantity)
            alert.success("Added to cart!")
            setIsAdded(true)
        }
        catch (error) {
            alert.error("Something went wrong!")
        }
    }


    const removeCart = async () => {
        try {
            removeFromCart(id)
            alert.success("Removed from cart!")
            setIsAdded(false)
        }
        catch (error) {
            alert.error("Something went wrong!")
        }
    }

    const increasequantity = () => {
        if (quantity < 5 && quantity < product.stock) {
            setQuantity(quantity + 1)
        }
        else {
            if (quantity >= product.stock) {
                alert.error(`Maximum quantity reached.`)
            } else {
                alert.error(`You can only order 5 items per product.`)
            }
        }
    }

    const decreasequantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
        else {
            alert.error("Item quantity can not be less than 1.")
        }
    }

    const image = {
        height: 'auto',
        width: '500px'
    }

    return (
        product &&
        <Fragment>
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Carousel>

                        {product?.images && product?.images.map(({ path }) => (
                            <Carousel.Item>
                                <img src={path ? path : "https://preview.redd.it/fseqknyvblex.jpg?auto=webp&s=ea4b90dab14cf0e779fd145e5b2ccf878e076d6f"} alt="burgir"
                                    className="d-block w-100" />
                            </Carousel.Item>
                        ))}

                    </Carousel>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product?._id}</p>

                    <hr />
                    
                    <h4>₱ {product.price}</h4>
                    <p className="text-muted">{product.stock} items available</p>

                    <hr />



                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr />

                    {/* {
                        isAdded ? '' :
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreasequantity}>-</span>
                                <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                                    {quantity}
                                </span>
                                <span className="btn btn-primary plus" onClick={increasequantity}>+</span>

                            </div>
                    } */}


                    {/* {isAdded ? <button type="button" id="cart_btn" className="tn btn-danger d-inline ml-4" onClick={() => removeCart()}> Remove from Cart</button > : <button type="button" id="cart_btn" className="tn btn-primary d-inline ml-4" onClick={() => addCart()}> Add to Cart</button >} */}

                    {!user || user.role === 'Customer' ? <>

                        <h3>  Purchase:  </h3>
                        <div className="row ">
                            <div className="col text-center">

                                {!isAdded &&
                                    <div className="border" id="total-btn">
                                        <h5>
                                            ₱  {totalPrice()}.00
                                        </h5>
                                    </div>
                                }

                            </div>
                        </div>

                        <div className="row text-center">
                            {
                                isAdded ? '' :

                                    <div className="stockCounter d-inline mt-4">
                                        <div class="btn-group" role="group" aria-label="Basic outlined example">

                                            <span className="btn btn-outline-danger fa-solid fa-minus" title="Decrease Quantity" onClick={decreasequantity}></span>
                                            <span className="border text-center" style={{ width: "50px" }}>
                                                {quantity}
                                            </span>
                                            <span className="btn btn-outline-info fa-solid fa-plus" title="Increase Quantity" onClick={increasequantity} style={{ marginRight: "10px" }}></span>

                                        </div>
                                    </div>
                            }
                        </div>

                        <div classname="container-fluid">

                            <div className="row">
                                <div className="col text-center mt-4">
                                    {isAdded ? <button type="button" id="cart_btn" className="btn btn-danger d-inline ml-4" title="Remove from Cart" onClick={() => removeCart()}> Remove from Cart</button > : <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" title="Add to Cart" onClick={() => addCart()}> Add to Cart</button >}
                                </div>

                                <div className="col text-center mt-4">
                                    <a href = "/products" id="backToCatalog_btn" >
                                    <button type= "button"  className="btn " >Back To Catalog</button></a>
                                </div>

                            </div>

                        </div>

                    </> :
                        <div classname="container-fluid">
                            <div className="row">
                                <div className="col text-center mt-4">
                                    <Link to="/admin/products/all" className="ml-4" id="back-btn" title="Back to Products">Back to Products</Link>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>


        </Fragment>

    )
}

export default ProductDetail