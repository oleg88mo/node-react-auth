const router = require('express').Router();
const isVerify = require('./verifyToken');

router.get('/', isVerify, (req, res) => {
    res.send(req.user)
});

module.exports = router;
