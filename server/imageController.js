const Image = require('./imageModel'); 
const imageController = {}; 

imageController.findImage = (req, res) => { 
  console.log('Inside of find image.'); 
  Image.find({}, (err, image) => { 
    if (err) { 
      console.log(err); 
      res.send({error: 'Image not found.'}); 
    } else { 
      res.status(200).send(image); 
    }//end if else
  });    
} 

module.exports = imageController; 