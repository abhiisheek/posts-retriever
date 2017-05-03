var express = require('express');
var router = express.Router();
var fs = require('fs');
var json2csv = require('json2csv');

var storeMap = require('./../storeInfoMap');

var request = require("request");
var count;
var postData;

router.get('/search', function(req, res) {
    var url = "http://golden-profile.dev.cloud.wal-mart.com:8080/api/search?q="+ req.query.q;
    request(url, function(error, response, body) {
        if(error) {
            console.log(error);
            res.status(404).send('Failed to fetch data');
        } else {
            response = JSON.parse(response.body);
            res.json(response);
        }
    });
});


router.get('/profile', function(req, res) {
    var url = "http://golden-profile.dev.cloud.wal-mart.com:8080/api/profile?cdid="+ req.query.cdid;
    request(url, function(error, response, body) {
        if(error) {
            console.log(error);
            res.status(404).send('Failed to fetch data');
        } else {
            response = JSON.parse(response.body);
            res.json(response);
        }
    });
});

module.exports = router;
