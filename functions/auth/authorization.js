const jwt = require('jsonwebtoken');
const  { AuthSecret } = require('./config');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = require('../app');

module.exports.checkToken = async (req, res, next) => {
    if(!AuthSecret()){
        let err = new Error('Invalid operation');
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
    return next(err);
};

module.exports.authorizeToken = async (req, res, next) => {
    if(!req.secret){
        let err = new Error('Invalid operation ;Login first');
        return next(err);
    }
    try{
        const token = jwt.verify(req.token, req.secret);
        if(!token)
            return next(new Error('No user found'));
        
        const uid = token.id;
        req.uid = uid;
        const docRef = await db.collection('users').doc(uid);
        const docData = (await docRef.get()).data();
        const userToken = docData.token;
        if(userToken.includes(req.token)){
            return next();        
        }
        return next(new Error('not valid user'));   
    }catch(err){
        return next(err);
    }
};