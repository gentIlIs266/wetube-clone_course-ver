const videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("video");
const timeline = document.querySelector("#timeline");
const controls = document.querySelector("#controls");
const playButton = document.querySelector("#playButton");
const playButtonShape = document.querySelector(".playButtonShape");
const nextVideo = document.querySelector("#nextVideo");
const volumeArea = document.querySelector(".volumeArea");
const muteButton = document.querySelector("#muteButton");
const muteButtonShape = document.querySelector(".muteButtonShape");
const volumeRange = document.querySelector("#volume-range");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const subtitle = document.querySelector("#subtitle");
const config = document.querySelector("#config");
const smallPlayer = document.querySelector("#smallPlayer");
const cinemaMode = document.querySelector("#cinemaMode");
const fullScreen = document.querySelector("#fullScreen");

const timeFormatter = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)

let controlsTimeout = null;
let controlsMovementTimeout = null;
let videoVolume = 0.5;
video.volume = videoVolume;

video.addEventListener("loadedmetadata", (e) => {
    timeline.max = Math.floor(video.duration);
    totalTime.textContent = timeFormatter(Math.floor(video.duration));
})
video.addEventListener("timeupdate", (e) => {
    timeline.value = Math.floor(video.currentTime);
    currentTime.textContent = timeFormatter(Math.floor(video.currentTime));
})
video.addEventListener("mousemove", (e) => {
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    controlsMovementTimeout = setTimeout(() => { controls.classList.remove("controler-active") }, 3000);
    controls.classList.add("controler-active");
})
video.addEventListener("mouseleave", (e) => {
    controls.classList.remove("controler-active");
})
timeline.addEventListener("input", (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value;
})
playButton.addEventListener("click", (e) => {
    if ( video.paused ) {
        video.play();
        playButtonShape.setAttribute("d", "M 12 26 L 16 26 L 16 10 L 12 10 Z M 21 26 L 25 26 L 25 10 L 21 10 Z");
    } else {
        video.pause()
        playButtonShape.setAttribute("d", "M 12 26 L 18.5 22 L 18.5 14 L 12 10 Z M 18.5 22 L 25 18 L 25 18 L 18.5 14 Z");
    }
})
video.volume = 0.5
nextVideo.addEventListener("click", (e) => {} )
muteButton.addEventListener("click", (e) => {
    if ( video.muted ) {
        video.muted = false;
        muteButtonShape.setAttribute("d", "M 8 21 L 12 21 L 17 26 L 17 10 L 12 15 L 8 15 L 8 21 Z M 19 14 L 19 22 C 20.48 21.32 21.5 19.77 21.5 18 C 21.5 16.26 20.48 14.74 19 14 Z");
        volumeRange.value = videoVolume;
    } else {
        video.muted = true;
        muteButtonShape.setAttribute("d", "m 21.48 17.98 c 0 -1.77 -1.02 -3.29 -2.5 -4.03 v 2.21 l 2.45 2.45 c 0.03 -0.2 0.05 -0.41 0.05 -0.63 Z m 2.5 0 c 0 0.94 -0.2 1.82 -0.54 2.64 l 1.51 1.51 c 0.66 -1.24 1.03 -2.65 1.03 -4.15 c 0 -4.28 -2.99 -7.86 -7 -8.76 v 2.05 c 2.89 0.86 5 3.54 5 6.71 Z M 9.25 8.98 l -1.27 1.26 l 4.72 4.73 H 7.98 v 6 H 11.98 l 5 5 v -6.73 l 4.25 4.25 c -0.67 0.52 -1.42 0.93 -2.25 1.18 v 2.06 c 1.38 -0.31 2.63 -0.95 3.69 -1.81 l 2.04 2.05 l 1.27 -1.27 l -9 -9 l -7.72 -7.72 Z m 7.72 0.99 l -2.09 2.08 l 2.09 2.09 V 9.98 Z");
        volumeRange.value = 0;
    }
})
volumeArea.addEventListener("mouseover", (e) => {
    volumeArea.classList.add("volume-slider-active");
    volumeRange.classList.add("volume-control-hover");
})
volumeArea.addEventListener("mouseleave", (e) => {
    volumeArea.classList.remove("volume-slider-active");
    volumeRange.classList.remove("volume-control-hover");
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
subtitle.addEventListener("click", (e) => {} )
config.addEventListener("click", (e) => {} )
smallPlayer.addEventListener("click", (e) => {} )
cinemaMode.addEventListener("click", (e) => {} )
fullScreen.addEventListener("click", (e) => {
    const isFullScreen = document.fullscreenElement;    
    if (isFullScreen) {
        //fullScreen.textContent = "full screen";
        document.exitFullscreen();
    } else {
        //fullScreen.textContent = "exit full screen";
        videoContainer.requestFullscreen();
    }
})  
