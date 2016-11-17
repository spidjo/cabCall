// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cabCall', ['ionic','ionic.service.core', 'ngCordova', 'cabCall.controllers','cabCall.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $timeout(function(){
      $cordovaSplashscreen.hide();
    },2000);
  });
  $rootScope.$on('loading:show', function(){
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...'
    })
  });

  $rootScope.$on('loading.hide', function(){
    $ionicLoading.hide();
  });

  $rootScope.$on('$stateChangeStart', function(){
    console.log('Loading...');
    //$rootScope.$broadcast('loading:show');
  });

  $rootScope.$on('$stateChangeSuccess', function(){
    console.log('Done');
    $rootScope.$broadcast('loading.hide');
  });

  $rootScope.previousState;
$rootScope.currentState;
$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    console.log('Previous state:'+$rootScope.previousState)
    console.log('Current state:'+$rootScope.currentState)
});
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      },
      resolve: {
                id: ['$stateParams', function ($stateParams) {
                        return $stateParams.id; //By putting this here... (STEP 1)
                    }]
            }
    }
  })

  .state('app.aboutUs', {
      url: '/aboutUs',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutUs.html'
        }
      }
    })
    .state('app.cab', {
      url: '/cab',
      views: {
        'menuContent': {
          templateUrl: 'templates/cab.html',
          controller: 'MapCtrl',
          resolve: {
            cabs: ['$stateParams','cabFactory', function($stateParams, cabFactory){
              return cabFactory.query();
             }]
          }
        }
      }
    })

    .state('app.cabDetails', {
      url: '/cabs/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/cabDetails.html',
          controller: 'cabDetailController',
          resolve: {
            cab: ['$stateParams','cabFactory', function($stateParams, cabFactory){
                return cabFactory.get({id:parseInt($stateParams.id, 10)});
            }]
          }
        }
      }
    })
  $urlRouterProvider.otherwise('/app/home');
});
