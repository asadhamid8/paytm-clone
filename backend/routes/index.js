const express = require('express');

const router = express.Router();

const userrouter=require('./user')
const accountrouter=require('./accounts')
router.use('/user',userrouter);
router.use('/accounts',accountrouter);
module.exports = router;