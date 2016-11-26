(function(){
    'use strict';

    var app = angular.module('myApp.factory', ['ngResource',]);

    app.factory("Position", function($resource) {
        return $resource("http://localhost:8383/position",{
            get: {method: 'GET', isArray: false},
            save: {method: 'POST'},
            list: {method: 'GET', isArray: true},
        });
    });
})();
