const anonymousRouter = require('express').Router();

const db = require('../app');

anonymousRouter.get('/', async (req, res, next) => {
    try {
        const collectionRef = db.collection('posts');
        const docsRef = await collectionRef.where( 'global', '==', true).get();
        if (docsRef.empty) {
            console.log('No matching documents.');
            return res.send('No data found');
        }  
        var result = {};
        var obj = [];
        docsRef.forEach(doc => {
            obj.push(doc.data());
        });
        result.data = obj;
        return res.status(200).json(result);
    } catch (err) {
        return res.send(err)
    }
});

module.exports = anonymousRouter;