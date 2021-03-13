import { React, useState, useEffect } from "react";
import "./ProductInfo.css";

/*
mongodb+srv://test-user1:12345@cluster0.u00wy.mongodb.net/gocodeshop-hava?retryWrites=true&w=majority&tlsInsecure=true
*/

/* mongoDB version on localhost:
useEffect(() => {
    fetch(`http://10.0.0.193:8000/products/${match.params.productid}`)
      .then((response) => response.json())
      .then((data) => setData(data));
    console.log(
      "descr is ",
      productData,
      ` from http://10.0.0.193:8000/products/${match.params.productid}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

const ProductInfo = ({ match }) => {
  const [productData, setData] = useState({});

  useEffect(() => {
    fetch(`/api/products/${match.params.productid}`)
      .then((response) => response.json())
      .then((data) => setData(data));
    console.log(
      "descr is ",
      productData,
      ` /api/products/${match.params.productid}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /*
// old shop version fetching from fake shop:
  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${match.params.productid}`)
      .then((response) => response.json())
      .then((data) => setData(data));
    console.log(
      "descr is ",
      productData,
      ` from https://fakestoreapi.com/products/${match.params.productid}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
*/

  if (productData) {
    return (
      <div>
        <div className="product-title">{productData.title}</div>
        <div className="product-image">
          <img src={productData.image} alt={""} />
        </div>
        <div>
          <div className="product-info">{productData.description}</div>
          <div className="product-info">$ {productData.price}</div>
        </div>
      </div>
    );
  }
};
export default ProductInfo;
