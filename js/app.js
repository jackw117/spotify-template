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
  $scope.getArtists = function(num) {
    $http.get(artistSearch + $scope.track + offsetUrl + num).success(function(response){
      $scope.data = $scope.artists = response.artists.items;
      $scope.songOptions = [];
      $scope.success = false;
      $scope.search = true;
      //fix no-image
      /*if (data.images == undefined) {
        $scope.artists.images = new {height:300, url:"img/noPhoto-icon.png", width:300}
      }*/
    });
  }

  $scope.getTopSongs = function(id) {
    $scope.artists = null;
    $scope.success = false;
    console.log(id);
    $scope.artistID = id;
    $scope.songOptions = [];
    $http.get(artistGet + id + '/top-tracks?country=' + $scope.country).success(function(response){
      if (response.tracks.length == 0) {
        alert('not available in your country');
      } else {
        if (response.tracks.length >=2) {
          for (var i = 0; i < 2; i++) {
            var random = Math.floor(Math.random() * response.tracks.length);
            $scope.songOptions.push(response.tracks[random]);       
          }
        }
        checkRepeats();
        console.log($scope.songOptions);
        $scope.pickSong();
      }
    });
  }

  $scope.pickSong = function() {
    var random = Math.floor(Math.random() * $scope.songOptions.length);
    $scope.playSong = $scope.songOptions[random];
    console.log($scope.songOptions[random].preview_url);
  }

  /*$scope.getAlbums = function(id) {
    $scope.artists = null;
    $scope.songOptions = [];
    $scope.artistID = id;
    $http.get(artistGet + id + '/albums').success(function(response){  
      $scope.total = response.total;
      console.log(id);
      //random is THE SAME random I think
      var randoms = [];
      if (response.total >= 4) {
        for (var i = 0; i < 4; i++) {
          var random = Math.floor(Math.random() * $scope.total);
          $scope.getAnAlbum(random, id);
        }
      } else {
        for (var i = 0; i < response.total; i++) {
          var random = Math.floor(Math.random() * $scope.total);
          $scope.getAnAlbum(random, id);        
        }
      }
    });
  }*/

  /*$scope.getAnAlbum = function(num, id) {
    $http.get(artistGet + id + '/albums?limit=1&offset=' + num).success(function(response){
      console.log(response);
      $scope.getSongs(response.items[0].id);
    });
  }*/

  /*$scope.getSongs = function(id) {
    $http.get(albumGet + id + '/tracks').success(function(response){
      console.log(id);
      console.log(response.items);
      $scope.getASong(response.items);
    });
  }*/

  /*$scope.getASong = function(data) {
    
    var songArr = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].artists[0].name === $scope.name) {
        songArr.push(data[i].artists.name);
      }
    }
    var random = Math.floor(Math.random() * songArr.length);
    $scope.songOptions.push(songArr[random]);
    checkRepeats();
    console.log($scope.songOptions);
    //right now, it always places the correct one last
    $scope.playSong = data[random].preview_url;
    //$scope.play($scope.playSong);
  }*/

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
      console.log(name);
      console.log($scope.playSong.name);
      $scope.success = true;
    }
  }

  $scope.getRelatedArtists = function(id) {
    $http.get(artistGet + id + '/related-artists').success(function(response){
      var random = Math.floor(Math.random() * response.artists.length);
      $scope.getTopSongs(response.artists[random].id);
    });
  }

  /*function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }*/

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
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
