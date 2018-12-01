require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')
const jpeg = require('jpeg-js')
const sharp = require('sharp')
const express = require('express')
const path = require('path');
const multer = require('multer')

const port = process.env.PORT || 3001;

const app = express();
app.use(express.static('client/build'));

let z;
let img;
let model;
let mn_model;
const NUMBER_OF_CHANNELS = 3;
let resize;
let resp;


const storage = multer.memoryStorage();
const upload =  multer({ storage }).single('selectedFile');


app.post('/', upload, (req, res, next) => {

    console.log('Uploaded: ', req.file)
    console.log('<<<----------------------------------------->>>')

    img = req.file.buffer;

    next();
});



const readImage =  async () => {
 
  const buf = await img;
  const resized = await sharp(buf)
      .resize({ 
          width: 150,
          height: 150,
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy
      })
      .toBuffer()
      .then(data => {
        resize = data;
      });

  const pixels = await jpeg.decode(resize, true)

    return pixels

}

const imageByteArray = (image, numChannels) => {

  const pixels = image.data;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values
}

const imageToInput = (image, numChannels) => {

    const values = imageByteArray(image, numChannels);
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');

    return input
}


const loadModel = async () => {

  const MODEL_PATH = 'file://./client/build/model_tfjs/model.json';
    model = await tf.loadModel(MODEL_PATH);

}


const classify = async () => {

  try {
    const image = await readImage();
    const input = imageToInput(image, NUMBER_OF_CHANNELS);

      if (!model) {
      mn_model = await loadModel()
      }

    const v = input.expandDims(0);
    const predictions = await model.predict(v);
    const y = await predictions.data();

    z = y

    if (y[0]===0) {resp = "cat"} 
    else {resp = "dog"}

    console.log("RESULT:", resp);

    input.dispose();

        }

  catch(err) {
    console.error(err)
  }

}



const prediction  = async  (req, res, next) => {

  try {
      const pred = await classify();

  } catch (e) {
        next(e);
      }
      next()
}



app.post('/', prediction, (req, res, next) => {

  console.log("server side analysed!");
  console.log(resp);
  res.send(resp);

  next();
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

