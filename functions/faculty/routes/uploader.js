const csv = require("csvtojson");
const express = require("express");
const fs = require("fs");
const multer  = require('multer');
var upload = multer({ dest: 'uploads/' });


// const converter = csv()
  // .fromFile("../dummyAssets/MOCK_DATA.csv")
  // .then((json) => {
    // console.log(json);
    // return true;
  // });
// console.log(converter);

var uploadRouter = express();

uploadRouter.post('/', upload.single("file"),(req,res) => {
    console.log('inside uploader');
    console.log(req.body);
    console.log(req.file);

    // console.log("Received file" + req.file.originalname);

    // var src = fs.createReadStream(req.file.path);
    // var dest = fs.createWriteStream('uploads/' + req.file.originalname);
    // src.pipe(dest);
    // src.on('end', ()=> {
      // fs.unlinkSync(req.file.path);
      // return res.json('OK: received ' + req.file.originalname);
    // });
    // src.on('error', (err)=> { return res.json('Something went wrong!'+err); });
  
  });

module.exports = uploadRouter;
