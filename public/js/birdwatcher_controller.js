angular.module('BirdwatcherApp').controller('BirdwatchersController', BirdwatchersController)

BirdwatchersController.$inject = ['$http'];

function BirdwatchersController($http){

  var ctrl = this;

  ctrl.all = [];

  ctrl.add = function(){
    console.log('add');
    var sighting = {
      bird: ctrl.newBird,
      date: ctrl.newDate,
      address: ctrl.newAddress
    };
    $http.post('/sightings', sighting).then(function(response){
      console.log(response.data);
      ctrl.all.push(response.data);
    })
  }

  ctrl.fetch = function(){
    $http.get('/sightings').then(function(response){
      console.log(response.data);
      ctrl.all = response.data;
    })
  }

  ctrl.fetch();
}