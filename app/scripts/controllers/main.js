'use strict';

/**
 * @ngdoc function
 * @name memoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the memoApp
 */
angular.module('memoApp')
    .filter('column', function () {
        return function (inputArr, colIndex, cols) {
            var arr = [];
            for (var i = 0; i < inputArr.length; i++) {
                if (i % cols === colIndex - 1) {
                    arr.push(inputArr[i]);
                }
            }
            return arr;
        };
    })
    .controller('MainCtrl', ['$rootScope', '$scope', 'locals', '$timeout', function ($rootScope, $scope, locals, $timeout) {
        // locals.setObject('memos', []);
        $scope.cols = 4;
        $scope.getColsArr = function (cols) {
            var tmp = [];
            for (var i = 1; i <= cols; i++) {
                tmp.push(i);
            }
            return tmp;
        };
        var throttle;
        function save(id) {
            if (angular.isDefined(id)) {
                var time = new Date();
                for (var i = 0; i < $scope.memos.length; i++) {
                    if (id === $scope.memos[i].id) {
                        $scope.memos[i].lastModified = time.toLocaleString();//记录最后编辑时间
                        break;
                    }
                }
            }
            if (throttle) { $timeout.cancel(throttle); }
            throttle = $timeout(function () {
                locals.setObject('memos', $scope.memos);
            }, 300);
        }
        function removeById(id) {
            for (var i = 0; i < $scope.memos.length; i++) {
                if (id === $scope.memos[i].id) {
                    $scope.memos.splice(i, 1);
                    save();
                    return;
                }
            }
        }
        function createMemo() {
            var i;
            var time = new Date();
            if ($scope.memos.length > 0) {
                i = $scope.memos[$scope.memos.length - 1].id + 1;
            }
            else {
                i = 1;
            }
            $scope.memos.push({
                id: i,
                title: "",
                content: "请输入内容",
                lastModified: time.toLocaleString(),
                createTime: time.toLocaleString()
            });
            save();
        }
        $scope.memos = locals.getObject('memos');
        $scope.autoSave = save;
        $scope.removeById = removeById;
        $scope.create = createMemo;
    }]);
