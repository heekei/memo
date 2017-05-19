'use strict';

/**
 * @ngdoc overview
 * @name memoApp
 * @description
 * # memoApp
 *
 * Main module of the application.
 */
angular
    .module('memoApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        "ui.bootstrap",
        'contenteditable'
    ])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix("");
        $stateProvider
            .state("app", {
                url: '',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                title: '备忘录'
            })
            .state("home", {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                title: '备忘录'
            })
            .state('404', {
                url: '/404',
                templateUrl: '404.html',
                title: '该页面不存在'
            })
            ;
        $urlRouterProvider.otherwise('/404');
    }])
    .factory('locals', ['$window', function ($window) {
        return {
            set: function (key, value) {//存储单个属性
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {//读取单个属性
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {//存储对象，以JSON格式存储
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {//读取对象
                return JSON.parse($window.localStorage[key] || '{}');
            }

        };
    }])
    ;
