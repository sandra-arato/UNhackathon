if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', [{username: 'loading', full_name: 'Hello World', rank: '1', profile_picture_url: 'https://pbs.twimg.com/profile_images/422441705833369602/gRrKy7D3_normal.png'}]);
  Session.setDefault('friends', '');
  Session.setDefault('lastTweet', '');
  Session.setDefault('rankLoaded', false);

  Session.setDefault('loggedInUser', '');
  Session.setDefault('isGuest', true);
  Session.setDefault('postUrl', 'http://104.236.213.224:8080/challenge/');
  Session.setDefault('getUrl', 'http://104.236.213.224:8080/tweets/');

  Meteor.call('retrieve_doc_types', function (error, response) {

    if (response) {
      Session.set('rankPeople', response.data);
      Session.set('rankLoaded', true);
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
    Session.set('isGuest', checkGuest);
    if (!checkGuest) {
      $('article.listings section.intro').addClass('guest');
      $('#challenge').removeClass('guest');
    } else {
      $('#challenge').addClass('guest');
      $('article.listings section.intro').removeClass('guest');
    }
    
  });

  Template.body.helpers({
    rankPeople: function() {
      return Session.get('rankPeople');
    },
    rankLoaded: function(){
      return Session.get('rankLoaded');
    }
  })

  Template.body.events({
    "click .item": function(event){
      $('.menu .item').tab();
      Session.set('friends', '');
    },

    // adding tags below the input field
    "click button[type='button']": function(event){
      var $input = $(event.currentTarget).parent().parent().find('input'),
        twitterName = $input.val();

        if(twitterName.length > 0) {
          $input.after('<div class="ui label">' + twitterName + '<i class="delete icon"></i></div>');
          $input.val('');
          twitterName = twitterName + ',' +Session.get('friends', twitterName);
          Session.set('friends', twitterName);
          console.log(Session.get('friends'));
        }

    },


    // removing tags from form and friendlist
    "click div.ui.label": function(event) {
       var $tag = $(event.currentTarget),
        twitterName = $tag.html().split('<')[0];
        $tag.remove();
        var newString = function(str) {
          var newOne = str.substr(0,str.indexOf(twitterName)) + str.substr(str.indexOf(twitterName)+twitterName.length+1);
          console.log(newOne);
          return newOne;
        }

        Session.set('friends', newString(Session.get('friends', twitterName)));
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

      if(Session.get('friends').length > 0) {
        var dataType = $(event.currentTarget).attr('id'),
          users = Session.get('friends'),
          myUrl = "http://104.236.213.224:8080/challenge/" + dataType + '?users=' + users + '&challenger=' + Session.get('loggedInUser') ;
          Meteor.call('send_tweet', myUrl, function (error, response) {

            if (response) {
              console.log(response);
            } else {
              console.log(error);
            }
          });
        Session.set('friends', '');
        $('div.ui.label').remove();

        $('div.popup').fadeIn("slow");
        setTimeout(function(){
          $('div.popup').fadeOut("slow");
        }, 2000);
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
           return Meteor.http.call("GET", "http://104.236.213.224:8080/scoreboard");
        },

        send_tweet: function (url) {
           this.unblock();
           return Meteor.http.call("POST", url);
        },

        get_tweet: function (url) {
           this.unblock();
           return Meteor.http.call("GET", getUrl);
        },

    });
  });
}
