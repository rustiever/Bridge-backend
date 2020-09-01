const profileRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

profileRouter.put('/', middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        return res.status(200).send('Done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = profileRouter;