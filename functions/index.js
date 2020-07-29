const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const db = require('./app');
const middleware = require('./middleware');

const app = express();

app.use(cors({ origin: true }));
app.use(parser.json());

app.post('/api/auth',middleware.requestHandler, middleware.requestUser,(req, res, next) => {
    (async ()=>{
    try{
    if(req.alreadyLogin){
        const docRef = await db.collection('users').doc(req.uid);
        if(docRef){
        let jsonwebtoken = await jwt.sign({id:req.uid},req.body.token);
        await docRef.update({token : jsonwebtoken});
        let result = await docRef.get();
        return res.status(200).send(result.data());
        }
        return res.status(400).send("Invalid token");
    }else{
        var checked = middleware.usnValidation((req.body.usn).toUpperCase());
        const uid = req.uid;
        const email = req.body.email;
        const photo = req.body.photoUrl;
        const name = req.body.name;
        const docRef =  db.collection('users').doc(uid);
        await docRef.set({
              branch: checked.branchName, 
              batch : checked.year,
              USN:checked.usn,
              email:email,
              name:name,
              photoUrl:photo
        });
        let jsonwebtoken = await jwt.sign({id:req.uid},req.body.token);
        await docRef.update({token : jsonwebtoken});
        let result = await docRef.get();
        //console.log(result.data());
        return res.status(200).send(result.data());
    }
    }
    catch(err){
        return res.send(err);
    }})();
});
app.post('/api/posts',middleware.requestHandler, (req, res,next) => {
    (async () => {
        try {
            const checked = usnValidation(req.body.usn.toUpperCase());

            await db.collection('posts').add({
                caption: req.body.caption,
                imgUrl: req.body.imgUrl,
                mode: req.body.mode,
                ownerId: req.body.ownerId,
                postOwnerName: req.body.postOwnerName,
                postOwnerPhotoUrl: req.body.postOwnerPhotoUrl,
                time: req.body.time
            });
            
            return res.status(200).send('done with adding');
        }catch (err) {
            return re.status(500).send('No  Access to the resources'+err.toString());
        }
    })();
});

exports.app = functions.https.onRequest(app);
