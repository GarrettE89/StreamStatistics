var express = require('express');
var router = express.Router();
var https = require('https');
var mongoose = require('mongoose');
var team = require('../db/team.js');
var user = require('../db/user.js');

// var entryModel = mongoose.model('Demo', {
//     UserName: String,
//     FollowerCount: Number
// });
// var sessionModel = mongoose.model('Session',{
//     Streamer_Id: String,
//     SessionDate: Date,
//     Game: String,
//     Title: String,
//     ViewerIncrement: [],
//     FollowerIncrement: [],
//     SubscriberIncrement: []
// });
/* GET home page. */
router.get('/', function(req, response, next) {

    var options;
    options = {
        hostname: 'api.twitch.tv',
        path: '/kraken/teams/thelounge',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': '19c3z7vu8rq9kycnmnmwyvd6qrk109o'
        }
    };

    var data = https.get(options, function (res) {
        var data = '';
        //console.log(res);
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            //console.log("Data: " + data);
            //console.log(JSON.parse(data));
            response.render('index', { title: 'Stream Statistics', twitchResponse: data});
            //response.send(data);
        });
    });
    //response.render('index', {title: 'Stream Statistics'});
});


//Access token = 45cl47arl571hmmm5i6325v1yfyo97

router.get('/getFollowers', function(req, response) {
    var options;
    options = {
        hostname: 'api.twitch.tv',
        path: '/kraken/channels/mejash/follows?limit=100',
        headers: {
            'Accept': 'application/vnd.twitchtv.v3+json',
            'Client-ID': '19c3z7vu8rq9kycnmnmwyvd6qrk109o',
            'Authorization': 'OAuth 45cl47arl571hmmm5i6325v1yfyo97'
        }
    };
    var data = https.get(options, function (res) {
        var data = '';
        console.log(res);
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            data += chunk;
            console.log(data);
        });
        res.on("end", function () {
            console.log("Data: " + data);
            response.send(data);
        });
    });
});

router.post('/addThings', function(req, response){
  try {
      sessionModel.create({
          Streamer_Id: '1',
          SessionDate: Date.now(),
          Game: 'Demo Game',
          Title: "Demo Title",
          ViewerIncrement: [{0 : 5},{5 : 10},{10 : 20}],
          FollowerIncrement: [{0 : 2},{5 : 4},{10 : 8}],
          SubscriberIncrement: [{0 : 1},{5 : 2},{10 : 4}]
      });
  } catch (e){
    console.log(e);
  }
});

router.get('/getThings', function(req, response){
    try {
        entryModel.find(function(err, entries){
          if(err){
            response.send(err)
          }
          response.json(entries);
        });
    } catch (e){
        console.log(e);
    }
});

router.delete('/removeThings', function(req, response){
    try {
      console.log(typeof req.query.id);
      entryModel.findByIdAndRemove(req.query.id, function(obj){
        response.send(obj);
      });
    } catch (e){
        console.log(e);
    }
});

router.get('/getTeam:teamName', function(req, response){
    try {
        console.log(req.params.teamName);
        console.log(team.addTeam(req.params.teamName));
        // console.log("Users: " + users);
        // response.send(users);
    } catch (e){
        console.log(e);
    }
});

module.exports = router;
