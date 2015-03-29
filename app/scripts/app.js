angular.module('drawEverywhere', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'scripts/main/main.html',
        controller: 'MainController'
      });

    $urlRouterProvider.otherwise('/');
  });
