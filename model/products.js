const mongoose = require("mongoose");

//schema
let productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  quantity: Number,
  category: {
    type:String,
    enum: ['Men', 'Women', 'Teens']
  }
});

//associate the schema with mongodb
//first argument: collection name on mongoDB, second argument: schema name
//export the file
module.exports = mongoose.model("product", productSchema);