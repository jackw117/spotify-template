var data;
var baseUrl = 'https://api.spotify.com/v1/search?q=year%3A2001&type=artist&market=US';
var myApp = angular.module('myApp', [])
var endUrl = "&limit=20&offset=20";

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {};
  $scope.getSongs = function() {
    var offset = 200;
    $http.get(baseUrl + endUrl).success(function(response){
      data = $scope.tracks = response.tracks.items;
      console.log(tracks);
    });
  }

  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play(); 
      $scope.currentSong = song;
    }
  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
