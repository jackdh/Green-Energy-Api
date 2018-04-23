const express = require('express');
const router = new express.Router();
const MeterReadings = require('../models/MeterReading');
const uuidv1 = require('uuid/v1');
const debug = require('debug')('readings.accept.js');


/**
 * Given a {reading} or [{reading}] it will insert them into the database.
 * Should any of the readings not be valid they will not be inserted.
 *
 * @name AcceptReadings
 * @Param {Object=} {Reading}   - A single reading object
 * @Param [Object=] [{Reading}] - A list of single reading objects
 * @Return {Status Code} - 200 if successfully inserted, 400 if there was a formatting error
 */
router.post('/meter-read', (req, res) => {
    MeterReadings.create(req.body).then( () => {
        res.sendStatus(200);
    }).catch((error) => {
        debug('Error saving, Details: %O', error);
        res.status(400).json(error.errors);
    });
});

module.exports = router;
