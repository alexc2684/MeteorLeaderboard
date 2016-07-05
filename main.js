PlayersList = new Mongo.Collection("players");
if (Meteor.isServer) {
  Meteor.publish("thePlayers", function(){
    var currentUserId = this.userId;
    return PlayersList.find( {createdBy: currentUserId} );
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('thePlayers');
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({createdBy: currentUserId}, { sort: {score: -1, name: 1} } );
    },
    'selectedClass': function(){
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if (playerId == selectedPlayer){
          return "selected";
        }
    },
    'selectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne({ _id: selectedPlayer });
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerName = event.target.playerName.value;

      Meteor.call('createPlayer', playerName);
      event.target.playerName.value = "";
    }
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('increment', selectedPlayer, 5);
    },
    'click .dec': function(){
      var selected = Session.get('selectedPlayer');
      Meteor.call('increment', selected, -5);
    },
    'click .remove': function(){
      var selected = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selected);

    }
  });
}

Meteor.methods({
  'createPlayer': function(playerName){
    check(playerName, String);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayersList.insert({name: playerName, score: 0, createdBy: currentUserId});
    }
  },
  'removePlayer': function(selectedPlayer){
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayerList.remove({_id: selectedPlayer, createdBy: currentUserId});
    }
  },
  'increment':function(selectedPlayer, number){
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if (currentUserId) {
      PlayersList.update({_id: selectedPlayer }, {$inc: {score: number}});
    }
  }
})
