const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');

const db = require('../app');
const middleware = require('../middleware');
const secret = require('../auth/config');

const router = express.Router();

router.use(parser.json());


// function boolCheck(str){
//     if(str==="true")return true;
//     else if(str==="false")return false;
//     else return false;
// }

router.post('/',middleware.requestHandler, middleware.requestUser,(req, res, next) => {
    
    (async ()=>{
    try{
    if(req.alreadyLogin){
        
        const docRef = db.collection('users').doc(req.uid);
        if(docRef){
        var jsonwebtoken = jwt.sign({id: req.uid}, req.body.token);
        await docRef.update({token : [jsonwebtoken]});
        let result = await docRef.get();
        secret.secret(req.body.token);
        //console.log(secret.secret);
        return res.status(200).send(result.data());
        }
        return res.status(400).send("Invalid token");
    }else{
        var checked = middleware.usnValidation((req.body.usn).toUpperCase());
        const uid = req.uid;
        const email = req.body.email;
        const photo = req.body.photoUrl;
        const name = req.body.name;
        //const joined = boolCheck(String(req.body.joined).toLowerCase());
        const joined = req.body.joined;
        
        const docRef =  db.collection('users').doc(uid);
        await docRef.set({
              branch: checked.branchName, 
              batch : Number(checked.year),
              USN:checked.usn,
              email:email,
              name:name,
              photoUrl:photo,
              joined:joined
        });
        let jsonwebtoken = jwt.sign({id: req.uid}, req.body.token);
        secret.secret(req.body.token);
        await docRef.update({token : [jsonwebtoken]});
        let result = await docRef.get();
        //console.log(result.data());
        return res.status(201).send(result.data());
    }
    }
    catch(err){
        return res.send(err);
    }})();
});

module.exports = router;
