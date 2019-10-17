const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const corsOptions = {origin: 'http://localhost:3000', credentials: true};
// routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

dotenv.config();

app.use(methodOverride('_method'));
app.use(cors(corsOptions));

// connect to UserDB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => console.log('connected to DB'));
// // connect to PhotoDB
const connect = mongoose.createConnection(process.env.DB_PHOTO_CONNECT);
let gfs;
connect.once('open', () => {
    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection('uploads')
});
const storage = new GridFsStorage({
    url: process.env.DB_PHOTO_CONNECT,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: 'uploads'
                };

                resolve(fileInfo)
            })
        })
    }
});
const upload = multer({storage});



app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

// routes
app.use('/api/user', authRoutes);
app.use('/api/posts', postsRoutes);


app.get('/api/user/photo/all', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            res.send({files: false})
        } else {
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'image/png') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });

            res.send(files)
        }
    })
});
app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist!.!'
            })
        }

        return res.json(files);
    })
});
app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist!.!'
            })
        }

        return res.json(file);
    })
});
app.delete('/files/:id', (req, res) => {
    gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({err: err})
        }

        res.redirect('/')
    })
});
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/')
});
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist!.!'
            })
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);

            readstream.pipe(res)
        } else {
            res.status(404).json({
                err: 'not an image'
            })
        }
    })
});

app.listen(4000, () => {
    console.log('server is running')
});
