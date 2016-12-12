/**
 * Created by johns on 12/9/2016.
 */
var mongoose = require('mongoose');
var express = require('express');
var https = require('https');
var team = require('../db/team.js');

var userModel = mongoose.model('Users', {
    _id: Number,
    InsertDate: Date,
    Name: String,
    Password: String,
    Token: String
});

module.exports = {
    parseTeams: function(teamName){
        team.getTeam(teamName).exec(function(err, docs){
            if(err)
                return console.log(err);
            docs.forEach(function(document){
                console.log("Parse User: " + document);
                document.Users.forEach(function(user){

                    var parsedUser = user.replace(/['"]+/g, '');
                    console.log(parsedUser);
                    var options;
                    options = {
                        hostname: 'api.twitch.tv',
                        path: '/kraken/channels/' + parsedUser,
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
                            //console.log(parsedData.name);
                            var newUser = {
                                _id: parsedData._id,
                                InsertDate: Date.now(),
                                Name: parsedData.name,
                                Password: '',
                                Token: ''
                            };
                            userModel.create(newUser);
                        });
                    });
                })
            })
        });
    },

    getAllUsers: function(){
        return userModel.where();
    }
};