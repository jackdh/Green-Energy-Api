const express = require('express');
const router = new express.Router();
const MeterReadings = require('../models/MeterReading');
const uuidv1 = require('uuid/v1');
const debug = require('debug')('readings.accept.js');

/**
 * Customer has moved into a new house.
 * A Serial Number for the meter already exists. Lets create a new User and add it to them
 */
router.get('/generateUniqueCustomerID', (req, res) => {
    generateCustomerID().then( (customerId) => {
        res.send(customerId);
    }).catch((err) => {
        debug(err);
        res.sendStatus(500);
    });
});

/**
 * Generates a truly unique customer id by first creating a UUID and then checking if it exists in the DB. If it does not
 * then return it, otherwise create a new one.
 * @return {Promise<any>}
 */
function generateCustomerID() {
    return new Promise((resolve, reject) => {
        let id = uuidv1();
        MeterReadings.findOne({'customerId': id}).then((model) => {
            if (model) {
                resolve(generateCustomerID());
            } else {
                resolve(id);
            }
        });
    });
}

module.exports = router;
