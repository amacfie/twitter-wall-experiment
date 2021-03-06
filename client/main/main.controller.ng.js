'use strict'

angular.module('twApp')
.controller('MainCtrl', function($log, $scope, $timeout) {
  var tweetsToShow = [];
  var newId = '';
  var oldId = '';
  //                                                  |---v
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
  $scope.text = 'Loading...';
  var showTweets = function() {
    if (tweetsToShow.length) {
      var tweet = tweetsToShow.shift();
      if (tweet.retweeted_status) {
        var text = tweet.retweeted_status.text;
      } else {
        var text = tweet.text;
      }
      // validate, re-call on failure
      var show = true;
      if (text.length < 5) {
        show = false;
      }
      if (tweet.in_reply_to_status_id) {
        show = false;
      }
      if (text.indexOf('http://') >= 0 || text.indexOf('https://') >= 0) {
        show = false;
      }
      if (!show) {
        showTweets();
        return;
      }

      $scope.text = text;
      $timeout(showTweets, 10000);
    } else {
      populateTweets();
    }
  };

  initIds();
});
