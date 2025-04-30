// routes/index.js
const express = require('express');
const router = express.Router();

const retirementRoute = require('./retirement');

router.use(retirementRoute);

module.exports = router;