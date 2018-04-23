/* eslint-disable no-invalid-this,new-cap */

const MeterReading = require('../app/models/MeterReading');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
const expect = chai.expect;

chai.use(require('chai-http'));

describe('/GET MeterReadings', () => {
    before(function(done) {
        this.timeout(60*1000);
        MeterReading.remove({}, (err) => {
            MeterReading.create((require('./default'))).then( (mode) => {
                done();
            });
        });
    });

    it('Check that test data has been loaded', (done) => {
        chai.request(server)
            .get('/api/v1/meter-read?limit=500')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(85);
                done();
            });
    });

    it('Version 1: Get Persons name', (done) => {
        chai.request(server)
            .get('/api/v1/meter-read')
            .query({'customerId': 'Shari17963105'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(7);
                expect(res.body).to.satisfy((readings) => {
                    return readings.every((reading) => {
                        return reading.customerId === 'Shari17963105';
                    });
                });
                done();
            });
    });

    it('Version 1: Get Persons name with MPXN', (done) => {
        chai.request(server)
            .get('/api/v1/meter-read')
            .query({
                'customerId': 'Shari17963105',
                'mpxn': 24612097,
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(3);
                expect(res.body).to.satisfy((readings) => {
                    return readings.every((reading) => {
                        return (reading.customerId === 'Shari17963105' && reading.mpxn === 24612097);
                    });
                });
                done();
            });
    });

    it('Version 1: Get Persons name with MPXN and with a Serial Number', (done) => {
        chai.request(server)
            .get('/api/v1/meter-read')
            .query({
                'customerId': 'Shari17963105',
                'mpxn': 24612097,
                'serialNumber': 94180203800,
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                expect(res.body).to.satisfy((readings) => {
                    return readings.every((reading) => {
                        return (reading.customerId === 'Shari17963105' && reading.mpxn === 24612097 && reading.serialNumber === 94180203800);
                    });
                });
                done();
            });
    });

    it('Version 2: Using MongoDB expressions for complex queries', (done) => {
        chai.request(server)
            .post('/api/v2/meter-read')
            .send({
                'customerId': 'Shari17963105',
                'readDate': {$gte: new Date('2016-11-19'), $lt: new Date('2018-04-22')},
                'read.0.type': 'ANYTIME',
                'read.0.value': 5684,
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                expect(res.body[0]).to.have.property('customerId').which.equals('Shari17963105');
                expect(res.body[0]).to.have.property('readDate').which.equals('2017-05-14T13:17:23.000Z');
                expect(res.body[0]).to.have.property('read').which.has.lengthOf(2);
                expect(res.body[0].read[0]).to.have.property('type').which.equals('ANYTIME');
                expect(res.body[0].read[0]).to.have.property('value').which.equals(5684);

                done();
            });
    });
});
