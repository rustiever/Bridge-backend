const homeRoute = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

homeRoute.get('/', async (req, res, next) => {
    try {
        // const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
        const docData = await (await db.collection('faculties').doc("H3KOr0tq8Wcg5cK8HIY6AeRRZj73").get()).data();
        // const postsRef = await db.collection('posts').orderBy('timeStamp', 'asc').limit(10).get();
        const scopeData = docData.scope;
        var count = 5;
        var mapdata = {
            branch : 'CSE',
            batch : '2017',
            scope : ['cc','echo','ab', 'bc','abcd','bvv', 'fh','mk','klk','jjj']
        };
        var resData = [];
        const postsRef = await db.collection('posts').orderBy('timeStamp', 'asc').limit(10).get();
        postsRef.forEach(element => {
            var data = element.data();
            if(typeof data.scope === 'boolean'){
                data.postId = element.id;
                data.likes = data.likes.length;
                data.comments = data.comments.length;
                resData.push(data);
            }
            else if(typeof data.scope === "object"){
                if(typeof data.scope.batch === 'object'){
                    if(data.scope.batch.includes(mapdata.batch)){
                        //
                    }
                }
                //else
            }
        });
        console.log(resData);
        return res.status(200).send('done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = homeRoute;