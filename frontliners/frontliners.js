if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', []);

  Meteor.call('retrieve_doc_types', function (error, response) {
    if (response) {
      Session.set('rankPeople', response.data);
    }
  });

  Meteor.startup(function(){
    if (Meteor.settings.public.ga) {
      console.log('test GA');
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    }
  })

  Template.body.helpers({
    rankPeople: function() {
      return Session.get('rankPeople');
    }
  });

  Template.body.events({
    "click .item": function(event){
      $('.menu .item').tab();
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

    Meteor.settings = {
      "public" : {
        "ga": {
          "account":"UA-60016905-1"
        }
      }
    }
  });
}
