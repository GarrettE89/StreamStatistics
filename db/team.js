/**
 * Created by johns on 12/9/2016.
 */
var mongoose = require('mongoose');
var express = require('express');
var https = require('https');

var teamModel = mongoose.model('Teams', {
    _id: Number,
    InsertDate: Date,
    Name: String,
    Users: [],
    Admin: String
});

module.exports = {
    addTeam : function (teamName) {
        var options;
        options = {
            hostname: 'api.twitch.tv',
            path: '/kraken/teams/' + teamName,
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': '19c3z7vu8rq9kycnmnmwyvd6qrk109o'
            }
        };
        https.get(options, function (res) {
            var data = '';
            res.setEncoding('utf8');
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                //console.log("Data: " + data);
                var team = JSON.parse(data);
                console.log(team);
                var userList = [];
                (team.users).forEach(function(user){
                    userList.push(user.name);
                });
                newTeam =  {
                    _id: team._id,
                    InsertDate: Date.now(),
                    Name: team.name,
                    Users: userList,
                    Admin: ''
                };
                teamModel.create(newTeam);
                //console.log(users);
            });
            //response.send(data);});
        });
    },

    getTeam: function(teamName) {
       return teamModel.where({Name: teamName});

    }
};

