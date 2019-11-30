const express = require('express');
const routerV1 = express.Router();

routerV1.use('/notification', require('./notification'));

routerV1.get('/', (req, res) => {
    res.status(200).send('Hi there, You landed on the home page');
});

module.exports = routerV1;
