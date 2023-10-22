const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

//import the model files
const Product = require("../model/products");

const app = express();
mongoose.set("strictQuery", false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
mongoose.connect('mongodb+srv://ysk345:2wTYkXrUEqf8hfcP@cluster0.u7rsivo.mongodb.net/?retryWrites=true&w=majority',
{useNewUrlParser:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("DB connected......")
})

const PORT = process.env.PORT || 3000;
//const CONNECTION = process.env.CONNECTION;


/*-------------------Endpoints----------------*/
//homepage
app.get("/", (req, res) => {
  res.send("Welcome to Marketplace");
});

//get all products with condition (check if there is a query for name)
app.get("/api/products", async (req, res) => {
  if (req.query.name) {
    try {
      const result = await Product.find({ name: { $regex: /kw/i } });
      res.send({ result });
    } catch (e) {
      res.status(500).json({ err: e.message });
    }
  } else {
    try {
      const result = await Product.find();
      res.send({ "All Products": result });
    } catch (e) {
      res.status(500).json({ err: e.message });
    }
  }
});

//get product by id
app.get("/api/products/:id", async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      res.status(404).json({ error: "id not found" });
    }
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//add new product
app.post("/api/products", async (req, res) => {
  console.log(req.body);
  //create new product
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).json({ product });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//update product by id
app.put("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await Product.replaceOne({ _id: productId }, req.body);
    console.log(result);
    res.json({ updatedCount: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//remove product by id
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await Product.deleteOne({ _id: productId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//remove all product
app.delete("/api/products", async (req, res) => {
  try {
    const result = await Product.deleteMany({}); // Delete all items
    console.log(result);
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//connect to database
// const start = async () => {
//   try {
//     //mongodb connection string
//     await mongoose.connect(CONNECTION);
    
//     //start the server launch the app
//     app.listen(PORT, () => {
//       console.log("App listening on port " + PORT);
//     });
//   } catch (e) {
//     console.log(e.message); //show error message
//   }
// };
//start();

app.listen(PORT,()=>{
  console.log("App listening on port " + PORT);
});