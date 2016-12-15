/**
 * Created by johns on 12/9/2016.
 */
var mongoose = require('mongoose');
var express = require('express');
var https = require('https');
var users = require('../db/user.js');

var sessionModel = mongoose.model('Session',{
    User_Id: Number,
    Stream_Id: Number,
    SessionDate: Date,
    Game: String,
    Title: String,
    ViewerCount: Number,
    FollowerCount: Number,
    SubscriberCount: Number,
    DonationCount: Number
});

var getStream = function(user){
    var parsedUser = user.replace(/['"]+/g, '');
    //console.log(parsedUser);
    var options;
    var returnStream = {};
    options = {
        hostname: 'api.twitch.tv',
        path: '/kraken/streams/' + parsedUser,
        headers: {
            'Accept': 'application/vnd.twitchtv.v3+json',
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
            var parsedData = JSON.parse(data);
            //console.log(parsedData);
            newSession = {
                User_Id: parsedData.stream.channel._id,
                Stream_Id: parsedData.stream._id,
                SessionDate: parsedData.stream.created_at,
                Game: parsedData.stream.game,
                Title: parsedData.stream.channel.status,
                ViewerCount: parsedData.stream.viewers,
                SubscriberCount: 0,
                DonationCount: 0
            };
            console.log("From GetStream: ");
            console.log(newSession);
            returnStream = newSession;
            return returnStream;
        })
    });
};

var streamPromise = function(user){
    return new Promise(function(resolve, reject){
        resolve(getStream(user))
    });
};


module.exports = {
    addSessions: function (userList) {
        userList.forEach(function(user){
            var stream = getStream(user);
            setTimeout(function(){
                console.log(stream);
            }, 3000)
        })
    }
};