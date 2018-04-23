const express = require('express');
const debug = require('debug')('readings.present.js');

const MeterReadings = require('../models/MeterReading');

const router = new express.Router();
const LIMIT = 50;
const ORDER = '-';

/**
 * Prepared API which will allow the user to safely personalise what is returned.
 *
 * @param {number=} [limit=50]          - The number of items to return
 * @param {number=} [order=descending]  - The order of items returned by date.
 *
 * @param {string=} {customerId}        - The Id of the customer
 * @param {number=} {mpxn}              - The mpxn of the premise.
 * @param {number=} {serialNumber}      - The serial number of the meter.
 * @param {number=} {registerId}        - Serial number of the register.
 * @param {string=} {registerIdType}    - Can only be used in conjunction within registerId to define it's type.
 */
router.get('/meter-read', (req, res) => {
    const limit = req.query.limit ? +req.query.limit : LIMIT;
    const order = (req.query.order && req.query.order === 'ascending') ? '' : ORDER;

    const query = {};

    if (req.query.customerId) query['customerId'] = req.query.customerId;
    if (req.query.mpxn) query['mpxn'] = req.query.mpxn;
    if (req.query.serialNumber) query['serialNumber'] = req.query.serialNumber;
    if (req.query.registerId) {
        query['read'] = {$elemMatch: {registerId: req.query.registerId}};
        if (req.query.registerIdType) query['read']['$elemMatch']['type'] = req.query.registerIdType;
    }

    MeterReadings.find(query).sort(`${order}readDate`).limit(limit).then( (model) => {
        res.send(model);
    }).catch( (error) => {
        debug('Failed finding a user: %O', error);
        res.sendStatus(500);
    });
});


module.exports = router;
