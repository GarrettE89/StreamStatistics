/**
 * Created by johns on 12/9/2016.
 */
var mongoose = require('mongoose');
var express = require('express');
var https = require('https');

var sessionModel = mongoose.model('Session',{
    User_Id: Number,
    SessionDate: Date,
    Game: String,
    Title: String,
    ViewerIncrement: [],
    FollowerIncrement: [],
    SubscriberIncrement: []
});