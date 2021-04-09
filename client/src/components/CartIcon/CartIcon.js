import { React, useState, useEffect, useReducer } from "react";
import cartIcon from "../../components/icons/iconfinder_cart_1814095.png";
import "../../components/storagetools/LocalStorageArrayTools.js";
import "./CartIcon.css";
import CartDisplayContents from "../CartDisplayContents/CartDisplayContents";

const CartIcon = (props) => {
  const [showCartContents, setShowCart] = useState(false);
  //const [cartNumItems, setNumItems] = useState(0);
  const [cartNumItems, setCartNumItems] = useReducer((prev, cur) => {
    localStorage.setItem("cartQty", JSON.stringify(cur));
    return cur;
  }, JSON.parse(localStorage.getItem("cartQty")));

  // see google on "localstorage dependency in useeffect"
  // useEffect(() => {
  //   setCartNumItems(localStorage.getItem("cartQty"));
  // }, localStorage);

  return (
    <div>
      <div className="cartContainer">
        <img
          className="cartIcon"
          src={cartIcon}
          alt="Shopping cart icon"
          onClick={(e) => {
            setShowCart(true);
          }}
        />
        <div className="numCartItemsDisplay">
          {localStorage.getItem("cartQty")}
        </div>
        <div>{cartNumItems}</div>
      </div>
      {cartNumItems && <CartDisplayContents />}
    </div>
  );
};
export default CartIcon;

/*onClick={(e) => {
            setShowCart(true);
          }}*/
/* onClick={alert} */
