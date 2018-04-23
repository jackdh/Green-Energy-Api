const MeterReading = require('../app/models/MeterReading');

const chai = require('chai');
const server = require('../server');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const expect = chai.expect;


chai.use(require('chai-http'));

describe('Utilities', () => {
    it('it should generate a unique customerId which does not exist in the database', (done) => {
        chai.request(server)
            .get('/api/v1/generateUniqueCustomerID')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.property('text').which.has.lengthOf.at.least(1);
                MeterReading.findOne({'customerId': res.text}).then( (model) => {
                    expect(model).to.be.null;
                    done();
                });
            });
    });
});
