const video = document.querySelector("video");
const playButton = document.querySelector("#playButton");
const nextVideo = document.querySelector("#nextVideo");
const muteButton = document.querySelector("#muteButton");
const volumeRange = document.querySelector("#volume-range");
const playTime = document.querySelector("#playTime");
const autoPlay = document.querySelector("#autoPlay");
const subtitle = document.querySelector("#subtitle");
const config = document.querySelector("#config");
const smallPlayer = document.querySelector("#smallPlayer");
const cinemaMode = document.querySelector("#cinemaMode");
const fullScreen = document.querySelector("#fullScreen");

let videoVolume = 0.5;
video.volume = videoVolume;

playButton.addEventListener("click", (e) => {
    if ( video.paused ) {
        video.play();
        playButton.textContent = "pause"
    } else {
        video.pause()
        playButton.textContent = "play"
    }
})
video.volume = 0.5
nextVideo.addEventListener("click", (e) => {} )
muteButton.addEventListener("click", (e) => {
    if ( video.muted ) {
        video.muted = false;
        muteButton.textContent = "Mute"
        volumeRange.value = videoVolume;
    } else {
        video.muted = true;
        muteButton.textContent = "Unmute"
        volumeRange.value = 0;
    }
})
volumeRange.addEventListener("input", (event) => {
    const {
        target: { value }
    } = event;
    videoVolume = value;
    video.volume = value;
    if ( video.muted ) {
        video.muted = false;
        muteButton.textContent = "Mute"
    }
})
autoPlay.addEventListener("click", (e) => {} )
subtitle.addEventListener("click", (e) => {} )
config.addEventListener("click", (e) => {} )
smallPlayer.addEventListener("click", (e) => {} )
cinemaMode.addEventListener("click", (e) => {} )
fullScreen.addEventListener("click", (e) => {} )
