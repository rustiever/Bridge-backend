const homeRoute = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

homeRoute.get('/', async (req, res, next) => {
    try {
        // const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
        const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
        const postsRef = db.collection('posts');
        const scopeData = docData.scope;
        const len = scopeData.length;
        var resData = [];
        var objsData;
        if(len<9){
            objsData = await postsRef.where('scope','array-contains-any', scopeData);
        }
        else{
            let newScope = scopeData.slice(0,9);
            newScope.push('global');
            objsData = await postsRef.where('scope','array-contains-any', newScope);
        }

        return res.status(200).send('All the post data fetched');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = homeRoute;