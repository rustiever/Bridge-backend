const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = require('../app');

module.exports.checkToken = async (req, res, next) => {
    if(secret===null){
    let err = new Error('Invalid operation');
    return next(err);
    }
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined')
    {
       const bearer = header.split(' ');
       const token = bearer[1];
       req.token=token;
       return next();
     }
    let err = new Error('Invalid Headers');
    return next(err);
};

module.exports.authorizeToken = (req, res, next) => {
    
    if(typeof req.token === 'undefined'){
        let err = new Error('Error in headers');
        return next(err);
    }
    if(secret===null){
        let err = new Error('Invalid operation ;Login first');
        return next(err);
    }
    (async ()=>{
        await jwt.verify(req.token,secret,(err,authorizedata) =>
        {
        if(err){
            return next(err);
        }
        var uid = authorizedata.id;
        try{
        const doc =async()=>await (await db.collection('users').doc(uid).get()).data();
        const data = doc.token.includes(req.body.token);
        if(data){
            return next();
        }
        }catch(myerror){
            return next(myerror);
        }
        return next(new Error('Authentication Failed'));
        });
    })();
    
    let er = new Error('Something went wrong');
    return next(er);
};
