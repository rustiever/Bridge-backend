const profileRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');

profileRouter.get('/', async ( req, res, next) =>{
    try {
        return res.status(200).send("Done with execution");
    } catch (err) {
        return res.send(err);
    }

});



module.exports = profileRouter;
