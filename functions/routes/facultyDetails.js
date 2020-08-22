const detailRouter = require('express').Router();

const db = require('../app');

detailRouter.get('/', async (req, res, next) => {
    try {
        const docsRef = await db.collection('faculties').get();
        //const docsRef = await collectionRef.where( 'global', '==', true).get();
        if (docsRef.empty) {
            return res.status(204).send('No data found');
        }  
        var result = {};
        var obj = [];
        docsRef.forEach(doc => {
            obj.push(doc.data());
        });
        result.data = obj;
        return res.status(200).json(result);
    } catch (err) {
        return res.send(err);
    }
});


module.exports = detailRouter;