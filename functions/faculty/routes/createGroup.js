const groupRouter = require('express').Router();

const db = require('../../app');
const secret = require('../auth/facconfig');
const middleware = require('../auth/middleware');

module.exports = groupRouter;