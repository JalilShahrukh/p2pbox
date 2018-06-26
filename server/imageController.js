const Image = require('./../models/UserModel'); 
const imageController = {}; 

imageController.findImage = (req, res) => { 
  console.log('Inside of find image.'); 
  Image.find({}, (req, images) => { 
    if (err) { 
      console.log(err); 
      res.send({error: 'Could not find all tasks.'});
    } else {
      res.status(200).send(images);  
    }//end if else
  });    
} 