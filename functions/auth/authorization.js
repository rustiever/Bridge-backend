const jwt = require('jsonwebtoken');
const  { AuthSecret } = require('./config');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = require('../app');

module.exports.checkToken = async (req, res, next) => {
    if(!AuthSecret()){
        let err = new Error('Invalid operation');
        err.status = 400;
        return next(err);
    }
    req.secret = AuthSecret();
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined')
    {
       const bearer = header.split(' ');
       const token = bearer[1];
       req.token=token;
       return next();
     }
    let err = new Error('Invalid Headers');
    err.status = 401;
    return next(err);
};

module.exports.authorizeToken = async (req, res, next) => {
    if(!req.secret){
        let err = new Error('Invalid operation ;Login first');
        err.status = 401;
        return next(err);
    }
    try{
        const token = jwt.verify(req.token, req.secret);
        if(!token){
            let err = new Error('No User Found');
            err.status = 404;
            return next(err);
        }
        
        const uid = token.id;
        req.uid = uid;
        const docRef = await db.collection('users').doc(uid);
        const docData = (await docRef.get()).data();
        const userToken = docData.token;
        if(userToken.includes(req.token)){
            return next();        
        }
        let err = new Error('not valid user');
        err.status = 401;
        return next(err);   
    }catch(err){
        return next(err);
    }
};