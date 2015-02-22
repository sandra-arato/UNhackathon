if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', [{username: 'test1', full_name: 'Hello World', rank: '1', profile_picture_url: 'https://pbs.twimg.com/profile_images/422441705833369602/gRrKy7D3_normal.png'}]);
  Session.setDefault('friends', '');
  Session.setDefault('lastTweet', '');

  Session.setDefault('loggedInUser', '');
  Session.setDefault('postUrl', 'http://104.236.213.224:8080/challenge/');
  Session.setDefault('getUrl', 'http://104.236.213.224:8080/tweets/');

  Meteor.call('retrieve_doc_types', function (error, response) {

    if (response) {
      Session.set('rankPeople', response.data);
      this.array = response.data;
      // console.log(this.array);
      var len = this.array.length;

      for (var i = 0; i < len; i++) {
        var url = Session.get('getUrl') + array[i].username;
        Session.set('getUrl', url);

        Meteor.call('get_tweet(Session.get("getUrl")), Session.get("rankPeople"))', function (error, response) {
          console.log(response);
          if (response) {
            Session.get("rankPeople").forEach(function(){
              this.lastTweet = "test";
            })
              // this.array[i].lastTweet = response;
            // return Session.set('lastTweet', response);
          } else {
            // this.array[i].lastTweet = "N/A";
          }
        });
        
      };
      Session.set('rankPeople', response.data);
      console.log('test', Session.get("rankPeople"));
    }


  });


  Meteor.startup(function(){
    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var checkGuest = getParameterByName("username").length === 0 || getParameterByName("username") === "GUEST";
    Session.set('loggedInUser', getParameterByName("username"));
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
    }
  });

  // Template.people.helpers({
    // lastTweet: function(){
      
    // }
  // })

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
        // console.log('tag is' + twitterName);
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
          message = 
          myUrl = "http://104.236.213.224:8080/challenge/" + dataType + '?users=' + users + '&challenger=' + Session.get('loggedInUser') ;
          Session.set('postUrl', myUrl);
         
          Meteor.call('send_tweet(Session.get("postUrl"))', function (error, response) {
            console.log('send tweet test');
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

        send_tweet: function (str) {
           this.unblock();
           return Meteor.http.call("GET", postUrl);
        },

        get_tweet: function (str, users) {
           this.unblock();
           return Meteor.http.call("GET", getUrl, users);
        },

    });
  });
}
