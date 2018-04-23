const readingsAccept = require('./readings/readings.accept');
const readingsPresent = require('./readings/readings.present');
const readingsPresentV2 = require('./readings/readings.present.v2');
const utilities = require('./utils/generateCustomerId');

module.exports = {
    readingsAccept,
    readingsPresent,
    readingsPresentV2,
    utilities,
};
