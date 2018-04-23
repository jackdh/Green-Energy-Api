const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Checks to make sure that the values passed into a "read" are valid. It will only accept if their are 2 reads
 * and they are an object. The object will then be validated within the ReadSchema.
 * @type {*[]}
 */
const readValidator = [
    {
        validator: (array) => array.length === 2,
        msg: 'Please provide two reads',
    },
    {
        validator: (array) => {
            for (let read of array) if (typeof (read) !== 'object') return false;
            return true;
        },
        msg: 'Please provide reads in the format {type: String, registerId: Number, value: Number}',
    },
];

/**
 * The schema for each individual Read within a reading.
 */
const ReadSchema = new Schema({
    'type': {
        type: String,
        required: [true, 'Please provide a value for {PATH}'],
        validate: {
            validator: (v) => {
                return v === 'ANYTIME' || v === 'NIGHT';
            },
            message: '{VALUE} is not a valid option. Select either (ANYTIME/NIGHT)',
        },
    },
    'registerId': {
        type: Number,
        required: [true, 'Please provide a value for {PATH}']},
    'value': {
        type: Number,
        required: [true, 'Please provide a value for {PATH}'],
    },
});

/**
 * The main schema for a submitted reading.
 */
const MeterReadingSchema = new Schema({
    'customerId': {type: String, required: [true, 'Please define a customerId.']},
    'serialNumber': {type: Number, required: [true, 'Please define a serial number.']},
    'mpxn': {type: Number, required: [true, 'Please define a mpxn.']},
    'read': {
        type: [ReadSchema],
        validate: readValidator,
        required: true,
    },
    'readDate': {type: Date, default: Date.now()},
});

module.exports = mongoose.model('MeterReadings', MeterReadingSchema);
