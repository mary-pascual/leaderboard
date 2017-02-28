Skip to content
This repository
Search
Pull requests
Issues
Gist
@mary-pascual
Sign out
Watch 2
Star 4
Fork 6 realdavidturnbull/leaderboard-v4
Code  Issues 3  Pull requests 0  Projects 0  Wiki  Pulse  Graphs
Tree: 7b28d22ad0 Find file Copy pathleaderboard-v4/leaderboard.js
7b28d22  on Apr 8, 2016
dturnbull 12 - Methods
0 contributors
RawBlameHistory
88 lines (83 sloc)  2.87 KB
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({ createdBy: currentUserId },
          { sort: {score: -1, name: 1} });
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    },
    'selectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne({ _id: selectedPlayer });
    }
  });
  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, 5);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, -5);
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    }
  });
  Template.addPlayerForm.events({
    'submit form': function(){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call('createPlayer', playerNameVar);
      event.target.playerName.value = "";
    }
  });

  Meteor.subscribe('thePlayers');

}

if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });
}

Meteor.methods({
  'createPlayer': function(playerNameVar){
    check(playerNameVar, String);
    var currentUserId = Meteor.userId();
    if(currentUserId){
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
    }
  },
  'removePlayer': function(selectedPlayer){
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if(currentUserId){
      PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    }
  },
  'updateScore': function(selectedPlayer, scoreValue){
    check(selectedPlayer, String);
    check(scoreValue, Number);
    var currentUserId = Meteor.userId();
    if(currentUserId){
      PlayersList.update( { _id: selectedPlayer, createdBy: currentUserId },
          { $inc: {score: scoreValue} });
    }
  }
});
Contact GitHub API Training Shop Blog About
© 2017 GitHub, Inc. Terms Privacy Security Status Help