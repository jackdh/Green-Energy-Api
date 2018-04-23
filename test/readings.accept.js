const MeterReading = require('../app/models/MeterReading');

const chai = require('chai');
const server = require('../server');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const expect = chai.expect;

let meterReading;

chai.use(require('chai-http'));
chai.use(require('chai-datetime'));

describe('Readings', () => {
    beforeEach((done) => {
        MeterReading.remove({}, (err) => {
            meterReading = {
                'customerId': 'identifier123',
                'serialNumber': 1234342342,
                'mpxn': 73103440,
                'read': [
                    {
                        'type': 'ANYTIME',
                        'registerId': 32841,
                        'value': 2970,
                    },
                    {
                        'type': 'NIGHT',
                        'registerId': 97291,
                        'value': 5042,
                    },
                ],
                'readDate': '2016-08-22T13:40:24+00:00',
            };
            done();
        });
    });

    describe('/POST MeterReadings', () => {
        describe('/POST Invalid post requests', () => {
            it('it should not post a meter reading without customerId', (done) => {
                delete meterReading.customerId;
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('customerId');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.customerId.should.have.property('message').eql('Please define a customerId.');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading without a serialNumber', (done) => {
                delete meterReading.serialNumber;
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('serialNumber');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.serialNumber.should.have.property('message').eql('Please define a serial number.');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading without mpxn', (done) => {
                delete meterReading.mpxn;
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('mpxn');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.mpxn.should.have.property('message').eql('Please define a mpxn.');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading without reads', (done) => {
                delete meterReading.read;
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('read');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.read.should.have.property('message').eql('Please provide two reads');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading with empty reads', (done) => {
                meterReading.read = [];
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('read');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.read.should.have.property('message').eql('Please provide two reads');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading with one reads', (done) => {
                meterReading.read = meterReading.read.slice(0, 1);
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('read');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.read.should.have.property('message').eql('Please provide two reads');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading more than two', (done) => {
                meterReading.read.push(meterReading.read[0]);
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('read');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.read.should.have.property('message').eql('Please provide two reads');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });

            it('it should not post a meter reading if reads are a number', (done) => {
                meterReading.read = 3;
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('read');
                        Object.keys(res.body).length.should.equal(1);
                        res.body.read.should.have.property('name').eql('CastError');
                        MeterReading.find({}).then( (model) => {
                            model.should.be.a('array').which.has.length(0);
                            done();
                        });
                    });
            });
        });

        describe('/POST Valid post requests', () => {
            it('Should post a normal reading', (done) => {
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(200);
                        MeterReading.find({}).lean().then( (model) => {
                            model.should.be.a('array').which.has.length(1);
                            expect(model[0]).to.have.property('customerId').which.equals(meterReading.customerId);
                            expect(model[0]).to.have.property('serialNumber').which.equals(meterReading.serialNumber);
                            expect(model[0]).to.have.property('mpxn').which.equals(meterReading.mpxn);

                            expect(model[0]).to.have.property('read').which.is.an('array').to.have.lengthOf(meterReading.read.length);
                            expect(model[0].read[0]).to.have.property('type').which.equals(meterReading.read[0].type);
                            expect(model[0].read[0]).to.have.property('registerId').which.equals(meterReading.read[0].registerId);
                            expect(model[0].read[0]).to.have.property('value').which.equals(meterReading.read[0].value);

                            expect(model[0].read[1]).to.have.property('type').which.equals(meterReading.read[1].type);
                            expect(model[0].read[1]).to.have.property('registerId').which.equals(meterReading.read[1].registerId);
                            expect(model[0].read[1]).to.have.property('value').which.equals(meterReading.read[1].value);

                            expect(model[0]).to.have.property('readDate');
                            expect(new Date(model[0].readDate)).to.equalDate(new Date(meterReading.readDate));

                            done();
                        });
                    });
            });

            it('Should post a reading without a date', (done) => {
                delete meterReading.readDate;
                expect(meterReading).to.not.have.property('readDate');
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(200);
                        MeterReading.find({}).lean().then( (model) => {
                            expect(model[0]).to.have.property('readDate');
                            done();
                        });
                    });
            });

            it('Should post a reading but not store extra fields', (done) => {
                meterReading.newField = 'Should not exist';
                expect(meterReading).to.have.property('newField');
                chai.request(server)
                    .post('/api/v1/meter-read')
                    .send(meterReading)
                    .end((err, res) => {
                        res.should.have.status(200);
                        MeterReading.find({}).lean().then( (model) => {
                            expect(model[0]).to.not.have.property('newField');
                            done();
                        });
                    });
            });
        });
    });
});
