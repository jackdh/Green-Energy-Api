const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('server.js');

let collection = process.env.NODE_ENV === 'test' ? 'GreenEnergyTest' : 'GreenEnergy';

let url = process.env.MONGO_URL ? process.env.MONGO_URL : '127.0.0.1';

console.log(`mongodb://${url}:27017/${collection}`);
mongoose.connect(`mongodb://${url}:27017/${collection}`).then(() => {
    console.log('Connected to Database.');
}).catch((err) => {
    console.log('Failed connecting to DB');
});

// Move to router.js
const readingsAccept = require('./app/readings/readings.accept');
const readingsPresent = require('./app/readings/readings.present');
const readingsPresentV2 = require('./app/readings/readings.present.v2');
const utilities = require('./app/utils/generateCustomerId');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('combined')); // Log HTTP requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.port || 3000;

app.use('/api/v1/', readingsAccept);
app.use('/api/v2/', readingsPresentV2);
app.use('/api/v1/', readingsPresent);
app.use('/api/v1/', utilities);

app.use((req, res, next) => {
    const err = new Error('Path not found');
    err.status = 404;
    next(err);
});

if (process.env.NODE_ENV !== 'test') app.listen(port);

console.log(`App running on port ${port}`);

module.exports = app;

