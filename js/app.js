/* The javascript file for the Spotify Challenge that uses angular to retrieve
data from the Spotify API */

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
  
  //gets artists with names that match what the user inputs
  $scope.getArtists = function(num) {
    $http.get(artistSearch + $scope.track + offsetUrl + num).success(function(response){
      $scope.artists = [];
      $scope.badName = false;
      for (var i = 0; i < response.artists.items.length; i++) {
        $scope.artists.push(response.artists.items[i]);
      }
      if (response.artists.total == 0) {
        $scope.badName = true;
      }
      $scope.songOptions = [];
      $scope.success = false;
      $scope.search = false;
      $scope.fail = false;
      $scope.playSong = null;
      $scope.notAvailable = false;
      $scope.noRelated = false;
    });
  }

  //gets the top songs of a given artist, and randomly picks two of them as options
  //for songs to play
  $scope.getTopSongs = function(id) {
    $scope.search = false;
    $scope.success = false;
    $scope.fail = false;
    $scope.notAvailable = false;
    $scope.artistID = id;
    $scope.songOptions = [];
    $scope.artists = [];
    $http.get(artistGet + id + '/top-tracks?country=US').success(function(response){
      if (response.tracks.length >=2) {
        for (var i = 0; i < 2; i++) {
          var random = Math.floor(Math.random() * response.tracks.length);
          $scope.songOptions.push(response.tracks[random]);       
        }
        checkRepeats();
        $scope.pickSong();
      } else {
        $scope.notAvailable = true;
      }
    }).error(function() {
      $scope.notAvailable = true;
    });
  }

  //picks a random song from the two options to play
  $scope.pickSong = function() {
    var random = Math.floor(Math.random() * $scope.songOptions.length);
    $scope.playSong = $scope.songOptions[random];
  }

  //checks for repeats in songOptions, and then calls checkUndefined to delete
  //anything that is undefined
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

  //deletes any undefined elements in songOptions
  var checkUndefined = function() {
    for (var i = 0; i < $scope.songOptions.length; i++) {
      if ($scope.songOptions[i] == undefined) {
        $scope.songOptions.splice(i, 1);
      }
    }
  }

  //checks to see if the user's guess matches the song playing
  $scope.checkGuess = function(name) {
    if (name === $scope.playSong.name) {
      $scope.success = true;
      $scope.fail = false;
    } else {
      $scope.fail = true;
      $scope.success = false;
    }
  }

  //gets the related artists of a current one, and then calls getTopSongs, passing
  //in the id of a random related artist
  $scope.getRelatedArtists = function(id) {
    $http.get(artistGet + id + '/related-artists').success(function(response){
      if (response.artists.length > 0) {
        var random = Math.floor(Math.random() * response.artists.length);
        $scope.getTopSongs(response.artists[random].id);      
      } else {
        $scope.noRelated = true;
        $scope.playSong = null;
      }
    });
  }

  //plays a song
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
  //displays the next 20 artists
  $scope.more = function() {
    offsetNum += 20;
    $scope.number = offsetNum;
    $scope.artists = [];
    $scope.getArtists(offsetNum);
  }

  //displays the 20 previous artists
  $scope.previous = function() {
    offsetNum -= 20;
    $scope.number = offsetNum;
    $scope.artists = [];
    $scope.getArtists(offsetNum);
  }

  //resets the offset number, making it so the first 20 artists are displayed
  $scope.reset = function() {
    offsetNum = 0;
    $scope.number = offsetNum;
  }

  //plays the song as soon as one has been chosen
  $scope.$watch('playSong', function(){
    $scope.play($scope.playSong.preview_url);
  });
});