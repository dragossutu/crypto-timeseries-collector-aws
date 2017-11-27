'use strict';

test('test that fetchData returns data successfully', done => {
    const url = 'dummy.url';
    const pair = 'XBTEUR';
    const result = {"ohlcv": "data"};

    const httpMock = require.requireMock('http');
    /** @type {ClientRequest} */
    const clientRequestMock = httpMock.ClientRequest;
    clientRequestMock.on = jest.fn(() => {
        return clientRequestMock;
    });
    clientRequestMock.end = jest.fn();

    /** @type {IncomingMessage} */
    const responseMock = httpMock.IncomingMessage;
    responseMock.on = jest.fn((event, cb) => {
        if ('data' === event) {
            const dataPart = '{"error": [], "result": { "XXBTZEUR": ' + JSON.stringify(result) + '}}';
            cb(dataPart);
        } else if ('end' === event) {
            cb();
        }

        return responseMock;
    });

    const httpsMock = require.requireMock('https');
    httpsMock.get = jest.fn((options, cb) => {
        cb(responseMock);
        return clientRequestMock;
    });

    /** @type {KrakenHttpClient} */
    const sut = require('../../src/krakenHttpClient.js')(httpsMock);

    const callback = jest.fn((error, data) => {
        expect(httpsMock.get).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(null, result);

        done();
    });

    sut.fetchData(url, pair, callback);
});
