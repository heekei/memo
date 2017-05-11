'use strict';

/**
 * @ngdoc function
 * @name memoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the memoApp
 */
angular.module('memoApp')
    .controller('MainCtrl', ['$rootScope', '$scope', 'locals', function ($rootScope, $scope, locals) {
        // locals.setObject('memos', [
        //     {
        //         id: 1,
        //         title: '第一条记录',
        //         content: '今天出太阳了，应该回家了！',
        //         datetime: '2017/05/11 16:04:47'
        //     },
        //     {
        //         id: 2,
        //         title: '第二条记录',
        //         content: '今天下雨了，我不出门了！',
        //         datetime: '2017/05/11 16:07:25'
        //     }
        // ]);
        
        $scope.memos = locals.getObject('memos');
    }]);
