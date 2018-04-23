const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('server.js');
const router = require('./app/router');

let collection = process.env.NODE_ENV === 'test' ? 'GreenEnergyTest' : 'GreenEnergy';

let url = process.env.MONGO_URL ? process.env.MONGO_URL : '127.0.0.1';

console.log(`mongodb://${url}:27017/${collection}`);
mongoose.connect(`mongodb://${url}:27017/${collection}`).then(() => {
    console.log('Connected to Database.');
}).catch((err) => {
    console.log('Failed connecting to DB');
});

// Move to router.js


const app = express();

// Size limit can be increase to allow for more readings to be given at once.
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(morgan('combined')); // Log HTTP requests

const port = process.env.port || 3000;

app.use('/api/v1/', router.readingsAccept);
app.use('/api/v2/', router.readingsPresentV2);
app.use('/api/v1/', router.readingsPresent);
app.use('/api/v1/', router.utilities);

app.use((req, res, next) => {
    const err = new Error('Path not found');
    err.status = 404;
    next(err);
});

// Only spin up the server if we are not testing it.
if (process.env.NODE_ENV !== 'test') app.listen(port);

console.log(`App running on port ${port}`);

module.exports = app;

