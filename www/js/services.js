'use strict';
angular.module('cabCall.services', ['ngResource'])
        .constant("baseURL",'http://localhost:3000/cabs')
        .factory('cabFactory', ['$resource', 'baseURL', function($resource,baseURL) {
                    
                    return $resource(baseURL+"Cab/:id",null,  {
                      'update':
                      {method:'PUT' 

                    }
                  });
                    $ionicLoading.hide();
            }])

        .factory('taxiFactory',['$http','baseURL','$ionicLoading', 
          function($http, baseURL, $ionicLoading) {
            $ionicLoading.hide();
          var cabs = [];
          $cordovaToast
          .show('Internet ivulekile', 'long', 'center')
          .then(function(success) {
            // success
          }, function (error) {
            // error
          });
         
          return {
            getCab: function(){
         
              return $http.get(baseURL +"cab/:id").then(function(response){
                  cabs = response;
                  return cabs;
              });
            }
          }
        }])
       
;
