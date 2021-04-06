// import the express package, installed earlier using: npm install express
const express = require("express");
const path = require("path");

// call the express function which returns an express server application
const app = express();

app.use(express.json());

require("dotenv").config();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// add mongoose to communicate with mongoDB
// - see https://mongoosejs.com/docs/index.html
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var cors = require("cors");
app.use(cors());

const productSchema = new mongoose.Schema({
  //title: { type: String, required: true },
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  quantityInStock: Number,
  onSale: {
    type: Boolean,
    default: false,
  },
  saleReductionPercent: Number,
});

const Product = mongoose.model("Product", productSchema);

// provide data to be displayed on the / page of the server's website
app.get("/api", (req, res) => {
  res.send("Hello world");
});

// res.json() allows for extra formatting of the JSON data
// - if this is not required res.send() can also be used to return a response object using Express.
app.get("/api/products", async (req, res) => {
  const { cat } = req.query;
  if (cat) {
    console.log(`search for products in category ${cat} `);
    Product.find({})
      .then((products) =>
        res.json(products.filter((product) => product.category.includes(cat)))
      )
      .catch((err) => res.status(404).json({ success: false }));
  } else {
    console.log("Searching for all products");
    Product.find({})
      .then((products) => res.json(products))
      .catch((err) => res.status(404).json({ success: false }));
  }
});

/*
app.get("/todos", (req, res) => {
  const { q } = req.query;
  if (q) {
    res.send(todos.filter((todo) => todo.title.includes(q)));
  } else {
    res.send(todos);
  }
});
*/

//adding option to serve requests with parameters:
app.get("/api/products/:_id", async (req, res) => {
  console.log("req.params are: ", req.params);
  console.log("Received request for product id: ", req.params._id);

  const { id } = req.params._id; ///here we do destructuring - we take out the params called id from the params array

  Product.findById(req.params._id).exec(function (err, product) {
    if (err) {
      console.error("Error retrieving product by id!");
    } else {
      console.log("server product = " + JSON.stringify(product));
      res.json(product);
    }
  });
});

// post: to add an item to the database
// - must define Schema for documents (records) in the database
app.post("/api/products", async (req, res) => {
  // if have defined slug for each product, search by slug instead of by id:
  // app.get("products/:slug") etc

  // define "Product" as collection,
  // then Mongoose will go to "Products" (with `s` at the end)
  // during app.get later on in the code

  const {
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale,
    saleReductionPercent,
  } = req.body;

  console.log(
    "adding product: ",
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale,
    saleReductionPercent
  );

  const product = await new Product({
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale,
    saleReductionPercent,
  }).save();
  console.log("POST!", product);

  //insertOne is in Mongo but not in Mongoose...
  //Product.insertOne({ title, description, price, category, url }).exec();

  try {
    res.status(status).send(product);
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

// put : to change a value of an item in the database
// define the put as an async function
app.put("/api/products/:_id", async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    image,
    quantityInStock,
    onSale,
    saleReductionPercent,
  } = req.body; // pass the new title in the body of the put request
  // const product = products.find((product) => product.id === +productId);
  // product.title = title; // here have changed the title of the product in the database
  //res.send("ok!");
  console.log("*** request to update product id: ", req.params._id);
  console.log("req.body are: ", req.body);

  // identify the project by the id generated by the server, which has the
  // key _id
  // omitUndefined=true : If true, delete any properties whose value is undefined when casting an update.
  await Product.updateOne(
    { _id: req.params._id },
    {
      title,
      description,
      price,
      category,
      image,
      quantityInStock,
      onSale,
      saleReductionPercent,
    },
    { omitUndefined: true, returnOriginal: false }
  ).exec(function (err, result) {
    if (err) {
      console.error("Error retrieving product by id!");
      res.status(400).json({ success: false });
    } else {
      console.log("OK! updated reduction to ", saleReductionPercent);
      console.log("OK! updated server product = " + JSON.stringify(result));
      //res.json(product);
      res.status(200).send(result);
    }
  });
});

/*
Product.findById(req.params._id).exec(function (err, product) {
    if (err) {
      console.error("Error retrieving product by id!");
    } else {
      console.log("server product = " + JSON.stringify(product));
      res.json(product)
      */

// delete: to delete an item in the db
// has to be async since need to first wait until db finished deleting record
// for async:
// 1. add async before (req, res)
// 2. add .exec() after the deleteOne
// 3. add await before the deleteOne
app.delete("/api/products/:_id", async (req, res) => {
  console.log("id to delete: ", req.params._id);

  /*
  alternative version:

  const productIndex = products.findIndex(
    (product) => product.id === +productId
  );
 */
  await Product.deleteOne({ _id: req.params._id }).exec();

  res.send("ok!");
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

//  listen for any requests that come in on port PORT (8000)

app.listen(PORT, () => {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    // we're connected!
  });
  //  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});
