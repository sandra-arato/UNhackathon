if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', []);

  Meteor.call('retrieve_doc_types', function (error, response) {
    console.log(response);
    if (response) {
      Session.set('rankPeople', response.data);
    }
 });

  Template.body.helpers({
    rankPeople: function() {
      return Session.get('rankPeople');
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.methods({
        // Declaring a method
        retrieve_doc_types: function () {
           this.unblock();
           return Meteor.http.call("GET", "http://104.236.213.224:8080/scoreboard");
        }
    });
  });
}
