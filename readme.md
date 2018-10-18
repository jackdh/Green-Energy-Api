[![Build Status](https://travis-ci.org/jackdh/Green-Energy-Api.svg?branch=master)](https://travis-ci.org/jackdh/Green-Energy-Api)

# Creating a service to accept meter reads.

From my understanding of the original requirements a Web API was to be built primarily to accept and present meter readings.

To accomplish this the following API's have been built.

## Assumptions made

Ideally, I would have confirmed these from a requirement gathering session with the product owner. Validation of lengths can be easily added within the mongoose schema.

- Users account is already created. A utility API has been created for creating a unique customer ID.
- There are only two `read`'s per entry.
- `customerId` can be an any length string
- `serialNumber` can be an any length number
- `mpxn` can be an any length number
- `read.type` can only either be `ANYTIME` or `NIGHT`
- `read.registerId` can be an any length number
- `read.value` can be an any length number
- `readDate` can be an any format date.

## Solution

MEN

- MongoDB / Mongoose - Schema Support makes validation straight forward. Sharding allows for easier scalability
- Express - Used to control routes the of API's
- Node - Used to power the server and generate responses for the requests.
- Docker - Provided to quickly spin up an instance of the web API.
- Travis - Helps to check all tests on each commit.

## API

### Version 1

#### URL

`/api/v1/meter-read`

- POST

Accepts either a single meter reading or an array of meter readings in the following format.

    {
        "customerId": "identifier123",
        "serialNumber": "27263927192",
        "mpxn": "14582749",
        "read": [
            {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
            {"type": "NIGHT", "registerId": "387373", "value": "2892"}
        ],
        "readDate": "2017-11-20T16:19:48+00:00Z"
    }
`readDate` is optional with the default being the date of submission.

- GET

Accepts the following parameters to customise the returned content. With `=` denoting optional.

     * @param {number=} [limit=50]          - The number of items to return
     * @param {number=} [order=descending]  - The order of items returned by date.
     *
     * @param {string=} {customerId}        - The Id of the customer
     * @param {number=} {mpxn}              - The mpxn of the premise.
     * @param {number=} {serialNumber}      - The serial number of the meter.
     * @param {number=} {registerId}        - Serial number of the register.
     * @param {string=} {registerIdType}    - Can only be used in conjunction within registerId to define it's type.

Possible filters to be added could include, `fromDate`, `toDate`, `readType` `mpxnAbove`, `serialBefore`, `serialAfter` etc. As shown there could be a possibly endless number of combinations which lead me onto a different possible solution in seen version 2. 

 #### URL
 
 `/api/v1/generateUniqueCustomerID`
 
- GET

Will return a new Unique CustomerID which is 100% guaranteed to not already exist.

### Version 2

#### URL

`/api/v2/meter-read`

- POST

A different version of the previous `GET /api/v1/meter-read`. This version takes only the limit and sort URL parameters however does accept a MongoDB query within it's body. 

This allows for more powerful queries to be performed however a discussion would need to be undertake to discussion the risk / benefit trade off.

    /**
     * @param {number=} [limit=50]          - The number of items to return
     * @param {number=} [order=descending]  - The order of items returned by date.
     *
     * @param {object} [req.body]   - The query passed into the method via the request's body.
     * @return {statusCode}         
     */














