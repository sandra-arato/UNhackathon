Router.map(function () {
  this.route('about', {
    layoutTemplate: 'layout',
    yieldTemplates: {
      'footer': {to: 'footer'}
    }
  });
  this.route('home', {
    path: '/',  //overrides the default '/home'
    layoutTemplate: 'layout',
    yieldTemplates: {
      'footer': {to: 'footer'}
    }
  });
});


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('volunteer', []);
  Session.setDefault('challenged_friends', ''); // this is who we will tweet the challenge
  Session.setDefault('tweet', 'test');

  Session.setDefault('loggedInUser', '');
  Session.setDefault('isGuest', true);
  Session.setDefault('postUrl', 'http://104.236.213.224:9000/challenge/');
  Session.setDefault('getUrl', 'http://104.236.213.224:9000/tweets/');

  Meteor.call('retrieve_doc_types', function (error, response) {

    if (response) {
      Session.set('volunteer', response.data);
    }


  });


  Meteor.startup(function(){

    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var urlParam = getParameterByName("username"),
      checkGuest = urlParam.length === 0 || urlParam === "GUEST";
    Session.set('loggedInUser', getParameterByName("username"));
  });

  Template.home.helpers({
    loggedInUser: function() {
      function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      }
      var urlParam = getParameterByName("username");
      return urlParam;
    },
    volunteer: function() {
      return Session.get('volunteer');
    }
  })

  Template.list.helpers({
    tweet: function(){
      var myUrl = "http://104.236.213.224:9000/tweets/" + this.username;
      Meteor.call('get_tweet', myUrl, function (error, response) {
        if (response) {
          return response.data;
        }
      });
    }
  })

  Template.home.events({
    "click .item": function(event){
      $('.menu .item').tab();
      Session.set('challenged_friends', '');
      console.log('test tab.');
    },

    // adding tags below the input field
    "click button[type='button']": function(event){
      var $input = $(event.currentTarget).parent().parent().find('input'),
        twitterName = $input.val();

        if(twitterName.length > 0) {
          $input.after('<div class="ui label">' + twitterName + '<i class="delete icon"></i></div>');
          $input.val('');
          twitterName = twitterName + ',' +Session.get('challenged_friends', twitterName);
          Session.set('challenged_friends', twitterName);
         
        }
    },

    // removing tags from form and friendlist
    "click div.ui.label": function(event) {
       var $tag = $(event.currentTarget),
        twitterName = $tag.html().split('<')[0];
        $tag.remove();
        var newString = function(str) {
          var newOne = str.substr(0,str.indexOf(twitterName)) + str.substr(str.indexOf(twitterName)+twitterName.length+1);
          return newOne;
        }

        Session.set('challenged_friends', newString(Session.get('challenged_friends', twitterName)));
    },

    //sending friendlist, clearing ui and showing success
    "click button[type='submit']": function(event) {
      event.preventDefault();

      var $input = $(event.currentTarget).parent().parent().find('input'),
        $button = $(event.currentTarget).parent().find('button[type="button"]');
          console.log($button);
      
      if($input.val().length > 0 ) {

        $button.trigger("click");
        return;
      }

      if(Session.get('challenged_friends').length > 0) {
        var dataType = $(event.currentTarget).attr('id'),
          users = Session.get('challenged_friends'),
          myUrl = "http://104.236.213.224:8080/challenge/" + dataType + '?users=' + users + '&challenger=' + Session.get('loggedInUser') ;
          Meteor.call('send_tweet', myUrl, function (error, response) {

            if (response) {
              console.log(response);
            } else {
              console.log(error);
            }
          });
        Session.set('challenged_friends', '');
        $('div.ui.label').remove();

        $('div.popup').fadeIn("slow");
        setTimeout(function(){
          $('div.popup').fadeOut("slow");
        }, 2000);
      }

    },

    //searching for user
    "click i.icon": function(event){
      var user = $(event.currentTarget).prev().val();
      console.log(user)

      if($('#'+user).length > 0) {
        $('html, body').animate({
            scrollTop: $('#'+user).offset().top
        }, 800);
      }
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
           return Meteor.http.call("GET", "http://104.236.213.224:9000/scoreboard");
        },

        send_tweet: function (url) {
           this.unblock();
           return Meteor.http.call("POST", url);
        },

        get_tweet: function (url) {
           this.unblock();
           return Meteor.http.call("GET", url);
        },

    });
  });
}
