'use strict';

const https = require('https');
const AWS = require('aws-sdk');

const bucket = process.env.S3_BUCKET;
const pair = process.env.CURRENCY_PAIR;

function fetchData(formatDataCallback, saveDataCallback) {
    const options = {
        hostname: 'api.kraken.com',
        port: 443,
        path: '/0/public/OHLC?pair=' + pair + '&since=1510000000',
        method: 'GET'
    };

    let responseDataString = '';
    https.request(options, (res) => {
        res.on('data', (dataPart) => {
            responseDataString += dataPart;
        }).on('end', function () {
            const responseDataJson = JSON.parse(responseDataString);
            if (Array.isArray(responseDataJson.error) && responseDataJson.error.length > 0) {
                console.log(responseDataJson.error);
            } else {
                formatDataCallback(responseDataJson.result['XXBTZEUR'], saveDataCallback);
            }
        });

    }).on('error', (e) => {
        console.log(e);
    }).end();
}

function formatDataToCsv(data, callback) {
    let csv = '';
    for (let row of data) {
        csv += (row.join(',') + "\n");
    }

    callback(csv);
}

function saveDataToS3Bucket(data) {
    const key = buildS3Key();
    const s3 = new AWS.S3();
    const params = {
        Body : data,
        Bucket : bucket,
        Key : key
    };

    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
}

function buildS3Key() {
    const date = new Date();
    const keyParts = [];
    keyParts.push(pair);
    keyParts.push(date.getUTCFullYear());
    keyParts.push(date.getUTCMonth());
    keyParts.push(date.getUTCDay());
    keyParts.push(date.getUTCHours());
    keyParts.push(date.getUTCMinutes());
    keyParts.push(date.getUTCSeconds());

    return keyParts.join('.');
}

exports.handler = (event, context) => {
    fetchData(formatDataToCsv, saveDataToS3Bucket);
};
