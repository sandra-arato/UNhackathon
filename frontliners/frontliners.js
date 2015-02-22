if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', []);


  Meteor.call('retrieve_users', function (error, response) {
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
      if(Session.get('rankPeople').length > 0) {
        var users = Session.get('rankPeople'),
          len = users.length,
          i = 0;

        for(i; i < len; i++){
          var thisUser = users[i].username;
          Meteor.call('retrieve_tweet(thisUser)', function (error, response) {
            if (response) {
              users[i].lastTweet = response;
            }

            if (i%4 === 0) {
              console.log(i, users[i].username, username[i].lastTweet);
            }
          });
        }
        
      }
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
        retrieve_users: function () {
           this.unblock();
           return Meteor.http.call("GET", "http://104.236.213.224:8080/scoreboard");
        },
        retrieve_tweet: function (user) {
           this.unblock();
           var lastTweet = "http://104.236.213.224:8080/tweets/" + user
           return Meteor.http.call("GET", lastTweet);
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
