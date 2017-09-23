

      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyC2HA7n0Xg2eXr8chPxyWFGr8dgNM6UWbY",
        authDomain: "tongs-573e7.firebaseapp.com",
        databaseURL: "https://tongs-573e7.firebaseio.com",
        projectId: "tongs-573e7",
        storageBucket: "tongs-573e7.appspot.com",
        messagingSenderId: "483788713808"
      };
      firebase.initializeApp(config);

      var database = firebase.database();

      var player;

      var queryString = {
          part: "snippet",
          q: "",
          type: "video",
          key: "AIzaSyDsa_IgEMmQB1LC2r251MoZVFJmWr9al8Y"

      }

      function onYouTubeIframeAPIReady(id) {
          player = new YT.Player('player', {
              height: '390',
              width: '640',
              videoId: id,
              playerVars: { 'controls': 0 },
              events: {
                  'onReady': onPlayerReady,
                  'onStateChange': onPlayerStateChange
              }
          });
      }
      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
          event.target.playVideo().mute();

      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;

      function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.PLAYING && !done) {
              setTimeout(stopVideo, 10000);
              done = true;
          }
      }

      function stopVideo() {
          player.stopVideo();
      }



      function toQueryString() {
          var baseUrl = "https://www.googleapis.com/youtube/v3/search"
          var qString = '';
          for (var i in this.queryString) {
              qString += '&' + i + '=' + this.queryString[i];
          }
          return baseUrl + "?" + qString.trim('&');
      }

      $.ajax({
          url: toQueryString(),
          method: "GET",
          dataType: "json"
      }).done(function(response) {
          //response == json tree
          //onYouTubeIframeAPIReady(response.id)
          console.log(response);
      });

      /**
       * [saveMashup writes the mashup information to firebase]
       * @param  {[ajax response]}  json    [the ajax response which contains the JSON from YouTube API]
       * @param  {Boolean} isVideo [if user searched by video, set to true]
       * @return {[void]}          [description]
       */
      // function saveMashup(json, isVideo) {
      //   if(isVideo) {
      //     database.ref().push({
      //       videoID: json.items[/*index*/].id.videoID,
      //       audioID: /* Reference to audio ID*/,
      //       upvotes: 0,
      //       videoThumbnail: json.items[/*index*/].snippet.thumbnails.default.url,
      //       title: json.items[/*index*/].snippet.title,
      //       dateAdded: firebase.database.ServerValue.TIMESTAMP
      //     });
      //   } else {
      //     database.ref().push({
      //       videoID: /* Reference to video ID*/,
      //       audioID: json.items[/*index*/].id.videoID,
      //       upvotes: 0,
      //       videoThumbnail: /* Reference to video thumbnail*/,
      //       title: /* Reference to video title*/,
      //       dateAdded: firebase.database.ServerValue.TIMESTAMP
      //     });
      //   }
      // }

      function findVideoByGoogleID() {

      }

      function findVideoByFirebaseID(id, cb_success, cb_err) {
        return database.ref().child("videos/" + id).once('value').then(cb_success, cb_err);
      }

      function addVideo(object) {
        console.log("add video");
        return database.ref().child("videos").push(object).key;
      }

      

      function findFirebase_success(res) {
        console.log("RESPONSE", res);
      }

      function findFirebase_err(err) {
        console.error("ERROR - Something went wrong fetching from Firebase", err);
      }

      $(document).ready(function() {

        var trend = {
          videoID: "matt",
          audioID: "matt's voice",
          upvotes: 10000000,
          videoThumbnail: "picture",
          title: "karioke"
        };

        $("#test").on('click', function() {
        console.log("TEST BUTTON CLICKED");
        findVideoByFirebaseID('-KuXauXkh6mlz7Ai4Mi9', findFirebase_success, findFirebase_err);
      });
        // var trendID = addVideo(trend);
        // console.log(trendID);
      })

      // function displaySearch(isVideo, jsonTree) {
      //   $("main-display").empty();
      //   for(var i = 0; i < 0 /*amount of videos returned in JSON*/; i++) {
      //     if(isVideo) {
      //       var preview = $("<div>");
      //       preview
      //         .append($("<h1>").text(/*Title*/))
      //         .append($("<div>").append(/*Thumbnail*/))
      //         .data(jsonTree)
      //         .on("click", function() {
      //           displayMashup();
      //         })
      //       }
      //     }
      //   }
      
      function displayItem(title, videoId, thubmnail){
        this.title = title;
        this.audioId = "";
        this.videoId = videoId;
        this.thubmnail = thubmnail;
        this.upvotes = 0;
      }
      
      function display(displayItem, num){
        if(num === 0){
          $("#main-display").empty();
        }//append the new div
        var displayDiv = $("<div></div>");
        displayDiv.addClass("resultCard");
        var titleDiv = $("<h3>" + displayItem.title + "</h3>");
        titleDiv.addClass("titleDisplay");
        var imgDiv = $("<img src='" + displayItem.thubmnail + "'/>");
        displayDiv.append(imgDiv);
        displayDiv.append(titleDiv);
        $("#main-display")
          .append(displayDiv);
      }

      function ajaxCall(){
        $.ajax({
            url: toQueryString(),
            method: "GET",
            dataType: "json"
        }).done(function(response) {
            displayResults(response);
          });
        }

      function displayResults(response){
          // console.log("start of for loop");
          for(var i = 0; i<response.items.length; i++){   
           
            var videoId = response.items[i].id.videoId;
            var title = response.items[i].snippet.title;
            // console.log("response.items.snippet", response.items[i].snippet.thumbnails)
            var thubmnail = response.items[i].snippet.thumbnails.default.url;
            var result  = new displayItem(title, videoId, thubmnail);
            // console.log("about to display the " + i + " element");
            display(result, i);
          }
      }
$(document).ready(function(){
      $("#video1").on( "click", function()  {
        event.preventDefault();
        queryString.q = $("#search-input1").val().trim();
        // console.log(queryString.q);
        ajaxCall();
      });
})
