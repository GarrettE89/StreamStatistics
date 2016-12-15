/**
 * Created by gjohnson on 12/12/2016.
 */
var app = require('../app');
var debug = require('debug')('untitled:server');
var mongoose = require('mongoose');
var https = require('https');
var user = require('../db/user.js');
var team = require('../db/team.js');
var session = require('../db/session.js');


var liveUsers = function(userList){
    var liveUsers = [];
    userList.forEach(function (user) {
        var options;
        options = {
            hostname: 'api.twitch.tv',
            path: '/kraken/streams/' + user.Name,
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json',
                'Client-ID': '19c3z7vu8rq9kycnmnmwyvd6qrk109o'
            }
        };

        var data = https.get(options, function (res) {
            var data = '';
            var liveStream = '';
            //console.log("New Response: " + res);
            res.setEncoding('utf8');
            res.on("data", function (chunk) {
                data += chunk;
                //console.log("New Data: " + data);
            });
            res.on("end", function () {
                //console.log("New End");
                var stream = JSON.parse(data);
                if (stream.hasOwnProperty("stream") && stream.stream !== null && stream.stream !== undefined){
                    liveStream =  stream.stream.channel.name;
                    liveUsers.push(liveStream);
                    return liveUsers;
                }
            });
        });
    });
    return liveUsers;
};

module.exports = {
    getAllUsersPing : function() {
        setInterval(function(){
            user.getAllUsers().exec(function(err, docs){
                if(err)
                    console.log(err);
                //console.log(docs);
                return docs
            });
        }, 60000)
    },

    getActiveUsers : function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(user.getActiveUsers().exec(function (err, docs) {
                    if (err)
                        console.log(err);
                    return docs;
                }));
            })
        })
    },

    getLiveUsers : function(userList) {
        return new Promise(function(resolve, reject){
            resolve(liveUsers(userList))
        });


    }

};