// <div class="item">
//     <h2>{{title}}</h2>
//     <iframe class="video w100" width="640" height="360" src="//www.youtube.com/embed/{{videoid}}" frameborder="0" allowfullscreen></iframe>
// </div>

//API key:AIzaSyDsa_IgEMmQB1LC2r251MoZVFJmWr9al8Y
$(function() {
    $("#search-button").on("click", function(e) {
       console.log("before the prevent Defualt");
       e.preventDefault();
       
buildApiRequest('GET',
                '/youtube/v3/search',
                {'maxResults': '25',
                 'part': 'snippet',
                 'q': 'surfing',
                 'type': ''});

       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 3,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
            //videoDuration: "short"
       }); 
       console.log("this is line 15");
       // execute the request
       request.execute(function(response) {
       	console.log("in the execution block");
          var results = response.result;
          $("#trending").html("");
          $.each(results.items, function(index, item) {
            // $.get("tpl/item.html", function(data) {
            //     $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            // });
            $("#trending").append(item.id.videoId+" "+item.snippet.title+"<br>");
            console.log("the video ID is: " + item.id.videoId);
            console.log("the snippet title is: " + item.snippet.title);
          });
          //resetVideoHeight();
       });
    });
    // $(window).on("resize", resetVideoHeight);
});

// function resetVideoHeight() {
//     $(".video").css("height", $("#results").width() * 9/16);
// }

function init() {
    gapi.client.setApiKey("AIzaSyDsa_IgEMmQB1LC2r251MoZVFJmWr9al8Y");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}