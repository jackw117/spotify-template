var data;
var artistSearch = 'https://api.spotify.com/v1/search?type=artist&query=';
var artistGet = 'https://api.spotify.com/v1/artists/';
var albumGet = 'https://api.spotify.com/v1/albums/';
var myApp = angular.module('myApp', []);
var offsetNum = 0;
var offsetUrl = '&offset=';

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.songOptions = [];
  $scope.audioObject = {};
  $scope.number = offsetNum;
  $scope.search = true;
  
  $scope.getArtists = function(num) {
    $http.get(artistSearch + $scope.track + offsetUrl + num).success(function(response){
      $scope.data = $scope.artists = response.artists.items;
      console.log($scope.data.length);
      $scope.songOptions = [];
      $scope.success = false;
      $scope.search = false;
      $scope.fail = false;
      $scope.playSong = null;
      $scope.notAvailable = false;
    });
  }

  $scope.getTopSongs = function(id) {
    $scope.artists = null;
    $scope.search = false;
    $scope.success = false;
    $scope.fail = false;
    $scope.notAvailable = false;
    console.log(id);
    $scope.artistID = id;
    $scope.songOptions = [];
    $http.get(artistGet + id + '/top-tracks?country=' + $scope.country).success(function(response){
      if (response.tracks.length >=2) {
        for (var i = 0; i < 2; i++) {
          var random = Math.floor(Math.random() * response.tracks.length);
          $scope.songOptions.push(response.tracks[random]);       
        }
        checkRepeats();
        console.log($scope.songOptions);
        $scope.pickSong();
      } else {
        $scope.notAvailable = true;
      }
    }).error(function() {
      $scope.notAvailable = true;
    });
  }

  $scope.pickSong = function() {
    var random = Math.floor(Math.random() * $scope.songOptions.length);
    $scope.playSong = $scope.songOptions[random];
    console.log($scope.songOptions[random].preview_url);
  }

  var checkRepeats = function() {
    for (var i = 0; i < $scope.songOptions.length; i++) {
      for (var j = 0; j < $scope.songOptions.length; j++) {
        if (j != i) {
          if ($scope.songOptions[j] === $scope.songOptions[i]) {
            $scope.songOptions[i] = $scope.getTopSongs($scope.artistID);
            j = 0;
            i = 0;
          }
        }
      }
    }
    checkUndefined();
  }

  var checkUndefined = function() {
    for (var i = 0; i < $scope.songOptions.length; i++) {
      if ($scope.songOptions[i] == undefined) {
        $scope.songOptions.splice(i, 1);
      }
    }
  }

  $scope.checkGuess = function(name) {
    if (name === $scope.playSong.name) {
      $scope.success = true;
      $scope.fail = false;
    } else {
      $scope.fail = true;
      $scope.success = false;
    }
  }

  $scope.getRelatedArtists = function(id) {
    $http.get(artistGet + id + '/related-artists').success(function(response){
      var random = Math.floor(Math.random() * response.artists.length);
      $scope.getTopSongs(response.artists[random].id);
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

  $scope.more = function() {
    offsetNum += 20;
    $scope.number = offsetNum;
    $scope.artists = null;
    $scope.getArtists(offsetNum);
  }

  $scope.previous = function() {
    offsetNum -= 20;
    $scope.number = offsetNum;
    $scope.artists = null;
    $scope.getArtists(offsetNum);
  }

  $scope.reset = function() {
    offsetNum = 0;
    $scope.number = offsetNum;
  }

  $scope.$watch('playSong', function(){
    $scope.play($scope.playSong.preview_url);
  });
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
