'use strict'

angular.module('twApp')
.controller('MainCtrl', function($log, $scope, $timeout) {
  var tweetsToShow = [];
  var newId = '';
  var oldId = '';
  // initIds -> populateTweets (-> getOldTweets) -> showTweets
  //                ^----------------------------------|
  var initIds = function() {
    Meteor.call('statuses', function(error, result) {
      if (error) {

      } else {
        newId = result[0].id_str;
        oldId = result[0].id_str;
        tweetsToShow = [result[0]];
        populateTweets();
      }
    });
  };

  var populateTweets = function() {
    Meteor.call('statuses', { since_id: newId }, function(error, result) {
      if (error) {

      } else {
        $log.log('number of new tweets returned: ' + result.length);
        if(result.length) {
          tweetsToShow = tweetsToShow.concat(result);
          newId = result[0].id_str;
          showTweets();
        } else {
          getOldTweets();
        }
      }
    });
  };

  var getOldTweets = function() {
    Meteor.call('statuses', { max_id: oldId }, function(error, result) {
      if (error) {

      } else {
        $log.log('number of old tweets returned: ' + result.length);
        tweetsToShow = tweetsToShow.concat(result);
        oldId = result[result.length - 1].id_str;
        showTweets();
      }
    });
  };
  $scope.text = '';
  var showTweets = function() {
    if (tweetsToShow.length) {
      var tweet = tweetsToShow.shift();
      if (tweet.retweeted_status) {
        var text = tweet.retweeted_status.text;
      } else {
        var text = tweet.text;
      }
      $scope.text = text;
      $timeout(showTweets, 5000);
    } else {
      populateTweets();
    }
  };

  initIds();

  $scope.page = 1
  $scope.perPage = 3
  $scope.sort = {name_sort : 1};
  $scope.orderProperty = '1'

  $scope.helpers({
    things: function() {
      return Things.find({}, {
        sort: $scope.getReactively('sort')
      });
    },
    thingsCount: function() {
      return Counts.get('numberOfThings');
    }
  });

  $scope.subscribe('things', function() {
    return [{
      sort: $scope.getReactively('sort'),
      limit: parseInt($scope.getReactively('perPage')),
      skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
    }, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Things.insert($scope.newThing);
      $scope.newThing = undefined;
    }
  };

  $scope.remove = function(thing) {
    Things.remove({_id: thing._id});
  };

  $scope.pageChanged = function(newPage) {
    $scope.page = newPage;
  };

  return $scope.$watch('orderProperty', function() {
    if ($scope.orderProperty) {
      $scope.sort = {
        name_sort: parseInt($scope.orderProperty)
      };
    }
  });
});
