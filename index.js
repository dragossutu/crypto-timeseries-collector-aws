'use strict';

const https = require('https');
const awsSdk = require('aws-sdk');
const krakenHttpClientFactory = require('./src/krakenHttpClient');
const dataFormatterFactory = require('./src/dataFormatter');
const s3ServiceFactory = require('./src/s3Service');
const lambdaServiceFactory = require('./src/lambdaService');

const krakenHttpClient = krakenHttpClientFactory(https);
const dataFormatter = dataFormatterFactory();
const s3Service = s3ServiceFactory(awsSdk);
const lambdaService = lambdaServiceFactory(krakenHttpClient, dataFormatter, s3Service);

const url = 'api.kraken.com';
const pair = process.env.CURRENCY_PAIR;
const bucket = process.env.S3_BUCKET;

exports.handler = (event, context) => {
    lambdaService.run(url, pair, bucket);
};
