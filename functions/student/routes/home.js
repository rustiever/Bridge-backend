const homeRoute = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

homeRoute.get('/', async (req, res, next) => {
    try {
        return res.status(200).send('All the post data fetched');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = homeRoute;