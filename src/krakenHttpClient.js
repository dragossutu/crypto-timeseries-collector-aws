'use strict';

/**
 * @param {Object} https
 * @constructor
 */
function KrakenHttpClient(https) {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    if (!(this instanceof KrakenHttpClient)) {
        throw new Error('KrakenHttpClient constructor called without "new" operator');
    }

    this.https = https;
}

const resultKeyNameMap = {
    'XBTEUR': 'XXBTZEUR',
};

/**
 * @param {string} url
 * @param {string} pair
 * @param {Function} callback
 */
KrakenHttpClient.prototype.fetchData = function (url, pair, callback) {
    const options = {
        hostname: url,
        port: 443,
        path: '/0/public/OHLC?pair=' + pair + '&since=1510000000',
        method: 'GET'
    };

    this.https.request(options, response => {
        let responseDataString = '';

        response.on('data', dataPart => {
            responseDataString += dataPart;
        }).on('end', () => {
            const responseDataJson = JSON.parse(responseDataString);
            if (Array.isArray(responseDataJson.error) && responseDataJson.error.length > 0) {
                callback({
                    'requestOptions': options,
                    'response': responseDataJson
                });
            } else {
                const resultKeyName = resultKeyNameMap[pair];
                callback(null, responseDataJson.result[resultKeyName]);
            }
        });

    }).on('error', (err) => {
        callback(err);
    }).end();
};

/**
 * @param {Object} https
 * @returns {KrakenHttpClient}
 */
module.exports = function (https) {
    return new KrakenHttpClient(https);
};
