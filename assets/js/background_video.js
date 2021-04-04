var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        // height: '390',
        // width: '640',
        videoId: '0k23DVv_xsA',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

function changeVideo(e) {

    if (!e.checkValidity()) { return }
    
    let id;
    let url = e.value;
    
    if (url.includes("?v=")) {
        id = url.substring(url.indexOf("?v=") + 3, url.indexOf("?v=") + 14)
    } else if (url.includes("youtu.be")) {
        id = url.substring(url.indexOf("be/") + 3, url.indexOf("be/") + 14)
    } else {
        return alert("Unsupported URL format - sorry :(");
    }

    console.log(id)
    player.loadVideoById(id);

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(0)
    }
}

function stopVideo() {
    player.stopVideo();
}
