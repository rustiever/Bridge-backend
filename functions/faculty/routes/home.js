const homeRoute = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

homeRoute.get('/', async (req, res, next) => {
    try {
        // const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
        const docData = await (await db.collection('faculties').doc("H3KOr0tq8Wcg5cK8HIY6AeRRZj73").get()).data();
        const postsRef = db.collection('posts');
        const scopeData = docData.scope;
        const len = scopeData.length;
        var resData = [];
        var limit = 50;
        var objsData;
        if(len<9){
            scopeData.push('global');
            objsData = await postsRef.where('scope','array-contains-any', scopeData).orderBy('timeStamp','asc').limit(50).get();
        }
        else{
            let newScope = scopeData.slice(0,9);
            if(len-9 >= 0)
            newScope.push('global');
            objsData = await postsRef.where('scope','array-contains-any', newScope).orderBy('timeStamp', 'asc').limit(50).get();
        }
        objsData.forEach(element => {
            console.log(element.id);
            console.log(element.data());
        });
        return res.status(200).send('All the post data fetched');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = homeRoute;