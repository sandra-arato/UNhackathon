if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('external_server_data', {});
  Session.setDefault('rankPeople', []);

 Meteor.call('retrieve_doc_types', function (error, response) {
   console.log(response);
   if (response) {
     Session.set('external_server_data', response);
     Session.set('loaded', true);
   }
    
 });

  Template.body.helpers({
    rankPeople: function() {
        if(loaded) {
          return Session.get('rankPeople').data;
        } else {
          return rankPeople;
        }
        
    }()
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
