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

function onYouTubeIframeAPIReady(videoId) {
    player = new YT.Player('videoPlayer', {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: { 'controls': 0 },
        events: {
            'onReady': mute,
            'onStateChange': onPlayerStateChange
        }
    });
}

function playAudio(audioId) {
    console.log("hey we are in the playAudio function");
    player = new YT.Player('audioPlayer', {
        height: '0',
        width: '0',
        videoId: audioId,
        playerVars: { 'controls': 0 },
        events: {
            'onReady': blind,
            'onStateChange': onPlayerStateChange
        }

    });
}

// 4. The API will call this function when the video player is ready.
function mute(event) {
    //need to target correct video to mute, and other video to be hidden and play audio.
    event.target.playVideo().mute();
    //hide audio video
    //play audio video sound.
}

function blind(event) {
    //need to target correct video to mute, and other video to be hidden and play audio.
    //event.target.playVideo().hide();
    event.target.playVideo();
    //hide audio video
    //play audio video sound.

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

var done = false;

function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 10000);
    //     //done = true;
    // }
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
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
}

//Still need to test when there are different mashups with the same videoID
function upvoteMashup(activeVideoID, activeAudioID, button) {
    console.log("running");
    database.ref().child("trending").orderByChild('videoID').equalTo(activeVideoID).once("value").then(function(snapshot) {
        var currentSnapshot = snapshot.val();
        console.log(currentSnapshot);
        var theKey = "";
        var theVideoID;
        var theAudioID;
        var theTitle;
        var theThumbnail;
        var currentUpvotes;
        for (var key in currentSnapshot) {
            if (currentSnapshot[key].audioID == activeAudioID) {
                theKey = key;
                currentUpvotes = currentSnapshot[key].upvotes;
                currentUpvotes++;
                database.ref("/trending/" + theKey + "/upvotes").set(currentUpvotes);
                console.log("key is:  " + key);
                console.log("upvotes is: " + currentSnapshot[key].upvotes);
            }
        }
        if (!theKey) {
            saveMashup(button);
        }
    }, function(errorObject) {
        console.log("Failed" + errorObject.code);
        console.log("no match");
        saveMashup(button);
    });
}

function downvoteMashup(activeVideoID, activeAudioID, button) {
    console.log("running");
    database.ref().child("trending").orderByChild('videoID').equalTo(activeVideoID).once("value").then(function(snapshot) {
        var currentSnapshot = snapshot.val();
        console.log(currentSnapshot);
        var theKey = "";
        var theVideoID;
        var theAudioID;
        var theTitle;
        var theThumbnail;
        var currentUpvotes;
        for (var key in currentSnapshot) {
            if (currentSnapshot[key].audioID == activeAudioID) {
                theKey = key;
                currentUpvotes = currentSnapshot[key].upvotes;
                currentUpvotes--;
                database.ref("/trending/" + theKey + "/upvotes").set(currentUpvotes);
                console.log("key is:  " + key);
                console.log("upvotes is: " + currentSnapshot[key].upvotes);
            }
        }
    }, function(errorObject) {
        console.log("Failed" + errorObject.code);
        console.log("no match");
    });
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

})

function displayItem(videoTitle, videoId, thumbnail) {
    this.audioTitle = "";
    this.videoTitle = videoTitle;
    this.audioId = "";
    this.videoId = videoId;
    this.thumbnail = thumbnail;
    this.likes = 0;
}

function display(displayItem, num, isVideo) {
    if (num === 0) {
        $("#main-display").empty();
    }

    //append the new div
    var displayDiv = $("<div></div>");
    displayDiv.addClass("resultCard");
    displayDiv.addClass("col-xs-12");
    displayDiv.attr("data-thumbnail", displayItem.thumbnail);
    displayDiv.attr("data-audioTitle", displayItem.audioTitle);
    displayDiv.attr("data-videoTitle", displayItem.videoTitle);
    if (isVideo) {
        $(displayDiv).attr("data-videoId", displayItem.videoId);
        $(displayDiv).attr("data-audioId", "vEHMpSIhfTE"); //getRandomVideo();
    } else {
        $(displayDiv).attr("data-videoId", "3UUZgiQHlQU"); //getRandomVideo();
        $(displayDiv).attr("data-audioId", displayItem.audioId);
    }

    if (isVideo) {
        // Add image to container
        $("<div>").addClass("col-xs-4")
            .append("<img src='" + displayItem.thumbnail + "' style='margin-bottom:2%' />")
            .addClass("grow")
            // .css("width","100%")
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
            // .css("width","100%")
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
        // console.log('queryString', toQueryString);
        displayResults(response, isVideo);
    });
}
// CANNOT SEPERATE THESE FUNCTION BECAUSE THE "RESPONSE." CALLS ARE REFERENCING NOTHING. LINES 114 - 117
function displayResults(response, isVideo) {
    // console.log("start of for loop");
    for (var i = 0; i < response.items.length; i++) {
        var videoId = response.items[i].id.videoId;
        var title = response.items[i].snippet.title;
        // console.log("response.items.snippet", response.items[i].snippet.thumbnails)
        var thumbnail = response.items[i].snippet.thumbnails.default.url;

        var result = new displayItem(title, videoId, thumbnail);

        if (!isVideo) {
            result.audioId = result.videoId;
            result.videoId = "";
            result.audioTitle = title;
            result.videoTitle = "";
            //likes
        }

        // console.log("about to display the " + i + " element");
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
            console.log("What the heck")
            return;
        }
        queryString.q = $("#search-input1").val().trim();
        loadFromAjax(true);
    });

    $("#audio1").on("click", function() {
        event.preventDefault();

        var emptyInput = $("#search-input1").val();
        if (emptyInput == "") {
            console.log("What the heck")
            return;
        }

        queryString.q = $("#search-input1").val().trim();
        loadFromAjax(false);
    });

    // $(".resultCard").on("click", function() {
    $("body").on("click", ".resultCard", function() {
        event.preventDefault();
        var videoId = $(this).attr("data-videoId");
        var audioId = $(this).attr("data-audioId");
        var thumbnail = $(this).attr("data-thumbnail");
        var videoTitle = $(this).attr("data-videoTitle");
        var audioTitle = $(this).attr("data-audioTitle");

        $("#main-display").empty();
        $("#side-search-bar").empty();
        $("#side-search-bar").append(
            $("<div>").addClass("col-md-2").append(
                $("<div>").addClass("input-group home-small").append(
                    $("<div>").addClass("input-group search"))
                .append(
                    $("<input>").attr("type", "text").attr("id", "search-input1").addClass("form-control-small").attr("placeholder", "Search for..."))
                .append(
                    $("<button>").attr("type", "button").attr("id", "video1").addClass("btn-nav btn-primary btn-xs").text("Video")
                    .on("click", function() {
                        event.preventDefault();
                        loadFromAjax(true);
                    }))
                .append(
                    $("<button>").attr("type", "button").attr("id", "audio1").addClass("btn-nav btn-secondary btn-xs").text("Audio")
                    .on("click", function() {
                        event.preventDefault();
                        loadFromAjax(false);
                    }))
            )
        );
        // <div class="col-md-2">
        //         <div class="input-group home-small">
        //             <div class="input-group search">
        //                 <input type="text" id="search-input" class="form-control-small" placeholder="Search for...">
        //             </div>
        //             <button type="button" id="video" class="btn-nav btn-primary btn-sm">Video</button>
        //             <button type="button" id="song" class="btn-nav btn-secondary btn-sm">Audio</button>
        //         </div>
        //     </div>
        $("#main-display").append("<div id='audioPlayer'></div>");
        $("#main-display").append("<div id='videoPlayer'></div>");
        addNumberInput($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle, 7);
        addLikeButton($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle);
        addDislikeButton($("#main-display"), videoId, audioId, thumbnail, videoTitle, audioTitle);
        onYouTubeIframeAPIReady(videoId);
        console.log("the audioID is: " + audioId);
        playAudio(audioId);
        // console.log('this is vid id', videoId);
    });


    function addLikeButton(divId, videoId, audioId, thumbnail, videoTitle, audioTitle) {

        // console.log('Add Like to ', divId);
        $("<button>").html("Like ")
            .attr("id", "upVoteBtn")
            .addClass("btn btn-primary")
            .attr("type", "button")
            .data("videoId", videoId)
            .data("audioId", audioId)
            .data("thumbnail", thumbnail)
            .data("videoTitle", videoTitle)
            .data("audioTitle", audioTitle)
            .appendTo(divId)
            .on("click", function() {
                console.log("liked");
                upvoteMashup($(this).data("videoId"), $(this).data("audioId"), $(this)); //firebcse update prop in real time when ready.

            });
    }

    function addDislikeButton(divId, videoId, audioId, thumbnail, videoTitle, audioTitle) {
        $("<button>").html("Dislike ")
            .attr("id", "downVoteBtn")
            .addClass("btn btn-danger")
            .attr("type", "button")
            .data("videoId", videoId)
            .data("audioId", audioId)
            .data("thumbnail", thumbnail)
            .data("videoTitle", videoTitle)
            .data("audioTitle", audioTitle)
            .appendTo(divId)
            .on("click", function() {
                console.log("disliked");
                downvoteMashup($(this).data("videoId"), $(this).data("audioId"), $(this));
                //firebcse update prop in real time when ready.
            });
    }

    function addNumberInput(divId, likes) {
        $("<div>").html(likes)
            .attr("type", "text")
            .attr("id", "likesDisplay")
            .appendTo(divId)
    }

    // console.log('Document Loaded...FIRE \'D MISSILES!!!');
    // addLikeButton($("#main-display"));
    // addDislikeButton($("#main-display"));


    $(".btn-info").on("click", function() {
        console.log("Yep it working")
    })
});