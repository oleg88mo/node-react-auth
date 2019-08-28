const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

dotenv.config();

// connect to DB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => console.log('connected to DB'));

app.use(cors());
app.use(express.json());

app.use('/api/user', authRoutes);
app.use('/api/posts', postsRoutes);

app.listen(4000, () => {
    console.log('server is running')
});