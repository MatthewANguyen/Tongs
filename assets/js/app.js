      // 2. This code loads the IFrame Player API code asynchronously.
      // var tag = document.createElement('script');

      // tag.src = "https://www.youtube.com/iframe_api";
      // var firstScriptTag = document.getElementsByTagName('script')[0];
      // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      // <script src="https://www.youtube.com/iframe_api"></script>

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.


      // Initialize Firebase
      var config = {
          apiKey: "AIzaSyC_Bz_Anlmg6SWbW7PcThRkbUAE78CPeQY",
          authDomain: "tongs-93168.firebaseapp.com",
          databaseURL: "https://tongs-93168.firebaseio.com",
          projectId: "tongs-93168",
          storageBucket: "",
          messagingSenderId: "316564301089"
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

      // $("#search-input").on("click", function() {
      //     console.log('', "hello");
      // })

      $.ajax({
          url: toQueryString(),
          method: "GET",
          dataType: "json"
      }).done(function(response) {
          //response == json tree
          //onYouTubeIframeAPIReady(response.id)
      });





      // toQueryString: function() {
      //    var queryString = '';
      //    for (var i in this.queryParams) {
      //      queryString += '&' + i + '=' + this.queryParams[i];
      //    }
      //    return this.baseUrl + '?' + queryString.trim('&');
      //  }
   