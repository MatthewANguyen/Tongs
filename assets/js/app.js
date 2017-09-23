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
    // console.log(qString);
    return baseUrl + "?" + qString.trim('&');
}

$.ajax({
    url: toQueryString(),
    method: "GET",
    dataType: "json"
}).done(function(response) {
    //response == json tree
    //onYouTubeIframeAPIReady(response.id)
    console.log(response);  //francis uncommented this to see generated data
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
    // console.log("add video");
    return database.ref().child("videos").push(object).key;
}

/**
 * [getRandomVideo use this method to return a random video after a search]
 * @return {[String]} [the ID of the youtube video from google API]
 */
function getRandomVideo() {
    // console.log("random video return");
    return database.ref().child("trending").limitToLast(10).once("value").then(function(snapshot) {
        // console.log(snapshot.val());
        var trendingArray = Object.values(snapshot.val());
        // console.log(trendingArray, Math.floor((Math.random()) * 10));
        var randomEntry = trendingArray[Math.floor((Math.random()) * 10)]
        // console.log('run before', randomEntry);
        return randomEntry.audioID;
    });
}

// function findFirebase_success(res) {
//   console.log("RESPONSE", res);
// }

// function findFirebase_err(err) {
//   console.error("ERROR - Something went wrong fetching from Firebase", err);
// }

$(document).ready(function() {

    var randomEntry = getRandomVideo().then(function(data) {
        // console.log('run after', data);
    });

    $("#test").on('click', function() {});
})

function displayItem(title, videoId, thubmnail) {
    this.title = title;
    this.audioId = "";
    this.videoId = videoId;
    this.thubmnail = thubmnail;
    this.upvotes = 0;
}

function display(displayItem, num) {
    if (num === 0) {
        $("#main-display").empty();
    }
    //create container
    var displayDiv = $("<div>").addClass("col-xs-12")
                                .addClass("resultCard");
    // Add image to container
    $("<div>").addClass("col-xs-4")
                .append("<img src='" + displayItem.thubmnail + "' style='width:100%; margin-bottom:2%' />")
                // .css("width","100%")
                .attr("data-videoId", displayItem.videoId)
                .appendTo(displayDiv);
    // Add title to container
    $("<div>").addClass("col-xs-8")
                .addClass("titleDisplay")
                .append("<h3>" + displayItem.title + "</h3>")
                .appendTo(displayDiv);
    // add container to display
    $("#main-display").append(displayDiv);
}

function ajaxCall() {
    $.ajax({
        url: toQueryString(),
        method: "GET",
        dataType: "json"
    }).done(function(response) {
      // console.log('queryString', toQueryString);
        displayResults(response);
    });
}
// CANNOT SEPERATE THESE FUNCTION BECAUSE THE "RESPONSE." CALLS ARE REFERENCING NOTHING. LINES 114 - 117
function displayResults(response) {
    // console.log("start of for loop");
    for (var i = 0; i < response.items.length; i++) {
        var videoId = response.items[i].id.videoId;
        var title = response.items[i].snippet.title;
        // console.log("response.items.snippet", response.items[i].snippet.thumbnails)
        var thubmnail = response.items[i].snippet.thumbnails.default.url;
        var result = new displayItem(title, videoId, thubmnail);
        // console.log("about to display the " + i + " element");
        display(result, i);
    }
}


$(document).ready(function() {
    $("#video1").on("click", function() {
        event.preventDefault();

        var search = $("#search-input1").val(); // Do nothing when input field contains nothing
        if(search == ""){
            return false;
        };

        queryString.q = $("#search-input1").val().trim();
        // console.log(queryString.q);
        ajaxCall();
    });

   

    // $(".resultCard").on("click", function() {
    $("body").on("click", ".resultCard", function() {
        event.preventDefault();

       

        var videoId = $(this).attr("data-videoId");
        $("#main-display").empty();
        $("#main-display").append("<div id='player'></div>");
        onYouTubeIframeAPIReady(videoId);
        // console.log('this is vid id', videoId);
    });

 var likes = 100;
    function addLikeButton(divId) {

    // console.log('Add Like to ', divId);
    $("<button>").html("Likes " + likes)
                .addClass("btn btn-info")
                .attr("type", "button")
                .attr("id","like")
                .attr("videoId",/* videoId*/)
                .attr("audioId",/* audioId*/)
                .attr("upvotes", /* upvotes*/)
                .attr("videoThumbnail", /* thumbnail*/)
                .attr("title", /* title*/)
                .appendTo(divId);
  }

  function addDislikeButton(divId){
    $("<button>").html("Dislikes " + likes)
                 .addClass("btn btn-info")
                 .attr("type", "button")
                 .attr("id","Dislike")
                 .attr("videoId",/* videoId*/)
                 .attr("audioId",/* audioId*/)
                 .attr("upvotes", /* upvotes*/)
                 .attr("videoThumbnail", /* thumbnail*/)
                 .attr("title", /* title*/)
                 .appendTo(divId);
  }

  // console.log('Document Loaded...FIRE \'D MISSILES!!!');
 addLikeButton("#main-display");
 addDislikeButton("#main-display");


  $(".btn-info").on("click", function(){
    console.log("Yep it working")          
  })
});

