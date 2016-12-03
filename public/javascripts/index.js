/**
 * Created by johns on 8/22/2016.
 */
var app = angular.module('stats', []);

app.controller('StatsController', ['$http', '$scope', function($http, $scope){
    var init = function(){

    };
    this.getFollowers = function(){
        $scope.followers = [];
        $scope.userName = "blank";
        $scope.followerCount = [];
        $scope.users = [];
        $scope.followCountList = [];
        $http.get('/getFollowers')
            .success(function(response){
                console.log(response);
                followerList = [];
                angular.forEach(response.follows, function(value, key){
                   followerList.push(value.user.name);
                });
                $scope.followers = followerList;
                console.log(response)
            })
            .error(function(res){
                console.log(res.data)
            });
    };

    this.addThings = function(){
        $http.post('/addThings')
            .success(function(){})
            .error(function(res){console.log(res.data)})
    };

    this.getThings = function(){
        $http.get('/getThings')
            .success(function(res){
                console.log(res);
                followerList = [];
                angular.forEach(res, function(value, key){
                    followerList.push({'label': value.UserName, 'value': value.FollowerCount});
                });
                $scope.followCountList = followerList;
                FusionCharts.ready(function(){
                    var followerChart = new FusionCharts({
                        'type': 'column2d',
                        'renderAt': 'chartContainer',
                        'width': '300',
                        'height': '300',
                        'dataFormat': 'json',
                        'dataSource': {
                            'chart': {
                                'caption': 'Follower Count per Channel',
                                'xAxisName': 'Channel Name',
                                'yAxisName': 'Follower Count',
                                'theme': 'fint'
                            },
                            'data': $scope.followCountList
                        }
                    });
                    followerChart.render();
                })
            })
            .error(function(res){
                console.log(res);
            });
    };

    this.removeThings = function(recordId){
        $http.delete('/removeThings?id=' + recordId)
            .success(function(){})
            .error(function(res){console.log(res.data)})
    };

    init();
}]);