const detailRouter = require('express').Router();

const db = require('../auth/app');
const middleware = require('../auth/authorization');

detailRouter.get('/', async (req, res) => {
    try {
        const docsRef = await db.collection('posts').get();

        var reaData = [];
        docsRef.forEach(element => {
            reaData.push(element.data());
        });
        // let docsRef;
        // if(!req.body.usertype){
        //    // 
        // }
        // docsRef = await db.collection('users').where('usertype', '==', req.body.usertype).limit(100).get();
        // if (docsRef.empty) {
        //     return res.status(204).send('No data found');
        // }
        // var result = {};
        // var obj = [];
        // docsRef.forEach(doc => {
        //     obj.push(doc.data());
        // });
        // result.data = obj;

        return res.status(200).send(reaData);
    } catch (err) {
        return res.send(err);
    }
});


module.exports = detailRouter;