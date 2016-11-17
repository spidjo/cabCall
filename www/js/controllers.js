angular.module('cabCall.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaNetwork, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  $scope.enable2 = true;
  $scope.enable1 = true;
})

.controller('MapCtrl', ['$rootScope','$scope','cabs', '$ionicLoading', '$timeout','$ionicPopup', '$ionicHistory','$cordovaToast', '$cordovaNetwork',"$state", "$stateParams",
                function($rootScope,$scope, cabs, $ionicLoading, $timeout, $ionicPopup, $ionicHistory, $cordovaToast, $cordovaNetwork, $state, $stateParams) {

var enable = true;
var internet = true;
var gpsEnabled = true;
var noInternet = true;
var prevState = $rootScope.previousState;
$scope.$on("$ionicView.afterEnter", function(event, data){
   // handle event
  //
  checkInternetConn();
  if(internet){
    noInternet = true;
    checkGPSconnection();
     if(gpsEnabled){
       setUpMap();
     }
     else{
      if(!$scope.enable2){
      var confirmPopup = $ionicPopup.confirm({
          title: 'GPS Disabled' ,
          template: 'Enable GPS?'
        });
       
        confirmPopup.then(function(res) {
            if(res) {
              console.log('confirmed');
              loadAgain();
            }
            else
            {
              $ionicHistory.clearCache();
              $state.transitionTo(prevState, {}, {reload: true});
            }
          });
       }
     }
  }
  else{
    if(!$scope.enable1){
    noInternet = true;
    var confirmPopup = $ionicPopup.confirm({
          title: 'No Internet Connection' ,
          template: 'Enable Internet Connection?'
        });
       
        confirmPopup.then(function(res) {
            if(res) {
              console.log('confirmed');
              loadAgain();
            }
            else
            {
              $state.transitionTo(prevState, {}, {reload: true});
            }
          });
      }
     }

});
/*$scope.$on("$ionicView.afterEnter", function(event, data){
$cordovaToast
    .show('Internet ivulekile', 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
})*/

function checkInternetConn(){
  if (window.Connection) {
       if (navigator.connection.type == Connection.NONE) {
        internet = false;
     }else{internet = true};
  }
}

function checkGPSconnection(){
  cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
    console.log(enabled);
    gpsEnabled = enabled;
  }, function(error){
    gpsEnabled = false;
    console.error("The following error occurred: "+error);
    
});
}


function testconnection() {
  // body...

    $cordovaToast
    .show('Internet ivulekile', 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });

   
}

function loadAgain() {
  // body...
  if(noInternet){
      cordova.plugins.diagnostic.switchToMobileDataSettings();
      $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading your location...',
      delay: 3000,
      duration: 10000
   });
      $timeout(function() {checkInternetConn();}, 5000);
      
  }
  else if(!gpsEnabled){
    cordova.plugins.diagnostic.switchToLocationSettings();
    $timeout(function() {checkGPSconnection();}, 5000);
  }
      $timeout(function() {$state.go($state.current, {}, {reload: true});}, 3000);
      
      if(gpsEnabled)
        {
          setUpMap();
        }
}



  function setUpMap() {
    // body...
     $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Loading your location...'
   });
     navigator.geolocation.getCurrentPosition(function(position){
        
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     
        var mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
     
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          $ionicLoading.hide();
          var image = 'img/person.png';
        //Wait until the map is loaded
        google.maps.event.addListener($scope.map, 'idle', function(){
         if(input!== null && input.value === ""){
          marker = new google.maps.Marker({
              map: $scope.map,
              position: latLng,
              icon: image
            }); 
          }
          else {
           searchBox.addListener('places_changed', function() {
              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }

            });
          }
          var infoWindow = new google.maps.InfoWindow({
              content: "My Location"
            });
         
              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });
        });
        loadMarkers();
    },
    function(error){
      $ionicLoading.hide();
      console.log("Could not get location");
    });
  }

  function loadMarkers(){
 
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading Cabs...'
       });
      //Get all of the markers from our Markers factory
      $scope.cabs = cabs;

        var cabimage = 'img/taxi.png';
        for (var i = 0; i < $scope.cabs.length; i++) {
          var record = $scope.cabs[i];
          console.log(record.Name); 
          var markerPos = new google.maps.LatLng(parseFloat(record.Latitude), parseFloat(record.Longitude));
 
          // Add the marker to the map
          var cabMarker = new google.maps.Marker({
              map: $scope.map,
              position: markerPos,
              icon: cabimage
          },
        function(error){
      $ionicLoading.hide();
      console.log("Could not get cabs");
    });

          var infoWindowContent = record.Name ;          
 
          addInfoWindow(cabMarker, infoWindowContent, record);
          
        }
        $ionicLoading.hide();
    }

    function addInfoWindow(marker, message, record) {
 
      var infoWindow = new google.maps.InfoWindow({
          content: message

      });
      
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
           $state.transitionTo('app.cabDetails', {id:record.TaxiID}, {reload: true});
      });
 
  }
  return {
    init: function(){
      initMap();
    }
  }

}])

.controller('cabDetailController',['$scope', '$stateParams','cab', 'cabFactory', 'baseURL', 
            function($scope, $stateParams, cab, cabFactory, baseURL)  {

            $scope.baseURL = baseURL;
            $scope.cab = cab;
            console.log("nkj: " + $stateParams.TaxiID);
          /*taxiFactory.getCab().then(function(taxi){
           console.log("Taxi: ", taxi.data.Name);
            
              console.log(taxi.data.id); 
//
 
      }); */
}])