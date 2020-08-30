const profileRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

profileRouter.post('/', middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        var obj = {
            username: req.userValidData.name,
            //bookmarks: [],
            groups: req.userValidData.groups,
            email: req.userValidData.email,
            branch: req.userValidData.branch,
            //"phone": "9966885577",
            photoURL: req.userValidData.photoURL
        }
        return res.status(200).send(obj);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = profileRouter;