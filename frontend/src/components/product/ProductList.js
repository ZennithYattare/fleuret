import { useEffect, useState } from 'react';
import Product from './Product';
import * as api from '../../api/products';
import { useDispatch, useSelector } from "react-redux"
import AdminProduct from './AdminProduct';

const ProductList = () => {
    const [name, setName] = useState("")
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([])

    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        const fetchData = async () => {
            const { products } = await api.getAllProducts()
            setProducts(products)
            setFilteredProducts(products)
        }
        fetchData()
    }, [])

    const productDelete = (id) => {
        api.deleteProduct(id)
        setFilteredProducts(products.filter(product => product._id !== id))
        setProducts(products.filter(product => product._id !== id))
    }

    useEffect(() => {
        setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(name.toLowerCase())))
    }, [name])

    return (
        <section id="products" className="container mt-4">

            <div className="row">
                <h1 className="text-center">Products</h1>
                <hr />

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 ">
                    {
                        filteredProducts && filteredProducts.length > 0 ?
                            filteredProducts.map(product => (
                                product.stock > 0 ?
                                    user?.role && user?.role === "Admin"
                                        ? <AdminProduct product={product} key={product._id} deleteProduct={productDelete} />
                                        :
                                        !product.isArchived && <Product product={product} key={product._id} deleteProduct={productDelete} />
                                    : ''
                            ))
                            : <h2>No Products found</h2>
                    }
                </div>
            </div>
        </section >
    )
}

export default ProductList