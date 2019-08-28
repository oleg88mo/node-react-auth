const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        country: req.body.country,
    });

    try {
        await user.save();
        res.send({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
            }
        });
    } catch (err) {
        res.status(400).send(err)
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email is not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)
});

module.exports = router;
