'use strict';

if(Meteor.isServer) {
  Meteor.methods({
    statuses: function(options) {
      var myFuture = new Future();
      if(!options) {
        options = {};
      }
      var twitOptions = {
        owner_screen_name: 'Grognor',
        slug: 'weird-sun-twitter',
        count: 20
      };
      if (options.since_id) {
        twitOptions.since_id = options.since_id;
      } else if (options.max_id) {
        twitOptions.max_id = options.max_id;
      }
      Twit.get('lists/statuses', twitOptions, function(err, data, response) {
        console.log(data);
        myFuture.return(data);
      });

      return myFuture.wait();
    }
  });
}
