PlayersList = new Mongo.Collection("players");
if (Meteor.isClient) {
  Templaye.leaderboard.helpers({
    'player': function(){
      return "Some other text";
    }
  })
}
