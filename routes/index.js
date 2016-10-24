var express = require('express');
var router = express.Router();
var fs = require('fs');
var json2csv = require('json2csv');

var storeMap = require('./../storeInfoMap');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var request = require("request");
var count;
var postData;

router.post('/fbdata', function(req, res, next) {
  postData = [];
  count = 0;
  var access_token = req.body.access_token;
  var page_name = req.body.page_name.toLowerCase();
  var req_count = req.body.req_count;
  var url = 'https://graph.facebook.com/v2.7/'+page_name+'/feed?access_token='+access_token+'&debug=all&format=json&limit=100';
  getData(access_token, page_name, req_count, url, function(feedsResultantData){
    var feeds = feedsResultantData;
    var url = 'https://graph.facebook.com/v2.7/'+page_name+'/posts?access_token='+access_token+'&debug=all&format=json&limit=100';
    postData = [];
    count = 0;
    getData(access_token, page_name, req_count, url, function(postsResultantData){
      filterData(feeds, postsResultantData, page_name, function(count) {
        res.end('Done fecthing '+ count + ' posts from the requested page - '+ page_name);
      });
    });
  });

});

function getData(access_token, page_name, req_count, url, callback) {
  count++;
  request(url, function(error, response, body) {
    response = JSON.parse(response.body);
    postData = postData.concat(response.data);
    if(count < req_count) {
      if(!response.paging || !response.paging.next) {
        callback(postData);
      } else {
        getData(access_token, page_name, req_count, response.paging.next, callback);
      }
    } else {
      callback(postData);
    }
  });
}

function filterData(feeds, posts, page_name, callback) {
  var postsIds = [];
  var mapData = storeMap[page_name];
  posts.forEach((item) => (postsIds.push(item.id)));
  var result = [];
  feeds.forEach((item)=>{
    if(postsIds.indexOf(item.id) === -1) {
      item["store_nbr"] = mapData.store_nbr;
      item["store_name"] = mapData.store_name;
      item["state_prov_code"] = mapData.state_prov_code;
      item["region_nbr"] = mapData.region_nbr;
      item["region_name"] = mapData.region_name;
      item["subdiv_name"] = mapData.subdiv_name;
      item["subdiv_nbr"] = mapData.subdiv_nbr;
      item["post_body_txt"] = item.message;
      delete item.message;
      result.push(item);
    }
  });
  fs.writeFileSync(page_name+'.csv', json2csv({ data: result}));
  callback(result.length)
}

module.exports = router;
