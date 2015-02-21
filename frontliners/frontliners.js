if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.body.helpers({
    rankPeople: [
      { name: 'Avarage Joe', twitter: '@test1', score: '23'},
      { name: 'Jane Smith', twitter: '@smithy', score: '45'},
      { name: 'Sam Something', twitter: '@smmy', score: '12'}
    ]
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
