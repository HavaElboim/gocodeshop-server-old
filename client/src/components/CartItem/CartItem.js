import React, { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContexts";
import "./CartItem.css";
import sale from "../icons/sale.png";
import deleteIcon from "../icons/trash.png";
import editIcon from "../icons/editIcon.png";
import upArrow from "../icons/upArrow.png";
import downArrow from "../icons/downArrow.png";
import "../../components/storagetools/LocalStorageArrayTools.js";

const CartItem = ({ item }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isSale = true;
  //console.log("cart item: ", item);
  //console.log(`cart item: ${item.title}, ${item.price}`);

  const removeFromCart = (id) => {
    // currentItems is given an empty array if getItem returns null (i.e. if no items have yet been added to cart):
    let currentItems = JSON.parse(localStorage.getItem("cartArray") || "[]");

    // find index of item in cart array
    const index = currentItems.findIndex(
      (findItem) => findItem.productid === id
    );

    // then use index to take item out of array
    console.log("id of item: ", id);
    const quantityInCart = currentItems[index].quantity;
    console.log("index of item to remove: ", index);
    currentItems = [
      ...currentItems.slice(0, index),
      ...currentItems.slice(index + 1),
    ];

    // localStorage.pushArrayItem(
    //   "cartArray",
    //   `title: ${title}, price: ${price}, image: ${image}`
    // );

    localStorage.setItem("cartArray", JSON.stringify(currentItems));
    let origCartQty = localStorage.getItem("cartQty");
    origCartQty -= quantityInCart;
    localStorage.setItem("cartQty", origCartQty);
  };

  const editItemCartQty = (id, qty) => {
    // currentItems is given an empty array if getItem returns null (i.e. if no items have yet been added to cart):
    let currentItems = JSON.parse(localStorage.getItem("cartArray") || "[]");

    // find index of item in cart array
    const index = currentItems.findIndex(
      (findItem) => findItem.productid === id
    );

    // then use index to take item out of array
    currentItems[index].quantity += qty;

    // localStorage.pushArrayItem(
    //   "cartArray",
    //   `title: ${title}, price: ${price}, image: ${image}`
    // );

    localStorage.setItem("cartArray", JSON.stringify(currentItems));
    let origCartQty = localStorage.getItem("cartQty");
    origCartQty -= qty;
    localStorage.setItem("cartQty", origCartQty);
  };

  return (
    <div className="cartItemDisplay">
      <img className="itemIcon" src={item.image} alt="showing the item" />
      <div className="itemName">{item.title}</div>
      <div className="itemPrice">{item.price} shekel</div>
      <img
        className="upDownIcon"
        src={downArrow}
        alt="click here to reduce item quantity"
        onClick={(e) => editItemCartQty(item.productid, -1)}
      />
      <div className="itemQuantity">{item.quantity}</div>
      <img
        className="upDownIcon"
        src={upArrow}
        alt="click here to increase item quantity"
        onClick={(e) => editItemCartQty(item.productid, 1)}
      />
      <img
        className="deleteIcon"
        src={deleteIcon}
        alt="click here to remove item from cart"
        onClick={(e) => removeFromCart(item.productid)}
      />

      {isSale && <img className="saleIcon" src={sale} alt="sale icon" />}
    </div>
  );
};
export default CartItem;
