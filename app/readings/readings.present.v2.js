const express = require('express');
const debug = require('debug')('readings.present.js');

const MeterReadings = require('../models/MeterReading');

const router = new express.Router();
const LIMIT = 50;
const ORDER = '-';

/**
 * Powerful API which allows the user to define their own queries. Although it could pose a security risk by returning information which we do not want them to see. This can be offset by limiting it to a single collection as well as with authentication.
 *
 * @param {number=} [limit=50]          - The number of items to return
 * @param {number=} [order=descending]  - The order of items returned by date.
 *
 * @param {object} [req.body]   - The query passed into the method via the request's body.
 * @return {statusCode}
 */
router.post('/meter-read/', (req, res) => {
    const limit = req.query.limit ? +req.query.limit : LIMIT;
    const order = (req.query.order && req.query.order === 'ascending') ? '' : ORDER;
    MeterReadings.find(req.body).sort(`${order}readDate`).limit(limit).then((model) => {
        if (model) {
            res.json(model);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        res.status(400).send(err.message);
    });
});

module.exports = router;
