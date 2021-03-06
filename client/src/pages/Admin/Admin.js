import React, { useState, useEffect, useContext } from "react";
import "./Admin.css";

//components of content:
import Header from "../../components/Header/Header";
import Products from "../../components/Products/Products";
//import SearchKeyword from "../SearchKeyword/SearchKeyword";
import CategorySelectAdmin from "../../components/CategorySelectAdmin/CategorySelectAdmin";
import ThemeContext from "../../contexts/ThemeContexts";
import SaleContext, { sales } from "../../contexts/SaleContexts";

/*****
 * NEED TO ADD NEW FIELDS TO FORM
 * *******
 */

const Admin = () => {
  const [color] = useState("red");
  const [secondsLeft, setSecondsLeft] = useState(65);
  const [salesProductsIds] = useState([1, 3, 5, 6]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [onSale, setSale] = useState(false);
  const [saleReductionPercent, setReduction] = useState(10);
  const [productName, setName] = useState("");
  const [productDescription, setDescription] = useState("");
  const [productURL, setURL] = useState("");
  const [productPrice, setPrice] = useState("");
  const [quantityInStock, setStockQuantity] = useState("");
  const [notAllFieldsFilled, setFieldsFilled] = useState(false);

  const { theme } = useContext(ThemeContext);
  const { sale } = useContext(SaleContext);

  console.log("theme", theme, "on sale?", onSale);

  useEffect(() => {
    fetch("/api/products")
      .then((result) => result.json())
      .then((data) => {
        setProducts(data);
      });
    console.log("fetched ");
  }, []);

  const addButtonLabelStyle = {
    display: "block",
  };

  const checkFieldsFilled = (
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale
  ) => {
    if (
      title.length === 0 ||
      description.length === 0 ||
      price.length === 0 ||
      category.length === 0 ||
      image.length === 0 ||
      quantityInStock.length === 0
    ) {
      setFieldsFilled(true);
    } else {
      setFieldsFilled(false);
    }
  };

  const addProduct = async (
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale,
    saleReductionPercent
  ) => {
    //alert("adding");
    console.log("in add product in client");
    // check here if all fields have been filled in:
    //alert("checking fields");
    if (
      title.length === 0 ||
      description.length === 0 ||
      price.length === 0 ||
      category.length === 0 ||
      image.length === 0 ||
      quantityInStock.length === 0
    ) {
      //alert("not all filled");
      setFieldsFilled(true);
    } else {
      //alert("all filled");
      setFieldsFilled(false);
      // upload new product to server
      const res = await fetch("/api/products", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description,
          price,
          category,
          image,
          quantityInStock,
          onSale,
          saleReductionPercent,
        }),
      });
      //alert("res is ", res);
      const product = await res.json();
      //alert("adding product ", product);
      console.log("adding product ", product);

      setProducts([products, ...products]);

      // clear Add Product form
      setName("");
      setSelectedCategory("");
      setDescription("");
      setURL("");
      setPrice("");
      setStockQuantity("");
      setSale(false);
      setReduction(10);
    }
  };

  return (
    <div style={{ background: theme.background }}>
      <div>Input name of product:</div>
      <input
        id="productName"
        value={productName}
        onChange={(e) => setName(e.target.value)}
        //onChange={setName(e.target.value)}
        style={{ color: theme.background, background: theme.foreground }}
      />
      {productName.length === 0 && notAllFieldsFilled && (
        <label for="productName">Enter name of product</label>
      )}
      <div>Input description of product:</div>
      <input
        id="productDescription"
        value={productDescription}
        onChange={(e) => setDescription(e.target.value)}
        style={{ color: theme.background, background: theme.foreground }}
      />
      {productDescription.length === 0 && notAllFieldsFilled && (
        <label for="productDescription">Enter description of product</label>
      )}
      <div>Input image URL of product:</div>
      <input
        id="productURL"
        value={productURL}
        onChange={(e) => setURL(e.target.value)}
        style={{ color: theme.background, background: theme.foreground }}
      />
      {productURL.length === 0 && notAllFieldsFilled && (
        <label for="productURL">Enter url of picture of product</label>
      )}
      {productURL.length !== 0 && (
        <div>
          <img
            className="thumbImg"
            src={productURL}
            alt={{ productName }}
          ></img>
        </div>
      )}
      <div>Input price of new product:</div>
      <input
        id="productPrice"
        value={productPrice}
        onChange={(e) => setPrice(e.target.value)}
        style={{ color: theme.background, background: theme.foreground }}
      />
      {productPrice.length === 0 && notAllFieldsFilled && (
        <label for="productPrice">Enter price of product</label>
      )}
      {products.length > 0 && (
        <CategorySelectAdmin
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={products}
        ></CategorySelectAdmin>
      )}
      <div>Number of product in stock:</div>
      <input
        id="quantityInStock"
        value={quantityInStock}
        onChange={(e) => setStockQuantity(e.target.value)}
        style={{ color: theme.background, background: theme.foreground }}
      />

      {quantityInStock.length === 0 && notAllFieldsFilled && (
        <label for="quantityInStock">How many of product are in stock?</label>
      )}
      <button
        style={{ color: theme.background, background: theme.foreground }}
        onClick={(e) => {
          alert("on slae?", onSale);
          setSale(!onSale);
        }}
      >
        on slae?
      </button>
      <div>Put item on sale:</div>
      <input
        id="setSale"
        type="checkbox"
        value={onSale}
        onChange={(e) => setSale(!onSale)}
        style={{ color: theme.background, background: theme.foreground }}
      />
      {onSale && (
        <div>
          <div>Percentage price reduction: </div>
          <input
            id="reductionInput"
            value={saleReductionPercent}
            onChange={(e) => {
              setReduction(e.target.value);
            }}
            style={{ color: theme.background, background: theme.foreground }}
          ></input>
        </div>
      )}
      <button
        id="addNewProductButton"
        style={{ background: theme.background, color: theme.foreground }}
        onClick={(e) =>
          addProduct(
            productName,
            productDescription,
            productPrice,
            selectedCategory,
            productURL,
            quantityInStock,
            onSale,
            saleReductionPercent
          )
        }
      >
        Add new product
      </button>
      {notAllFieldsFilled && (
        <label for="addNewProductButton" style={{ display: "block" }}>
          Complete all fields before uploading new product.
        </label>
      )}
    </div>
  );
};

export default Admin;

/*
addProduct(
            productName,
            productDescription,
            productPrice,
            selectedCategory,
            productURL,
            quantityInStock,
            onSale
          )
          */
