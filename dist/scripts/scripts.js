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
    .controller('MainCtrl', ['$rootScope', '$scope', 'locals', '$timeout', '$uibModal', function ($rootScope, $scope, locals, $timeout, $uibModal) {
        // locals.setObject('memos', []);
        $scope.memos = locals.getObject('memos');
        if (!$scope.memos.length) {
            $scope.memos = [];
        }
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
        /**
         * 通过ID获取备忘录
         * 
         * @param {any} memoId 
         * @returns 
         */
        function getMemoById(memoId) {
            for (var i = 0; i < $scope.memos.length; i++) {
                if ($scope.memos[i].id === memoId) {
                    return $scope.memos[i];
                }
            }
        }
        /**
         * 通过ID设置备忘录
         * 
         * @param {number} memoId 备忘录ID
         * @param {object} memo 新的备忘录
         * @returns 
         */
        function setMemoById(memoId, memo) {
            for (var i = 0; i < $scope.memos.length; i++) {
                if ($scope.memos[i].id === memoId) {
                    $scope.memos[i] = memo;
                    save(memo.id);
                    return;
                }
            }
        }
        $scope.autoSave = save;
        $scope.removeById = removeById;
        $scope.create = createMemo;
        $scope.showEditor = function (memoId) {
            var modal = $uibModal.open({
                backdrop: 'static',
                windowClass: 'editor-modal',
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'views/editorModalTpl.html',
                size: 'lg',
                controller: function ($scope, $uibModalInstance, memo) {
                    $scope.memo = memo;
                    $scope.confirm = function () {
                        $uibModalInstance.close($scope.memo);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss();
                    };
                    $timeout(function () {
                        var editor = new Simditor({
                            textarea: $('textarea'),
                            placeholder: '请输入内容'
                        });
                        editor.on('valuechanged', function (e, src) {
                            $scope.memo.content = editor.getValue();
                        });
                    });
                },
                resolve: {
                    memo: function () {
                        return angular.copy(getMemoById(memoId));
                    }
                }
            });
            modal.result.then(function (memo) {
                setMemoById(memo.id, memo);
            }, function () { });
        };
    }]);
