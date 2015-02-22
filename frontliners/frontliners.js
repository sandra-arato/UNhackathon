if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('rankPeople', [{username: 'test1', full_name: 'Hello World', rank: '1', profile_picture_url: 'https://pbs.twimg.com/profile_images/422441705833369602/gRrKy7D3_normal.png'}]);
  Session.setDefault('friends', '');

  Session.setDefault('loggedInUser', '');

  Meteor.call('retrieve_doc_types', function (error, response) {

    if (response) {
      Session.set('rankPeople', response.data);
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
      $('article.listings section').addClass('guest');
    } else {
      $('#challenge').addClass('guest');
    }

  });

  Template.body.helpers({
    rankPeople: function() {
      return Session.get('rankPeople');
    }
  });

  Template.body.events({
    "click .item": function(event){
      $('.menu .item').tab();
    },
    "click button[type='button']": function(event){
      var $input = $(event.currentTarget).prev().find('input'),
        twitterName = $input.val();

      $input.after('<div class="ui label">' + twitterName + '<i class="delete icon"></i></div>');
      $input.val('');
      twitterName = twitterName + ',' +Session.get('friends', twitterName);
      Session.set('friends', twitterName);
      console.log(Session.get('friends'));
    },

    "click div.ui.label": function(event) {
       var $tag = $(event.currentTarget),
        twitterName = $tag.html().split('<')[0];
        console.log('tag is' + twitterName);
        $tag.remove();
        var newString = function(str) {
          var newOne = str.substr(0,str.indexOf(twitterName)) + str.substr(str.indexOf(twitterName)+twitterName.length+1);
          console.log(newOne);
          return newOne;
        }

        Session.set('friends', newString(Session.get('friends', twitterName)));
        // Session.get('friends', twitterName)
    },

    "click button[type='submit']": function(event) {
      event.preventDefault();

      var dataType = $(event.currentTarget).attr('id'),
        users = Session.get('friends'),
        message = 
        myUrl = "challenge/" + dataType + '?users=' + users + '&challenger=' + Session.get('loggedInUser') ;
        console.log('test this URL', myUrl);

      $.ajax({
        type: "GET",
        url: myUrl,
        data: {},
        success: function(){ console.log('tweet sent')}
      });

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
