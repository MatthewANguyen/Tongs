// 2. This code loads the IFrame Player API code asynchronously.
      // var tag = document.createElement('script');

      // tag.src = "https://www.youtube.com/iframe_api";
      // var firstScriptTag = document.getElementsByTagName('script')[0];
      // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      // <script src="https://www.youtube.com/iframe_api"></script>

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.


      // Initialize Firebase
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
          console.log(qString);
          return baseUrl + "?" + qString.trim('&');
      }

      //console.log('', toQueryString());

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
        var displayDiv = $("<div>" + displayItem.title + "</div>");
        var imgDiv = $("<img src='" + displayItem.thubmnail + "'/>")
        displayDiv.append(imgDiv)
        $("#main-display")
          .append(displayDiv)
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
// CANNOT SEPERATE THESE FUNCTION BECAUSE THE "RESPONSE." CALLS ARE REFERENCING NOTHING. LINES 114 - 117
        function displayResults(response){
          console.log("start of for loop");
          for(var i = 0; 0<response.items.length; i++){   
            var videoId = response.items[i].id.videoId;
            var title = response.items[i].snippet.title;
            console.log("response.items.snippet", response.items[i].snippet.thumbnails)
            var thubmnail = response.items[i].snippet.thumbnails.default.url;
            var result  = new displayItem(title, videoId, thubmnail);
            console.log("about to display the " + i + " element");
            display(result, i);
          }
      }
$(document).ready(function(){
      $("#video1").on( "click", function()  {
        event.preventDefault();
        queryString.q = $("#search-input1").val().trim();
        console.log(queryString.q);
        ajaxCall();
      });
})