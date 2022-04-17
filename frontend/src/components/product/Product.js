import { Link } from "react-router-dom";
import Metadata from "../layout/Metadata";
const Product = ({ product }) => {
  const image = {
    width: 'auto',
    height: '100%',
  }

  return (
    <div className="col-sm-6 col-md-4 " id = "cartContainerSize">
      <Metadata title={'Catalog'}/>
      <div className="card p-3 rounded shadow-lg" id = "productContainer">
        <div className="photo text-center">
          <img src={product.images[0] && product.images[0].path} alt="Image of design" className="img-fluid" style={image} />
        </div>
        <hr />

        <div className="card-body d-flex flex-column" style={{paddingLeft: "1rem"}}>
          <h5 className="card-title">
            <h3>{product.name}</h3>
          </h5>

          <p className="card-text">₱{product.price}</p>
          <Link to={`/products/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
        </div>
      </div>
    </div>


  )
}

export default Product;