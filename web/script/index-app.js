var scotchApp = angular.module('scotchApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'ngCookies']);

// configure our routes
scotchApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
scotchApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
        templateUrl: 'index-view.html',
        controller: 'mainController'
    })

    // route for the about page
    .when('/detail/:id', {
        templateUrl: 'detail-view.html',
        controller: 'mainController'
    })

    .when('/categories/:id', {
            templateUrl: 'categories.html',
            controller: 'mainController'
        })
        .when('/author/:id', {
            templateUrl: 'author.html',
            controller: 'mainController'
        })

    .when('/search/:_term', {
        templateUrl: 'search.html',
        controller: 'mainController'
    })

    .when('/login', {
        templateUrl: 'login.html',
        controller: 'mainController'
    });

});

scotchApp.controller('mainController', function($scope, $http, $routeParams, $location, $cookieStore) {
    // create a message to display in our view
    var root = "https://green-web-blog.herokuapp.com";


    //Get Category and Article
    $scope.apiGetCat = function() {
        $http.get(root + "/api/categories")
            .then(function(response) {
                //
                $scope.categories = response.data;
            });

    };

    $scope.apiGetArt = function() {
        $http.get(root + "/api/articles")
            .then(function(response) {
                //
                $scope.articles = response.data;
            });

    };


    $scope.init = function() {
        $scope.apiGetCat();
        $scope.apiGetArt();
    };
    $scope.getArticleID = function() {
        var id = $routeParams.id;
        $scope.currentArticleID = id;
    };
    $scope.getAllArticleinCategories = function() {
            $scope.currentCategoryID = $routeParams.id;
            $scope.articlesInCategory = getArticlesById($scope.currentCategoryID);
        }
        //Begin get articles by id
    var getArticlesById = function(id, maximumArticle) {
        if (maximumArticle === undefined) {
            if ($scope.articles === undefined) {
                maximumArticle = 0;
            } else {
                maximumArticle = $scope.articles.length;
            }
        }
        var articles = [];
        angular.forEach($scope.articles, function(value, key) {
            if (value._category._id === id && articles.length < maximumArticle) {
                articles.push(value);
            }
        });
        return articles;

    };

    //Search Aritcle
    $scope.getArticleBySearchKey = function() {
        $scope.keyWord = $routeParams._term;
        $http.get(root + '/api/articles/search/' + $scope.keyWord)
            .then(function successCallbak(response) {
                $scope.articleGetByKey = response.data;
            }, function errorCallback(response) {
                console.log(data, status, headers, config);
            });
    }

    //Login
    $scope.login = function() {
        console.log($scope.user);

        $http.post(root + '/api/users/auth', $scope.user)
            .then(function successCallback(response) {
                var isSuccess = response.data.success;
                if (isSuccess === true) {
                    $cookieStore.put('token', response.data.token);
                    $cookieStore.put('user', response.data.user);
                    $scope.user = $cookieStore.get('user');
                    $scope.token = $cookieStore.get('token');
                    //Redirect here
                    window.location.href = 'index.html'
                    $scope.init();
                } else {
                    //Raise Error
                    // alert(response.message);
                }
            }, function errorCallback(response) {
                console.log(data, status, headers, config);
            });
    };

    $scope.loadLogin = function() {
        var token = $cookieStore.get('token');
        if (token !== undefined) {
            $location.url("/")
        }
    }

    $scope.isLogged = function() {
            if ($cookieStore.get('token') != undefined) {

                return true;

            } else {
                return false;
            }
        }
        //Comment
    $scope.addCommentforArticle = function() {
            $scope.newComment._user = $scope.user;
            $http.put(root + '/api/article/comment/' + $scope.article._id, $scope.newComment)
                .then(function successCallbak(response) {
                    $scope.newComment.commentContent = "";
                    $scope.article = response.data;

                }, function errorCallback(response) {
                    console.log(data, status, headers, config);
                });
        }
        //Author
    $scope.getAllArticleByAuthor = function() {
        $scope.currentCategoryID = $routeParams.id;
        $scope.articlesByAuthor = getArticlesByAuthorId($scope.currentCategoryID);
    }

    //Begin get articles by author id

    var getArticlesByAuthorId = function(id, maximumArticle) {
        if (maximumArticle === undefined) {
            if ($scope.Articles === undefined) {
                maximumArticle = 0;
            } else {
                maximumArticle = $scope.Articles.length;
            }
        }
        var articles = [];
        angular.forEach($scope.Articles, function(value, key) {
            if (value._author._id === id && articles.length < maximumArticle) {
                articles.push(value);
            }
        });
        return articles;

    };
    // //Begin Sort Array
    var compare = function(a, b) {
        // Use toUpperCase() to ignore character casing
        const genreA = a.comments.length;
        const genreB = b.comments.length;

        let comparison = 0;
        if (genreA > genreB) {
            comparison = -1;
        } else if (genreA < genreB) {
            comparison = 1;
        }
        return comparison;
    }
    var compareValues = function(key, order = 'asc') {
        return function(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }
    var maxRandomArticleNumber = 3;
    var maxPopularArticlesNumber = 3;
    var idCat1 = "5983510622fd58000478aaa8";
    var idCat2 = "5981d787b38ced0004f0c5db";
    var idCat3 = "5981d805b38ced0004f0c5dd";
    var myId = "5981d84fb38ced0004f0c5df";

    // $scope.init = function() {
    //     $scope.user = $cookieStore.get('user');
    //     $scope.token = $cookieStore.get('token');
    // }

    // Pagination


    //Scope watch
    $scope.$watchCollection("articles", function(newArticles, oldArticles) {


        if (newArticles != undefined) {

            //Begin Find current article
            angular.forEach(newArticles, function(value, key) {
                if (value._id === $scope.currentArticleID) {

                    $scope.article = value;
                    return false;
                }
            });
            $scope.getAllArticleinCategories();



            //Begin Find Article in Category


        }
        //Begin Pagination
        $scope.viewby = 4;
        $scope.totalItems = newArticles.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 5;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function(num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1;
            }
            //Update Most Comments Articles
        $scope.allArticles = newArticles.slice();
        $scope.mostCommentsArticles = $scope.allArticles.sort(compare);

        //Update Popular Articles

        $scope.popularArticles = newArticles.slice(0, maxPopularArticlesNumber);

        //Update New Articles
        var arrayallNewArticles = newArticles.slice();
        $scope.allNewArticles = arrayallNewArticles.sort(compareValues('createdDate', 'desc'));

        //Update random articles
        $scope.randomArticles = [];
        var listArticles = newArticles.slice();
        for (var i = 0; i < maxRandomArticleNumber; i++) {
            if (listArticles.length > 0) {
                var random = Math.floor(Math.random() * listArticles.length);
                $scope.randomArticles.push(listArticles[random]);
                listArticles.splice(random, 1);
            };
        };

        //Const
        $scope.articlesInCat1 = getArticlesById(idCat1);
        $scope.articlesInCat2 = getArticlesById(idCat2);
        $scope.totalItemsCategory2 = $scope.articlesInCat2.length;
        $scope.articlesInCat3 = getArticlesById(idCat3);
        $scope.totalItemsCategory3 = $scope.articlesInCat3.length;
        //Dynamic
    });
});