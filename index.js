var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');

mongoose.connect(
  process.env['MONGO_URI'],
  () => {
    console.log('Your app is connected to MongooseDB');
  }
);

const Image = mongoose.model('Image', {
  name: String,
  type: String,
  size: Number
})
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const upload = multer({ dest: './public/data/uploads' });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  const newImage = new Image({
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size
  });

  newImage.save(function(err,result){
    if (err) {
      console.log(err);
    }
    else {
      console.log(result)
    }
})
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});