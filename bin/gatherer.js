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


module.exports = {
    getAllUsersPing : function() {
        setInterval(function(){
            user.getAllUsers().exec(function(err, docs){
                if(err)
                    console.log(err);
                return docs
            });
        }, 60000)
    },

    getAllUsers : function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(user.getAllUsers().exec(function (err, docs) {
                    if (err)
                        console.log(err);
                    return docs;
                }));
            }, 3000)
        })
    },

    getLiveUsers : function(userList) {
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

            var results = https.get(options, function (res) {
                var data = '';
                var liveStream = '';
                //console.log(res);
                res.setEncoding('utf8');
                res.on("data", function (chunk) {
                    data += chunk;
                });
                res.on("end", function () {
                    var stream = JSON.parse(data);
                    if (stream.stream !== null){
                        liveStream =  stream.stream.channel.name;
                        liveUsers.push(liveStream);
                    }
                });
            });
        });
        console.log(liveUsers);
        return liveUsers;
    }

};