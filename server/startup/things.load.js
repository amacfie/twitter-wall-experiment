Meteor.startup(function() {
  Future = Npm.require('fibers/future');
  fs = Npm.require('fs');

  console.log('we\'re at ' + process.cwd());
  console.log('base: ' + process.env.PWD);
  Twit = new TwitMaker(Meteor.settings.twitConfig);

  if(Things.find().count() === 0) {
    var things = [
      'Data on the Wire',
      'One Language',
      'Database Everywhere',
      'Latency Compensation',
      'Full Stack Reactivity',
      'Embrace the Ecosystem',
      'Simplicity Equals Productivity'
    ];
    things.forEach(function(thing) {
      Things.insert({
        name: thing,
        name_sort: thing.toLowerCase(),
        createdAt: new Date()
      });
    });
  }
});
