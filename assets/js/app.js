audioIdArray = ["ferZnZ0_rSM", "yL9bRzwk0Ds", "Qx4tM7z3bhs", "R1j1RRWcYSg", "GTUIlOudlHI", "y6120QOlsfU", "XUhVCoTsBaM", "r0KFfXiBLqk", "NTa6Xbzfq1U", "Y82jDHRrswc", "ZnHmskwqCCQ", "7zkX6kfnWbk", "O5lJyw_VmHw"];
videoIdArray = ["dA2j8Rq17aY", "3UUZgiQHlQU", "EJ80y2cSlFk", "7WLrL_sOpbA", "7zkX6kfnWbk", "O5lJyw_VmHw"];
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
};

function onYouTubeIframeAPIReady(videoId) {
    player = new YT.Player('videoPlayer', {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: { 'controls': 0 },
        events: {
            'onReady': mute
        }
    });
};

function playAudio(audioId) {
    console.log("hey we are in the playAudio function");
    player = new YT.Player('audioPlayer', {
        height: '0',
        width: '0',
        videoId: audioId,
        playerVars: { 'controls': 0 },
        events: {
            'onReady': blind
        }
    });
};

function mute(event) {
    event.target.playVideo().mute();
};

function blind(event) {
    event.target.playVideo();
};

function stopVideo() {
    player.stopVideo();
};

function toQueryString() {
    var baseUrl = "https://www.googleapis.com/youtube/v3/search"
    var qString = '';
    for (var i in this.queryString) {
        qString += '&' + i + '=' + this.queryString[i];
    }
    return baseUrl + "?" + qString.trim('&');
};

/**
 * [saveMashup writes the mashup information to firebase]
 * @param  {[ajax response]}  json    [the ajax response which contains the JSON from YouTube API]
 * @param  {Boolean} isVideo [if user searched by video, set to true]
 * @return {[void]}          [description]
 */
function saveMashup(button) {
    database.ref().child("trending").push({
        videoId: button.data("videoId"),
        audioId: button.data("audioId"),
        upvotes: 1,
        thumbnail: button.data("thumbnail"),
        videoTitle: button.data("videoTitle"),
        audioTitle: button.data("audioTitle"),
    });
}

function randomVideo() {
    var randomNumber = videoIdArray.length;
    var randomEntry = Math.floor((Math.random()) * randomNumber)
    return videoIdArray[randomEntry];
};

function randomAudio() {
    var randomNumber = audioIdArray.length;
    var randomEntry = Math.floor((Math.random()) * randomNumber)
    return audioIdArray[randomEntry];
};

function upvoteMashup(activeVideoID, activeAudioID, button) {
    console.log("running");
    database.ref().child("trending").orderByChild('videoId').equalTo(activeVideoID).once("value").then(function(snapshot) {
        var currentSnapshot = snapshot.val();
        var theKey = "";
        var theVideoID;
        var theAudioID;
        var theTitle;
        var theThumbnail;
        var currentUpvotes;
        for (var key in currentSnapshot) {
            console.log(currentSnapshot[key].audioID);
            console.log(activeAudioID);
            if (currentSnapshot[key].audioId == activeAudioID) {
                theKey = key;
                currentUpvotes = currentSnapshot[key].upvotes;
                currentUpvotes++;
                database.ref("/trending/" + theKey + "/upvotes").set(currentUpvotes);
                console.log("key is:  " + key);
                console.log("upvotes is: " + currentSnapshot[key].upvotes);
                $("#likeDisplay").text(currentUpvotes);
            }
        }
        if (!theKey) {
            console.log("audio doesn't match");
            $("#likeDisplay").text(1);
            saveMashup(button);
        }
    }, function(errorObject) {
        console.log("Failed" + errorObject.code);
        console.log("no match");
        $("#likeDisplay").text(1);
        saveMashup(button);
    });
}

function downvoteMashup(activeVideoID, activeAudioID, button) {
    console.log("running");
    database.ref().child("trending").orderByChild('videoId').equalTo(activeVideoID).once("value").then(function(snapshot) {
        var currentSnapshot = snapshot.val();
        console.log(currentSnapshot);
        var theKey = "";
        var theVideoID;
        var theAudioID;
        var theTitle;
        var theThumbnail;
        var currentUpvotes;
        for (var key in currentSnapshot) {
            if (currentSnapshot[key].audioId == activeAudioID) {
                theKey = key;
                currentUpvotes = currentSnapshot[key].upvotes;
                currentUpvotes--;
                database.ref("/trending/" + theKey + "/upvotes").set(currentUpvotes);
                console.log("key is:  " + key);
                console.log("upvotes is: " + currentSnapshot[key].upvotes);
                $("#likeDisplay").text(currentUpvotes);
            }
        }
    }, function(errorObject) {
        console.log("Failed" + errorObject.code);
        console.log("no match");
        $("#likeDisplay").text(currentUpvotes);
    });
}

function getRandomVideo() {
    // console.log("random video return");
        database.ref().child("trending").limitToLast(25).once("value").then(function(snapshot) {
        console.log(snapshot.val());
        var trendingArray = Object.values(snapshot.val());
        // console.log(trendingArray, Math.floor((Math.random()) * 10));
        var randomObject = trendingArray[Math.floor((Math.random()) * 25)];
        // console.log('run before', randomEntry);
        var randomMashup = new displayItem(randomObject.videoTitle, randomObject.videoId, randomObject.thumbnail);
        randomMashup.audioTitle = randomObject.audioTitle;
        randomMashup.audioId = randomObject.audioId;
        randomMashup.likes = randomObject.upvote;
        display(randomMashup, 0, true, true);
        console.log("random mashup");
    });
}

function displayItem(videoTitle, videoId, thumbnail) {
    this.audioTitle = "";
    this.videoTitle = videoTitle;
    this.audioId = "";
    this.videoId = videoId;
    this.thumbnail = thumbnail;
    this.likes = 0;
};

function display(displayItem, num, isVideo, random) {
    if (num === 0) {
        $("#main-display").empty();
    }
    var displayDiv = $("<div></div>");
    displayDiv.addClass("resultCard");
    displayDiv.addClass("col-xs-12");
    displayDiv.attr("data-thumbnail", displayItem.thumbnail);
    displayDiv.attr("data-audioTitle", displayItem.audioTitle);
    displayDiv.attr("data-videoTitle", displayItem.videoTitle);
    displayDiv.attr("data-likes", displayItem.likes);
    if(!random){  
      if (isVideo) {
          $(displayDiv).attr("data-videoId", displayItem.videoId);
          $(displayDiv).attr("data-audioId", randomAudio()); //getRandomVideo();
      } else {
          $(displayDiv).attr("data-videoId", randomVideo()); //getRandomVideo();
          $(displayDiv).attr("data-audioId", displayItem.audioId);
      }
    } else {
      $(displayDiv).attr("data-videoId", displayItem.videoId);
      $(displayDiv).attr("data-audioId", displayItem.audioId);
    }
    if (isVideo) {
        // Add image to container
        $("<div>").addClass("col-xs-4")
            .append("<img src='" + displayItem.thumbnail + "' style='margin-bottom:2%' />")
            .addClass("grow")
            .attr("data-videoId", displayItem.videoId)
            .appendTo(displayDiv);
        // Add title to container
        $("<div>").addClass("col-xs-8")
            .addClass("titleDisplay")
            .append("<h3>" + displayItem.videoTitle + "</h3>")
            .appendTo(displayDiv);
        $("#main-display")
            .append(displayDiv);
    } else {

        // Add image to container
        $("<div>").addClass("col-xs-4")
            .append("<img src='" + displayItem.thumbnail + "' style='margin-bottom:2%' />")
            .addClass("grow")
            .attr("data-videoId", displayItem.videoId)
            .appendTo(displayDiv);
        // Add title to container
        $("<div>").addClass("col-xs-8")
            .addClass("titleDisplay")
            .append("<h3>" + displayItem.audioTitle + "</h3>")
            .appendTo(displayDiv);
        $("#main-display")
            .append(displayDiv);
    }
}

function ajaxCall(isVideo) {
    $.ajax({
        url: toQueryString(),
        method: "GET",
        dataType: "json"
    }).done(function(response) {
        displayResults(response, isVideo);
    });
}

function displayResults(response, isVideo) {
    // console.log(response);
    for (var i = 0; i < response.items.length; i++) {
        var videoId = response.items[i].id.videoId;
        var title = response.items[i].snippet.title;
        var thumbnail = response.items[i].snippet.thumbnails.default.url;
        var result = new displayItem(title, videoId, thumbnail);
        if (!isVideo) {
            result.audioId = result.videoId;
            result.videoId = "";
            result.audioTitle = title;
            result.videoTitle = "";
        }
        display(result, i, isVideo);
    }
}

function loadFromAjax(isVideo) {
    queryString.q = $("#search-input1").val().trim();
    ajaxCall(isVideo);
}

$(document).ready(function() {
    $("#video1").on("click", function() {
        event.preventDefault();
        var emptyInput = $("#search-input1").val();
        if (emptyInput == "") {
            // console.log("What the heck")
            return;
        }
        loadFromAjax(true);
    });
    $("#audio1").on("click", function() {
        event.preventDefault();
        var emptyInput = $("#search-input1").val();
        if (emptyInput == "") {
            // console.log("What the heck")
            return;
        }
        loadFromAjax(false);
    });

    $("#random1").on("click", function() {
        event.preventDefault();
        var emptyInput = $("#search-input1").val();
        getRandomVideo();
    });

    // $(".resultCard").on("click", function() {
    $("body").on("click", ".resultCard", function() {
        event.preventDefault();
        var videoId = $(this).attr("data-videoId");
        var audioId = $(this).attr("data-audioId");
        var thumbnail = $(this).attr("data-thumbnail");
        var videoTitle = $(this).attr("data-videoTitle");
        var audioTitle = $(this).attr("data-audioTitle");
        var likes = $(this).attr("data-likes");
        $("#main-display").empty();
        $("#trending").empty();
        $("#side-search-bar").empty();
        $("#side-search-bar").append(
            $("<div>").addClass("col-md-2").append(
                $("<div>").addClass("input-group home-small ").append(
                    $("<div>").addClass("input-group search"))
                .append(
                    $("<input>").attr("type", "text").attr("id", "search-input1").addClass("form-control-small sideSearch").attr("placeholder", "Search for..."))
                .append(
                    $("<button>").attr("type", "button").attr("id", "video1").addClass("btn-nav btn-info btn-xs sideVideoBtn").text("Video")
                    .on("click", function() {
                        event.preventDefault();
                        loadFromAjax(true);
                    }))
                .append(
                    $("<button>").attr("type", "button").attr("id", "audio1").addClass("btn-nav btn-info btn-xs sideAudioBtn").text("Audio")
                    .on("click", function() {
                        event.preventDefault();
                        loadFromAjax(false);
                    }))
                .append(
                    $("<button>").attr("type", "button").attr("id", "random1").addClass("btn-nav btn-info btn-xs sideAudioBtn").text("Random")
                    .on("click", function() {
                        event.preventDefault();
                        getRandomVideo();
                    }))
            )
        );
        $("#main-display").append("<div id='audioPlayer'></div>");
        $("#main-display").append("<div id='videoPlayer'></div>");
        //addNumberInput($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle, 7);
        addLikeDisplay($("#main-display"), "?");
        addLikeButton($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle, likes);
        addDislikeButton($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle, likes);
        // firebaseToDisplay($("#trending"));
        onYouTubeIframeAPIReady(videoId);
        console.log("the audioID is: " + audioId);
        playAudio(audioId);
    });

    function readFirebaseTrending() {
        var arrayOfTrending = [];
        database.ref().child("trending").orderByChild("upvotes").limitToLast(5).once("value").then(function(snapshot) {
            var snapshot = snapshot.val();
            for (var key in snapshot) {
                var result = new displayItem(snapshot[key].videoTitle, snapshot[key].videoId, snapshot[key].thumbnail);
                result.audioTitle = snapshot[key].audioTitle;
                result.audioId = snapshot[key].audioId;
                result.likes = snapshot[key].upvotes;
                arrayOfTrending.push(result);
            }
            console.log(arrayOfTrending);
            return arrayOfTrending;
        });
    }

    // function firebaseToDisplay(divId){
    //  var displayItemArray = readFirebaseTrending();
    //  console.log(displayItemArray);
    //  for(var i = 0; i < displayItemArray.length; i++){
    //      var displayDiv = $("<div></div>");
    //      displayDiv.addClass("resultCard");
    //      displayDiv.addClass("col-xs-12");
    //      displayDiv.attr("data-thumbnail", displayItemArray[i].thumbnail);
    //      displayDiv.attr("data-audioTitle", displayItemArray[i].audioTitle);
    //      displayDiv.attr("data-videoTitle", displayItemArray[i].videoTitle);
    //      displayDiv.attr("data-videoId", displayItemArray[i].audioId);
    //      displayDiv.attr("data-audioId", displayItemArray[i].audioId);
    //      displayDiv.appendTo(divId);
    //  }
    // }

    function addLikeDisplay(divId, likes) {
        $("<p>").html(likes)
            .attr("id", "likeDisplay")
            .appendTo(divId);
    }

    function chancgeDislikes(divId, likes) {
        console.log("inside of change likes, the likes are: ", likes);
        divId.html(likes--);
    }

    function chancgeLikes(divId, likes) {
        console.log("inside of change likes, the likes are: ", likes);
        divId.html(likes++);
    }

    function addLikeButton(divId, videoId, audioId, thumbnail, videoTitle, audioTitle, likes) {
        $("<button>").html("Likes")
            .attr("id", "upVoteBtn")
            .addClass("btn btn-primary")
            .attr("type", "button")
            .data("videoId", videoId)
            .data("audioId", audioId)
            .data("thumbnail", thumbnail)
            .data("videoTitle", videoTitle)
            .data("audioTitle", audioTitle)
            .data("likes", likes)
            .appendTo(divId)
            .on("click", function() {
                console.log("liked");
                upvoteMashup($(this).data("videoId"), $(this).data("audioId"), $(this)); //firebcse update prop in real time when ready.
                unbindVoteButtons();
            });
            $("#likeDisplay").html("");
    }

    function addDislikeButton(divId, videoId, audioId, thumbnail, videoTitle, audioTitle, likes) {
        $("<button>").html("Dislike ")
            .attr("id", "downVoteBtn")
            .addClass("btn btn-danger")
            .attr("type", "button")
            .data("videoId", videoId)
            .data("audioId", audioId)
            .data("thumbnail", thumbnail)
            .data("videoTitle", videoTitle)
            .data("audioTitle", audioTitle)
            .data("likes", likes)
            .appendTo(divId)
            .on("click", function() {
                console.log("disliked");
                downvoteMashup($(this).data("videoId"), $(this).data("audioId"), $(this));
                //firebcse update prop in real time when ready.
                unbindVoteButtons();

            });
    }

    function addNumberInput(divId, likes) {
        $("<div>").html(likes)
            .attr("type", "text")
            .attr("id", "likesDisplay")
            .appendTo(divId)
    }

    function unbindVoteButtons() {
        $("#upVoteBtn").unbind();
        $("#downVoteBtn").unbind();
    }


    $(".btn-info").on("click", function() {
        // console.log("Yep it working")
    })


});