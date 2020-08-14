// const converter = csv()
//   .fromFile("../dummyAssets/MOCK_DATA.csv")
//   .then((json) => {
//     console.log(json);
//     return true;
//   });
// console.log(converter);

const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const app = require('express').Router();
const csv = require('csvtojson');

app.post('/',async (req, res,next) => {
        const busboy = new Busboy({ headers: req.headers });
        // This object will accumulate all the uploaded files, keyed by their name
        const uploads = {};
        // This callback will be invoked for each file uploaded
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            // console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            
            const filepath = path.join(__dirname, '../uploads/' + filename);
            uploads[fieldname] = { file: filepath };
            // console.log(file.readable);

            //console.log(`Saving '${fieldname}' to ${filepath}`);
            // fstream = fs.createWriteStream(filepath);
            file.on('data',(data)=>{
              console.log(JSON.stringify(data.toString().split('\n')))
              return res.status(200).send('done');
                //console.log(JSON.stringify(data.toString().split('\n')));
                //return res.status(200).send(JSON.stringify(data.toString().split('\n')));
            });

            // file.pipe(fs.createWriteStream(filepath).on('close', ()=>{
              // csvjson();
              // const converter =  csv().fromFile(filepath).then((json) => {
              //   console.log(json);
              //   return true;
              // });
              // console.log(converter);
            //     return res.status(200).send('Done with uploading of the file : '+filename);
            // })); 
        });

        // This callback will be invoked after all uploaded files are saved.
        // busboy.on('finish', () => {
        //     for (const name in uploads) {
        //         const upload = uploads[name];
        //         const file = upload.file;
        //         res.write(`${file}\n`);
        //         fs.unlinkSync(file);
        //     }
        //     res.end();
        // });

        // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
        // a callback when it's finished.

        busboy.end(req.rawBody);
});

// async function csvjson(){
//   const converter = await csv()
//   .fromFile('../uploads/MOCK_DATA.csv')
//   .then((json) => {
//     console.log(json);
//     return true;
//   });
// console.log(converter);
// }

module.exports = app;
