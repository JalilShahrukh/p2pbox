const AWS = require('aws-sdk'); 

awsController = {}; 
awsController.getImages = (req, res) => { 
  console.log('Inside of awsController'); 
  AWS.config.update( 
    { 
      accessKeyId: '', 
      secretAccessKey: ''
    }
  ); 
  var s3 = new AWS.S3(); 
  var bucket = new AWS.S3({params: {Bucket: 'boxchatimages'}});
  var images = []; 
  bucket.listObjects(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      for(let i = 1; i < data.Contents.length; i++) { 
        images.push('https://s3.amazonaws.com/' + bucket.config.params.Bucket + '/' + data.Contents[i].Key);
        console.log('https://s3.amazonaws.com/' + bucket.config.params.Bucket + '/' + data.Contents[i].Key);
      }
    }
    res.status(200).send(images); 
  });
}

module.exports = awsController; 