const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const imageSchema = new Schema({ 
  url: {type: String, required: true}, 
}); 

module.exports = mongoose.model('image', imageSchema); // <-- export your model