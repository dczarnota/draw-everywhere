angular.module('drawEverywhere', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/app/scripts/main/main.html',
        controller: 'MainController'
      });
    
    //Routes to homepage on default
    $urlRouterProvider.otherwise('/');

  });
