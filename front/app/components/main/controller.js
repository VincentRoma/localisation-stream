(function(){
    'use strict';

    var app = angular.module('myApp.main', []);

    app.controller('MainController', function($scope, $websocket) {
        var dataStream = $websocket('ws://localhost:8383/');
        $scope.collection = {};

        dataStream.onMessage(function(message) {
            console.log(message);
            var message = JSON.parse(message.data)
            if($scope.collection[message.user]){
                $scope.collection[message.user] = {'long': message.long, 'lat': message.lat};
            }else{
                $scope.collection[message.user] = {'long': message.long, 'lat': message.lat};
            }
            // $scope.current_position = [coord.long, coord.lat];
        });
    });

    app.controller('SendController', function($scope, $interval, Position) {
        $scope.is_moving = false;
        $scope.coords = {'long': 48.8875552, 'lat': 2.1947438, 'user': 'Faurecia1'};
        $scope.sending = false;
        $scope.send_data = function(){
            $scope.sending = true;
            $scope.position = new Position($scope.coords);
            console.log("Start SENDING");
            stop = $interval(function() {
                if ($scope.sending) {
                    $scope.position.$save();
                    if($scope.is_moving){
                        $scope.coords.lat += 0.001;
                    }
                    $scope.position = new Position($scope.coords);
                } else {
                    if (angular.isDefined(stop)) {
                        $interval.cancel(stop);
                        stop = undefined;
                    }
                }
            }, 1000);
        };
        $scope.stop_data = function(){
            $scope.sending = false;
        };
    });
})();
